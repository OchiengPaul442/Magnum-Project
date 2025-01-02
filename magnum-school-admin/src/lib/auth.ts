import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';

import {
  handleSignIn,
  handleVerifyOTP,
  VerifyOTPResponse,
} from '@/app/server/actions';

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
          // Step 1: No OTP => Initial sign-in with email/password
          if (!otp) {
            const signInResponse = await handleSignIn(email, password || '');

            if (signInResponse.status !== 200) {
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
              accessToken: (verifyResponse.user_data as any).token,
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
    async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image || null;
        token.userCategory = user.userCategory || '';
        token.accessToken = (user as any).accessToken || '';
      }
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name || '';
        session.user.email = token.email || '';
        session.user.image = token.picture || null;
        session.user.userCategory = token.userCategory || '';
        session.user.accessToken = token.accessToken || '';

        // If you stored a custom 'accessToken' or other fields in the JWT, attach them here
        // (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
