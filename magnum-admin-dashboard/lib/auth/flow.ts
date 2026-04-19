const DEFAULT_AUTH_REDIRECT = "/dashboard";

const isSafeRelativePath = (value: string) =>
  value.startsWith("/") && !value.startsWith("//") && !value.includes("://");

export const LOGIN_PENDING_USER_KEY = "magnum_pending_user";
export const RESET_EMAIL_KEY = "magnum_reset_email";

export const normalizeCallbackUrl = (
  value: string | null | undefined,
  fallback = DEFAULT_AUTH_REDIRECT,
) => {
  const candidate = value?.trim();
  if (!candidate) {
    return fallback;
  }

  return isSafeRelativePath(candidate) ? candidate : fallback;
};

export const resolveCallbackUrl = (
  searchParams: { get(name: string): string | null },
  fallback = DEFAULT_AUTH_REDIRECT,
) =>
  normalizeCallbackUrl(
    searchParams.get("next") ??
      searchParams.get("callbackUrl") ??
      searchParams.get("redirectTo"),
    fallback,
  );

export const buildVerifyOtpPath = (email: string, callbackUrl: string) => {
  const searchParams = new URLSearchParams();
  searchParams.set("email", email);
  searchParams.set("next", normalizeCallbackUrl(callbackUrl));
  return `/verify-otp?${searchParams.toString()}`;
};

export const buildResetPasswordPath = (
  email: string,
  callbackUrl?: string | null,
) => {
  const searchParams = new URLSearchParams();
  if (email.trim()) {
    searchParams.set("email", email.trim());
  }

  if (callbackUrl) {
    searchParams.set("next", normalizeCallbackUrl(callbackUrl));
  }

  return `/reset-password?${searchParams.toString()}`;
};
