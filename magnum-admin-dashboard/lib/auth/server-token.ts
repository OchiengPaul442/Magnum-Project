import { cookies, headers } from "next/headers";
import { getToken, type JWT } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

const isUsableToken = (token: JWT) => {
  if (token.error === "RefreshAccessTokenError") {
    return false;
  }

  if (
    typeof token.refreshTokenExpiresAt === "number" &&
    Date.now() >= token.refreshTokenExpiresAt
  ) {
    return false;
  }

  return Boolean(token.accessToken && token.refreshToken);
};

export const getServerAuthToken = async () => {
  const requestCookies = await cookies();
  const requestHeaders = await headers();

  const token = await getToken({
    req: {
      cookies: requestCookies,
      headers: requestHeaders,
    } as never,
    secret,
  });

  if (!token || !isUsableToken(token)) {
    return null;
  }

  return token;
};
