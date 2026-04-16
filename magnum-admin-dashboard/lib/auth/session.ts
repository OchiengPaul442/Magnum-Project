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

  return (
    asRecord(response.profile) ??
    asRecord(response.user_profile) ??
    asRecord(response.userProfile) ??
    response
  );
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
