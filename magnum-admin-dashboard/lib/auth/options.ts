import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import { captureError } from "@/lib/logging";
import {
  extractProfile,
  extractRefreshToken,
  extractToken,
  extractTokenExpiry,
  hasOtpRequirement,
} from "@/lib/auth/session";
import { TOKEN_REFRESH_BUFFER_MS } from "@/lib/auth/refresh-window";

const API_BASE_URL = process.env.MAGNUM_API_BASE_URL;

const buildApiUrl = (path: string) => {
  const base = API_BASE_URL?.replace(/\/$/, "");
  return base ? `${base}${path}` : "";
};

const getString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const pickFirst = (source: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = getString(source[key]);
    if (value) {
      return value;
    }
  }
  return null;
};

const pickIdentifier = (source: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return null;
};

const toUser = (data: unknown, username: string) => {
  const profile = extractProfile(data);
  const accessToken = extractToken(data);

  if (!profile || !accessToken) {
    return null;
  }

  const refreshToken = extractRefreshToken(data);
  const { accessTokenExpiresIn, refreshTokenExpiresIn } =
    extractTokenExpiry(data);

  const firstName = pickFirst(profile, [
    "first_name",
    "firstname",
    "firstName",
  ]);
  const lastName = pickFirst(profile, ["last_name", "lastname", "lastName"]);
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const email = pickFirst(profile, ["email"]) ?? username;
  const id =
    pickIdentifier(profile, ["id", "user_id", "profile_id", "account_id"]) ??
    email ??
    username;

  const image = pickFirst(profile, [
    "user_profile_picture",
    "profile_picture",
    "avatar",
    "image",
  ]);

  return {
    id,
    name: fullName || pickFirst(profile, ["name"]) || email || "Admin",
    email,
    firstName,
    lastName,
    category:
      pickFirst(profile, ["user_category", "category", "role"]) ?? "Admin",
    image,
    accessToken,
    refreshToken,
    accessTokenExpiresAt: accessTokenExpiresIn
      ? Date.now() + accessTokenExpiresIn * 1000
      : undefined,
    refreshTokenExpiresAt: refreshTokenExpiresIn
      ? Date.now() + refreshTokenExpiresIn * 1000
      : undefined,
  };
};

const clearExpiredToken = (token: JWT) => ({
  ...token,
  accessToken: undefined,
  refreshToken: undefined,
  accessTokenExpiresAt: undefined,
  refreshTokenExpiresAt: undefined,
  error: "RefreshAccessTokenError",
});

const shouldRefreshToken = (token: JWT) => {
  const expiries = [
    token.accessTokenExpiresAt,
    token.refreshTokenExpiresAt,
  ].filter(
    (expiry): expiry is number =>
      typeof expiry === "number" && Number.isFinite(expiry),
  );

  if (expiries.length === 0) {
    return Boolean(token.refreshToken);
  }

  const nextExpiry = Math.min(...expiries);
  return Date.now() >= nextExpiry - TOKEN_REFRESH_BUFFER_MS;
};

const refreshAccessToken = async (token: JWT) => {
  if (!API_BASE_URL || !token.refreshToken) {
    return clearExpiredToken(token);
  }

  try {
    const response = await fetch(buildApiUrl("/api/refreshtoken/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload) {
      return clearExpiredToken(token);
    }

    const nextAccessToken = extractToken(payload);
    const nextRefreshToken = extractRefreshToken(payload) ?? token.refreshToken;
    const { accessTokenExpiresIn, refreshTokenExpiresIn } =
      extractTokenExpiry(payload);

    if (!nextAccessToken) {
      return clearExpiredToken(token);
    }

    return {
      ...token,
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
      accessTokenExpiresAt: accessTokenExpiresIn
        ? Date.now() + accessTokenExpiresIn * 1000
        : token.accessTokenExpiresAt,
      refreshTokenExpiresAt: refreshTokenExpiresIn
        ? Date.now() + refreshTokenExpiresIn * 1000
        : token.refreshTokenExpiresAt,
      error: undefined,
    };
  } catch (error) {
    captureError(error, { source: "nextauth-refresh" });
    return clearExpiredToken(token);
  }
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Magnum OTP",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        verifiedPayload: { label: "Verified payload", type: "text" },
      },
      async authorize(credentials) {
        if (!API_BASE_URL || !credentials?.username) {
          return null;
        }

        const username = credentials.username.trim();
        const verifiedPayload = getString(credentials.verifiedPayload);
        const otp = getString(credentials.otp);
        const password = getString(credentials.password);
        const isOtpFlow = Boolean(otp);

        if (verifiedPayload) {
          try {
            const parsedPayload = JSON.parse(verifiedPayload) as unknown;
            return toUser(parsedPayload, username);
          } catch (error) {
            captureError(error, { source: "nextauth-authorize-payload" });
            return null;
          }
        }

        if (!isOtpFlow && !password) {
          return null;
        }

        const endpoint = isOtpFlow ? "/api/verifyotp/" : "/api/login/";
        const payload = isOtpFlow
          ? { username, one_time_pin: otp }
          : { username, password };

        try {
          const response = await fetch(buildApiUrl(endpoint), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await response.json().catch(() => null);
          if (!response.ok || !data) {
            return null;
          }

          if (!isOtpFlow && hasOtpRequirement(data)) {
            return null;
          }

          return toUser(data, username);
        } catch (error) {
          captureError(error, { source: "nextauth-authorize" });
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as typeof user & {
          accessToken?: string;
          refreshToken?: string;
          accessTokenExpiresAt?: number;
          refreshTokenExpiresAt?: number;
          firstName?: string | null;
          lastName?: string | null;
          category?: string | null;
          image?: string | null;
        };

        token.accessToken = typedUser.accessToken;
        token.refreshToken = typedUser.refreshToken;
        token.accessTokenExpiresAt = typedUser.accessTokenExpiresAt;
        token.refreshTokenExpiresAt = typedUser.refreshTokenExpiresAt;
        token.user = {
          id: String(typedUser.id ?? token.sub ?? ""),
          email: typedUser.email ?? null,
          name: typedUser.name ?? null,
          firstName: typedUser.firstName ?? null,
          lastName: typedUser.lastName ?? null,
          category: typedUser.category ?? null,
          image: typedUser.image ?? null,
        };
      }

      if (
        token.refreshTokenExpiresAt &&
        Date.now() >= token.refreshTokenExpiresAt
      ) {
        return clearExpiredToken(token);
      }

      if (!shouldRefreshToken(token)) {
        return token;
      }

      if (!token.refreshToken) {
        return clearExpiredToken(token);
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
          id: token.user.id,
        };
      }

      if (token.error) {
        session.error = token.error as string;
      }

      session.accessTokenExpiresAt = token.accessTokenExpiresAt;
      session.refreshTokenExpiresAt = token.refreshTokenExpiresAt;

      return session;
    },
  },
};
