import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    userCategory?: string;
    accessToken?: string;
    refreshToken?: string;
    first_time_login?: boolean;
    accessTokenExpires?: number;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userCategory?: string;
      first_time_login?: boolean;
    };
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    userCategory?: string;
    accessToken?: string;
    refreshToken?: string;
    first_time_login?: boolean;
    accessTokenExpires?: number;
    error?: string;
  }
}

/**
 * Extends the NextRequest interface from 'next/server' to include the 'nextauth' property.
 */
declare module 'next/server' {
  interface NextRequest {
    nextauth: {
      token: JWT | null; // Token can be null if not authenticated
      session: Session | null; // Session can be null if not authenticated
    };
  }
}
