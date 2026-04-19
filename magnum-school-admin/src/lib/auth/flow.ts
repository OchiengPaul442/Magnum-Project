import type { Session } from 'next-auth';

const AUTH_ERROR_SEPARATOR = '::';

export const AUTH_ERROR_CODES = {
  OTP_REQUIRED: 'OTP_REQUIRED',
} as const;

type QueryLike = {
  get(name: string): string | null;
};

export interface ParsedAuthError {
  code: string;
  message: string;
  raw: string;
}

export const normalizeCallbackUrl = (
  value: string | null | undefined,
  fallback = '/dashboard',
) => {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();

  if (
    !trimmed ||
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.includes('://')
  ) {
    return fallback;
  }

  return trimmed;
};

export const resolveCallbackUrl = (
  params: QueryLike,
  fallback = '/dashboard',
) =>
  normalizeCallbackUrl(
    params.get('callbackUrl') ?? params.get('next') ?? params.get('redirectTo'),
    fallback,
  );

export const createAuthError = (code: string, message?: string) => {
  return `${code}${AUTH_ERROR_SEPARATOR}${encodeURIComponent(message || '')}`;
};

export const parseAuthError = (
  value: string | null | undefined,
): ParsedAuthError | null => {
  if (!value) {
    return null;
  }

  const separatorIndex = value.indexOf(AUTH_ERROR_SEPARATOR);
  if (separatorIndex === -1) {
    return {
      code: value,
      message: '',
      raw: value,
    };
  }

  const code = value.slice(0, separatorIndex);
  const encodedMessage = value.slice(
    separatorIndex + AUTH_ERROR_SEPARATOR.length,
  );

  let message = encodedMessage;

  if (encodedMessage) {
    try {
      message = decodeURIComponent(encodedMessage);
    } catch {
      message = encodedMessage;
    }
  } else {
    message = '';
  }

  return {
    code,
    message,
    raw: value,
  };
};

export const isOtpRequiredError = (value: string | null | undefined) =>
  parseAuthError(value)?.code === AUTH_ERROR_CODES.OTP_REQUIRED;

export const buildVerifyOtpPath = (email: string, callbackUrl: string) => {
  const params = new URLSearchParams();
  params.set('email', email);
  params.set('callbackUrl', callbackUrl);

  return `/verify-otp?${params.toString()}`;
};

export const buildCreatePasswordPath = (callbackUrl: string) => {
  const params = new URLSearchParams();
  params.set('callbackUrl', callbackUrl);

  return `/create-password?${params.toString()}`;
};

export const getPostAuthRedirect = (
  session: Pick<Session, 'user'> | null | undefined,
  callbackUrl: string,
) => {
  if (session?.user?.first_time_login) {
    return buildCreatePasswordPath(callbackUrl);
  }

  return callbackUrl;
};
