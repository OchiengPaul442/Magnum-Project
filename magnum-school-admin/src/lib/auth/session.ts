const asRecord = (value: unknown) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
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

const getString = (value: unknown) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const hasOtpLikeMessage = (message: string) => {
  const normalized = message.toLowerCase();
  return (
    normalized.includes('otp') ||
    normalized.includes('verification') ||
    normalized.includes('code')
  );
};

export const getResponseMessage = (data: unknown) => {
  const response = resolveResponseObject(data);
  if (!response) {
    return null;
  }

  const message =
    getString(response.message) ??
    getString(response.detail) ??
    getString(response.error) ??
    getString(response.non_field_errors);

  return message;
};

export const hasOtpRequirement = (data: unknown) => {
  const response = resolveResponseObject(data);
  if (!response) {
    return false;
  }

  const message = getResponseMessage(response);

  return Boolean(
    response.requires_otp ??
    response.requiresOtp ??
    response.otp_required ??
    response.otpRequired ??
    (typeof response.status === 'number' &&
      response.status >= 200 &&
      response.status < 300 &&
      message &&
      hasOtpLikeMessage(message)),
  );
};
