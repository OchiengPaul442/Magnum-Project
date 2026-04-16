const TOKEN_KEY = "magnum_admin_token";
const REFRESH_KEY = "magnum_admin_refresh_token";
const AUTH_COOKIE = "magnum_admin_auth";

const isBrowser = () => typeof window !== "undefined";

export function getAuthToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setAuthSession(token: string, refreshToken?: string | null) {
  if (!isBrowser()) return;
  window.localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) {
    window.localStorage.setItem(REFRESH_KEY, refreshToken);
  } else {
    window.localStorage.removeItem(REFRESH_KEY);
  }
  document.cookie = `${AUTH_COOKIE}=1; path=/; sameSite=Lax`;
}

export function clearAuthSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
  document.cookie = `${AUTH_COOKIE}=; Max-Age=0; path=/; sameSite=Lax`;
}

export function hasAuthCookie(cookies?: string) {
  const source = cookies ?? (isBrowser() ? document.cookie : "");
  return source
    .split(";")
    .some((cookie) => cookie.trim().startsWith(`${AUTH_COOKIE}=`));
}
