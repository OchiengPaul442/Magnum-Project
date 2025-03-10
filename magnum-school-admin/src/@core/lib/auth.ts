import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { handleSignIn, handleVerifyOTP } from '@/app/server/actions';
import { VerifyOTPResponse } from '@/types/auth';
import { User } from 'next-auth';

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

            if (signInResponse.status !== 202) {
              throw new Error(signInResponse.message || 'Failed to sign in');
            }

            if (signInResponse.requires_otp) {
              throw new Error('OTP_REQUIRED');
            }

            // If OTP is not required
            return {
              id: '0',
              name: 'User',
              email,
              image: null,
            };
          }

          // Step 2: OTP verification
          const verifyResponse: VerifyOTPResponse = await handleVerifyOTP(
            email,
            otp,
          );

          if (verifyResponse.status === 202) {
            const userData = verifyResponse.user_data.user_data;
            return {
              id: userData.id.toString(),
              name: `${userData.first_name} ${userData.last_name}`,
              email: userData.email,
              image: userData.user_profile_picture,
              userCategory: userData.user_category,
              accessToken: verifyResponse.user_data.token,
              first_time_login: verifyResponse.user_data.first_time_login,
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
        token.first_time_login = user.first_time_login || false;
      }
      return token;
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
        session.user.accessToken = token.accessToken || '';
        session.user.first_time_login = token.first_time_login || false;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
