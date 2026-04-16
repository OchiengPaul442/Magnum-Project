const asRecord = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const resolveResponseObject = (data: unknown) => {
  const response = asRecord(data);
  if (!response) {
    return null;
  }

  return (
    asRecord(response.user_data) ??
    asRecord(response.userData) ??
    asRecord(response.data) ??
    response
  );
};

export const extractToken = (data: unknown) => {
  const response = resolveResponseObject(data);
  if (!response) {
    return null;
  }

  return (
    (response.token as string | undefined) ||
    (response.access_token as string | undefined) ||
    (response.accessToken as string | undefined) ||
    (response.access as string | undefined) ||
    null
  );
};

export const extractRefreshToken = (data: unknown) => {
  const response = resolveResponseObject(data);
  if (!response) {
    return null;
  }

  return (
    (response.refresh_token as string | undefined) ||
    (response.refreshToken as string | undefined) ||
    (response.refresh as string | undefined) ||
    null
  );
};

export const extractProfile = (data: unknown) => {
  const response = resolveResponseObject(data);
  if (!response) {
    return null;
  }

  const candidate =
    asRecord(response.user_data) ??
    asRecord(response.profile) ??
    asRecord(response.user_profile) ??
    asRecord(response.userProfile) ??
    asRecord(response.user) ??
    null;

  if (candidate) {
    return candidate;
  }

  const looksLikeProfile =
    "email" in response ||
    "first_name" in response ||
    "firstname" in response ||
    "last_name" in response ||
    "lastname" in response;

  return looksLikeProfile ? response : null;
};

const toNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

export const extractTokenExpiry = (data: unknown) => {
  const response = resolveResponseObject(data);
  if (!response) {
    return { accessTokenExpiresIn: null, refreshTokenExpiresIn: null };
  }

  const accessTokenExpiresIn = toNumber(
    response.access_token_expires_in ??
      response.accessTokenExpiresIn ??
      response.access_token_expiry ??
      response.accessTokenExpiry ??
      response.expires_in ??
      response.expiresIn,
  );

  const refreshTokenExpiresIn = toNumber(
    response.refresh_token_expires_in ??
      response.refreshTokenExpiresIn ??
      response.refresh_token_expiry ??
      response.refreshTokenExpiry,
  );

  return { accessTokenExpiresIn, refreshTokenExpiresIn };
};

export const hasOtpRequirement = (data: unknown) => {
  const response = resolveResponseObject(data);
  if (!response) {
    return false;
  }

  return Boolean(
    response.requires_otp ??
    response.requiresOtp ??
    response.otp_required ??
    response.otpRequired,
  );
};
