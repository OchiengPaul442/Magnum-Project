import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    userCategory?: string;
    accessToken?: string;
    // add any extra fields from your API
  }

  interface Session {
    user: User;
    // any extra session fields you want to store
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    userCategory?: string;
    accessToken?: string;
    // any extra JWT fields
  }
}
