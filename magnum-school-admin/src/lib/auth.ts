import NextAuth, { type NextAuthOptions, type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';

import { createAuthError, AUTH_ERROR_CODES } from '@/lib/auth/flow';
import { getResponseMessage, hasOtpRequirement } from '@/lib/auth/session';
import { getAuthSecret } from '@/lib/auth/secret';
import { handleSignIn, handleVerifyOTP } from '@/services/auth/service';
import type {
  AuthUserPayload,
  SignInResponse,
  VerifyOTPResponse,
} from '@/types/auth';

const API_BASE_URL = process.env.MAGNUM_API_BASE_URL || '';
const DEFAULT_ACCESS_TOKEN_TTL_MS = 55 * 60 * 1000;
const DEFAULT_REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const EXPIRY_BUFFER_MS = 60 * 1000;

const toApiBase = () => {
  if (!API_BASE_URL) {
    return null;
  }

  return API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
};

const toStringValue = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const toBooleanValue = (value: unknown) => {
  return value === true || value === 'true' || value === 1 || value === '1';
};

const getAccessTokenExpiry = (payload: unknown) => {
  const root = isRecord(payload) ? payload : {};
  const candidateSources = [
    root,
    isRecord(root.user_data) ? root.user_data : null,
    isRecord(root.userData) ? root.userData : null,
    isRecord(root.data) ? root.data : null,
  ].filter(Boolean) as Record<string, unknown>[];

  for (const source of candidateSources) {
    const expiresIn =
      source.expires_in ||
      source.expiresIn ||
      source.token_expires_in ||
      source.access_token_expires_in;

    if (!expiresIn) {
      continue;
    }

    const asNumber = Number(expiresIn);
    if (Number.isFinite(asNumber)) {
      return Date.now() + asNumber * 1000;
    }
  }

  return Date.now() + DEFAULT_ACCESS_TOKEN_TTL_MS;
};

const getRefreshTokenExpiry = (payload: unknown) => {
  const root = isRecord(payload) ? payload : {};
  const candidateSources = [
    root,
    isRecord(root.user_data) ? root.user_data : null,
    isRecord(root.userData) ? root.userData : null,
    isRecord(root.data) ? root.data : null,
  ].filter(Boolean) as Record<string, unknown>[];

  for (const source of candidateSources) {
    const expiresIn =
      source.refresh_token_expires_in ||
      source.refreshTokenExpiresIn ||
      source.refresh_expires_in ||
      source.refreshExpiresIn;

    if (!expiresIn) {
      continue;
    }

    const asNumber = Number(expiresIn);
    if (Number.isFinite(asNumber)) {
      return Date.now() + asNumber * 1000;
    }
  }

  return Date.now() + DEFAULT_REFRESH_TOKEN_TTL_MS;
};

const extractAuthPayload = (
  response: SignInResponse | VerifyOTPResponse | Record<string, unknown>,
): {
  userData?: AuthUserPayload['user_data'];
  accessToken?: string;
  refreshToken?: string;
  firstTimeLogin?: boolean;
} => {
  const root = isRecord(response) ? response : {};
  const container =
    (isRecord(root.user_data) ? root.user_data : null) ||
    (isRecord(root.userData) ? root.userData : null) ||
    (isRecord(root.data) ? root.data : null) ||
    root;

  const nestedUserData =
    (isRecord(container.user_data) ? container.user_data : null) ||
    (isRecord(container.userData) ? container.userData : null) ||
    (isRecord(container.user) ? container.user : null);

  const accessToken =
    toStringValue(container.token) ||
    toStringValue(container.access_token) ||
    toStringValue(root.token) ||
    toStringValue(root.access_token);

  const refreshToken =
    toStringValue(container.refresh_token) ||
    toStringValue(container.refreshToken) ||
    toStringValue(root.refresh_token) ||
    toStringValue(root.refreshToken);

  const firstTimeLogin = toBooleanValue(
    container.first_time_login ||
      container.firstTimeLogin ||
      root.first_time_login ||
      root.firstTimeLogin,
  );

  return {
    userData: (nestedUserData || container) as AuthUserPayload['user_data'],
    accessToken,
    refreshToken,
    firstTimeLogin,
  };
};

const buildAuthUser = (
  response: SignInResponse | VerifyOTPResponse,
  fallbackEmail: string,
): User => {
  const { userData, accessToken, refreshToken, firstTimeLogin } =
    extractAuthPayload(response);
  const refreshTokenExpires = getRefreshTokenExpiry(response);

  if (!accessToken) {
    throw new Error(getResponseMessage(response) || 'Authentication failed');
  }

  const displayName =
    userData?.first_name && userData?.last_name
      ? `${userData.first_name} ${userData.last_name}`
      : userData?.first_name || userData?.last_name || 'User';

  return {
    id: String(userData?.id ?? fallbackEmail ?? '0'),
    name: displayName,
    email: userData?.email || fallbackEmail,
    image: userData?.user_profile_picture || null,
    userCategory: userData?.user_category || '',
    accessToken,
    refreshToken: refreshToken || undefined,
    first_time_login: firstTimeLogin,
    accessTokenExpires: getAccessTokenExpiry(response),
    refreshTokenExpires,
    school: userData?.school || null,
  } as User;
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
    const refreshTokenExpires = getRefreshTokenExpiry(data);
    if (!accessToken) {
      return { ...token, error: 'RefreshAccessTokenError' };
    }

    return {
      ...token,
      accessToken,
      refreshToken: refreshToken || token.refreshToken,
      accessTokenExpires: getAccessTokenExpiry(data),
      refreshTokenExpires,
      error: undefined,
    };
  } catch {
    return { ...token, error: 'RefreshAccessTokenError' };
  }
};

