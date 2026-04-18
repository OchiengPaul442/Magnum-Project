import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      category?: string | null;
      image?: string | null;
    };
    accessTokenExpiresAt?: number;
    refreshTokenExpiresAt?: number;
    error?: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    category?: string | null;
    image?: string | null;
    accessToken?: string;
    refreshToken?: string | null;
    accessTokenExpiresAt?: number;
    refreshTokenExpiresAt?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string | null;
    accessTokenExpiresAt?: number;
    refreshTokenExpiresAt?: number;
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      category?: string | null;
      image?: string | null;
    };
    error?: string;
  }
}
