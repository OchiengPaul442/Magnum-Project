import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import { handleSignIn, handleVerifyOTP } from '@/services/auth/service';
import type { User } from 'next-auth';
import type {
  AuthUserPayload,
  SignInResponse,
  VerifyOTPResponse,
} from '@/types/auth';

const API_BASE_URL = process.env.MAGNUM_API_BASE_URL || '';
const DEFAULT_ACCESS_TOKEN_TTL_MS = 55 * 60 * 1000;
const EXPIRY_BUFFER_MS = 60 * 1000;

const toApiBase = () => {
  if (!API_BASE_URL) return null;
  return API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
};

const getAccessTokenExpiry = (payload: Record<string, any>) => {
  const expiresIn =
    payload?.expires_in ||
    payload?.expiresIn ||
    payload?.token_expires_in ||
    payload?.access_token_expires_in;

  if (!expiresIn) return Date.now() + DEFAULT_ACCESS_TOKEN_TTL_MS;

  const asNumber = Number(expiresIn);
  return Number.isFinite(asNumber)
    ? Date.now() + asNumber * 1000
    : Date.now() + DEFAULT_ACCESS_TOKEN_TTL_MS;
};

const extractAuthPayload = (
  response: SignInResponse | VerifyOTPResponse,
): {
  userData?: AuthUserPayload['user_data'];
  accessToken?: string;
  refreshToken?: string;
  firstTimeLogin?: boolean;
} => {
  const payload: any = (response as any).user_data ?? response;
  const nestedPayload: any = payload?.user_data ?? payload;

  const userData =
    nestedPayload?.user_data || payload?.user_data?.user_data || payload?.user;
  const accessToken =
    nestedPayload?.token ||
    payload?.token ||
    (response as any)?.token ||
    (response as any)?.access_token;
  const refreshToken =
    nestedPayload?.refresh_token ||
    nestedPayload?.refreshToken ||
    payload?.refresh_token ||
    payload?.refreshToken ||
    (response as any)?.refresh_token ||
    (response as any)?.refreshToken;
  const firstTimeLogin =
    nestedPayload?.first_time_login ||
    payload?.first_time_login ||
    (response as any)?.first_time_login ||
    false;

  return { userData, accessToken, refreshToken, firstTimeLogin };
};

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  if (!token.refreshToken) {
    return { ...token, error: 'RefreshTokenMissing' };
  }

  const base = toApiBase();
  if (!base) {
    return { ...token, error: 'MissingApiBaseUrl' };
  }

  try {
    const response = await fetch(new URL('refreshtoken/', base), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    });

    if (!response.ok) {
      return { ...token, error: 'RefreshAccessTokenError' };
    }

    const data = await response.json().catch(() => null);
    if (!data) {
      return { ...token, error: 'RefreshAccessTokenError' };
    }

    const { accessToken, refreshToken } = extractAuthPayload(data);
    if (!accessToken) {
      return { ...token, error: 'RefreshAccessTokenError' };
    }

    return {
      ...token,
      accessToken,
      refreshToken: refreshToken || token.refreshToken,
      accessTokenExpires: getAccessTokenExpiry(data),
      error: undefined,
    };
  } catch {
    return { ...token, error: 'RefreshAccessTokenError' };
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'admin@innolink.com',
        },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) {
          throw new Error('No credentials provided');
        }

        const { email, password, otp } = credentials;

        if (!email) {
          throw new Error('Email is required');
        }

        try {
          // Step 1: Initial sign-in with email/password
          if (!otp) {
            const signInResponse = await handleSignIn(email, password || '');

            if (!signInResponse) {
              throw new Error('Failed to start sign in');
            }

            if (signInResponse.requires_otp || signInResponse.status === 202) {
              throw new Error('OTP_REQUIRED');
            }

            if (signInResponse.status >= 400) {
              throw new Error(signInResponse.message || 'Failed to sign in');
            }

            const { userData, accessToken, refreshToken, firstTimeLogin } =
              extractAuthPayload(signInResponse);

            if (!accessToken) {
              throw new Error(signInResponse.message || 'Failed to sign in');
            }

            return {
              id: userData?.id?.toString() || '0',
              name:
                userData?.first_name && userData?.last_name
                  ? `${userData.first_name} ${userData.last_name}`
                  : 'User',
              email: userData?.email || email,
              image: userData?.user_profile_picture || null,
              userCategory: userData?.user_category || '',
              accessToken,
              refreshToken: refreshToken || undefined,
              first_time_login: firstTimeLogin || false,
              accessTokenExpires: getAccessTokenExpiry(signInResponse as any),
            } as User;
          }

          // Step 2: OTP verification
          const verifyResponse = await handleVerifyOTP(email, otp);

          if (!verifyResponse) {
            throw new Error('Failed to verify OTP');
          }

          if (verifyResponse.status >= 200 && verifyResponse.status < 300) {
            const { userData, accessToken, refreshToken, firstTimeLogin } =
              extractAuthPayload(verifyResponse);

            if (!accessToken) {
              throw new Error(verifyResponse.message || 'Invalid OTP');
            }

            return {
              id: userData?.id?.toString() || '0',
              name:
                userData?.first_name && userData?.last_name
                  ? `${userData.first_name} ${userData.last_name}`
                  : 'User',
              email: userData?.email || email,
              image: userData?.user_profile_picture || null,
              userCategory: userData?.user_category || '',
              accessToken,
              refreshToken: refreshToken || undefined,
              first_time_login: firstTimeLogin || false,
              accessTokenExpires: getAccessTokenExpiry(verifyResponse as any),
            } as User;
          }

          throw new Error(verifyResponse.message || 'Invalid OTP');
        } catch (error: any) {
          if (error.message === 'OTP_REQUIRED') {
            throw new Error('OTP_REQUIRED');
          }
          throw new Error(error.message || 'Failed to sign in');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    /**
     * The 'jwt' callback is called whenever a token is created or updated.
     * We use it to attach custom properties (like token, userCategory, etc.) to the JWT.
     */
    async jwt({ token, user }): Promise<any> {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image || null;
        token.userCategory = user.userCategory || '';
        token.accessToken = (user as any).accessToken || '';
        token.refreshToken = (user as any).refreshToken || '';
        token.first_time_login = user.first_time_login || false;
        token.accessTokenExpires =
          (user as any).accessTokenExpires ||
          Date.now() + DEFAULT_ACCESS_TOKEN_TTL_MS;
        token.error = undefined;
      }

      if (token.error === 'RefreshAccessTokenError') {
        return token;
      }

      if (!token.accessTokenExpires) {
        return token;
      }

      if (Date.now() < token.accessTokenExpires - EXPIRY_BUFFER_MS) {
        return token;
      }

      return refreshAccessToken(token as JWT);
    },

    /**
     * The 'session' callback is called whenever a session is checked.
     * We use it to pass custom properties from the JWT to the session.
     */
    async session({ session, token }): Promise<any> {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name || '';
        session.user.email = token.email || '';
        session.user.image = token.picture || null;
        session.user.userCategory = token.userCategory || '';
        session.user.first_time_login = token.first_time_login || false;
      }
      if (token.error) {
        (session as any).error = token.error;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
