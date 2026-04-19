import axios from "axios";

import { apiClient, noAuthConfig } from "@/lib/api/client";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface VerifyOtpPayload {
  username: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
  purpose: "login";
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type AuthServiceError = Error & {
  status?: number;
  statusMessage?: string;
};

const getTrimmedString = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const extractErrorMessage = (value: unknown): string | null => {
  const stringValue = getTrimmedString(value);
  if (stringValue) {
    return stringValue;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = extractErrorMessage(item);
      if (message) {
        return message;
      }
    }
    return null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const directKeys = [
    "message",
    "detail",
    "error",
    "statusMessage",
    "non_field_errors",
    "nonFieldErrors",
  ];

  for (const key of directKeys) {
    const message = extractErrorMessage(record[key]);
    if (message) {
      return message;
    }
  }

  for (const child of Object.values(record)) {
    const message = extractErrorMessage(child);
    if (message) {
      return message;
    }
  }

  return null;
};

const toAuthServiceError = (
  error: unknown,
  fallbackMessage: string,
): AuthServiceError => {
  if (axios.isAxiosError(error)) {
    const message =
      extractErrorMessage(error.response?.data) ??
      getTrimmedString(error.response?.statusText) ??
      getTrimmedString(error.message) ??
      fallbackMessage;

    const authError = new Error(message) as AuthServiceError;
    authError.status = error.response?.status;
    authError.statusMessage = message;
    return authError;
  }

  if (error instanceof Error) {
    const message = getTrimmedString(error.message) ?? fallbackMessage;
    const authError = new Error(message) as AuthServiceError;
    authError.statusMessage = message;
    return authError;
  }

  const authError = new Error(fallbackMessage) as AuthServiceError;
  authError.statusMessage = fallbackMessage;
  return authError;
};

const requestAuth = async <T>(
  request: () => Promise<{ data: T }>,
  fallbackMessage: string,
) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    throw toAuthServiceError(error, fallbackMessage);
  }
};

export const getAuthErrorMessage = (
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again.",
) => {
  if (error && typeof error === "object") {
    const candidate = error as AuthServiceError & {
      response?: { data?: unknown; statusText?: string };
    };

    const directMessage =
      getTrimmedString(candidate.statusMessage) ??
      getTrimmedString(candidate.message);

    if (directMessage) {
      return directMessage;
    }

    const responseMessage =
      extractErrorMessage(candidate.response?.data) ??
      getTrimmedString(candidate.response?.statusText);

    if (responseMessage) {
      return responseMessage;
    }
  }

  if (axios.isAxiosError(error)) {
    const message =
      extractErrorMessage(error.response?.data) ??
      getTrimmedString(error.response?.statusText) ??
      getTrimmedString(error.message);

    if (message) {
      return message;
    }
  }

  return (
    getTrimmedString(fallbackMessage) ??
    "Something went wrong. Please try again."
  );
};

export const authApi = {
  login: async (payload: LoginPayload) => {
    return requestAuth(
      () => apiClient.post("/api/login/", payload, noAuthConfig),
      "Unable to sign in. Please try again.",
    );
  },
  verifyOtp: async (payload: VerifyOtpPayload) => {
    return requestAuth(
      () =>
        apiClient.post(
          "/api/verifyotp/",
          {
            username: payload.username,
            one_time_pin: payload.otp,
          },
          noAuthConfig,
        ),
      "Unable to verify the code. Please try again.",
    );
  },
  resendOtp: async (payload: ResendOtpPayload) => {
    return requestAuth(
      () => apiClient.post("/api/resendotp/", payload, noAuthConfig),
      "Unable to resend the code. Please try again.",
    );
  },
  refreshToken: async (refreshToken: string) => {
    return requestAuth(
      () =>
        apiClient.post(
          "/api/refreshtoken/",
          {
            refresh_token: refreshToken,
          },
          noAuthConfig,
        ),
      "Unable to refresh your session. Please try again.",
    );
  },
  forgotPassword: async (payload: ForgotPasswordPayload) => {
    return requestAuth(
      () => apiClient.post("/api/forgotpassword/", payload, noAuthConfig),
      "Unable to start password reset. Please try again.",
    );
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    return requestAuth(
      () =>
        apiClient.post(
          "/api/resetpassword/",
          {
            email: payload.email,
            otp: payload.otp,
            new_password: payload.newPassword,
            confirm_password: payload.confirmPassword,
          },
          noAuthConfig,
        ),
      "Unable to reset the password. Please try again.",
    );
  },
  changePassword: async (payload: ChangePasswordPayload) => {
    return requestAuth(
      () =>
        apiClient.post("/api/changepassword/", {
          old_password: payload.oldPassword,
          new_password: payload.newPassword,
          confirm_password: payload.confirmPassword,
        }),
      "Unable to change the password. Please try again.",
    );
  },
  logout: async (refreshToken: string) => {
    return requestAuth(
      () =>
        apiClient.post("/api/logout/", {
          refresh_token: refreshToken,
        }),
      "Unable to log out. Please try again.",
    );
  },
  logoutAll: async () => {
    return requestAuth(
      () => apiClient.post("/api/logoutall/", {}),
      "Unable to log out of all sessions. Please try again.",
    );
  },
  getProfile: async () => {
    return requestAuth(
      () => apiClient.get("/api/getuserprofile/"),
      "Unable to load your profile. Please try again.",
    );
  },
};
