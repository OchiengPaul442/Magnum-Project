// Third-party Imports
import NextAuth from 'next-auth';

// Lib Imports
import { authOptions } from '@lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