const isSuccessfulResponse = (status?: number) => {
  if (typeof status !== 'number') {
    return false;
  }

  return status >= 200 && status < 300;
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

        const email = credentials.email?.trim() || '';
        const password = credentials.password?.toString() || '';
        const otp = credentials.otp?.toString().trim() || '';

        if (!email) {
          throw new Error('Email is required');
        }

        try {
          if (otp) {
            const verifyResponse = await handleVerifyOTP(email, otp);

            if (!verifyResponse) {
              throw new Error('Failed to verify OTP');
            }

            if (!isSuccessfulResponse(verifyResponse.status)) {
              throw new Error(
                getResponseMessage(verifyResponse) || 'Invalid OTP',
              );
            }

            return buildAuthUser(verifyResponse, email);
          }

          if (!password) {
            throw new Error('Password is required');
          }

          const signInResponse = await handleSignIn(email, password);

          if (!signInResponse) {
            throw new Error('Failed to start sign in');
          }

          const signInStatus = Number(signInResponse.status);
          const signInMessage = getResponseMessage(signInResponse);
          const signInPayload = extractAuthPayload(signInResponse);

          const requiresOtp =
            hasOtpRequirement(signInResponse) ||
            (isSuccessfulResponse(signInStatus) && !signInPayload.accessToken);

          if (requiresOtp) {
            throw new Error(
              createAuthError(
                AUTH_ERROR_CODES.OTP_REQUIRED,
                signInMessage ||
                  'OTP sent to your email. Check your inbox to continue.',
              ),
            );
          }

          if (!isSuccessfulResponse(signInStatus)) {
            throw new Error(signInMessage || 'Failed to sign in');
          }

          return buildAuthUser(signInResponse, email);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message.startsWith('OTP_REQUIRED::')
          ) {
            throw error;
          }

          const message = error instanceof Error ? error.message : '';
          throw new Error(message || 'Failed to sign in');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
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
        token.refreshTokenExpires =
          (user as any).refreshTokenExpires ||
          Date.now() + DEFAULT_REFRESH_TOKEN_TTL_MS;
        token.school = (user as any).school || null;
        token.error = undefined;
      }

      if (
        token.error === 'RefreshAccessTokenError' ||
        token.error === 'RefreshTokenMissing' ||
        token.error === 'RefreshTokenExpired'
      ) {
        return token;
      }

      if (!token.accessTokenExpires && !token.refreshTokenExpires) {
        return token;
      }

      const accessTokenNeedsRefresh =
        typeof token.accessTokenExpires === 'number' &&
        Date.now() >= token.accessTokenExpires - EXPIRY_BUFFER_MS;
      const refreshTokenNeedsRefresh =
        typeof token.refreshTokenExpires === 'number' &&
        Date.now() >= token.refreshTokenExpires - EXPIRY_BUFFER_MS;

      if (!accessTokenNeedsRefresh && !refreshTokenNeedsRefresh) {
        return token;
      }

      if (
        typeof token.refreshTokenExpires === 'number' &&
        Date.now() >= token.refreshTokenExpires
      ) {
        return { ...token, error: 'RefreshTokenExpired' };
      }

      return refreshAccessToken(token as JWT);
    },
    async session({ session, token }): Promise<any> {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name || '';
        session.user.email = token.email || '';
        session.user.image = token.picture || null;
        session.user.userCategory = token.userCategory || '';
        session.user.first_time_login = token.first_time_login || false;
        session.user.accessTokenExpires = token.accessTokenExpires;
        session.user.refreshTokenExpires = token.refreshTokenExpires;
        session.user.school = token.school || null;
      }

      if (token.error) {
        (session as any).error = token.error;
      }

      return session;
    },
  },
  secret: getAuthSecret(),
};

export default NextAuth(authOptions);
