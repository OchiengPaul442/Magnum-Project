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

export const authApi = {
  login: async (payload: LoginPayload) => {
    const response = await apiClient.post("/api/login/", payload, noAuthConfig);
    return response.data;
  },
  verifyOtp: async (payload: VerifyOtpPayload) => {
    const response = await apiClient.post(
      "/api/verifyotp/",
      {
        username: payload.username,
        one_time_pin: payload.otp,
      },
      noAuthConfig,
    );
    return response.data;
  },
  resendOtp: async (payload: ResendOtpPayload) => {
    const response = await apiClient.post(
      "/api/resendotp/",
      payload,
      noAuthConfig,
    );
    return response.data;
  },
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post(
      "/api/refreshtoken/",
      {
        refresh_token: refreshToken,
      },
      noAuthConfig,
    );
    return response.data;
  },
  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const response = await apiClient.post(
      "/api/forgotpassword/",
      payload,
      noAuthConfig,
    );
    return response.data;
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    const response = await apiClient.post(
      "/api/resetpassword/",
      {
        email: payload.email,
        otp: payload.otp,
        new_password: payload.newPassword,
        confirm_password: payload.confirmPassword,
      },
      noAuthConfig,
    );
    return response.data;
  },
  changePassword: async (payload: ChangePasswordPayload) => {
    const response = await apiClient.post("/api/changepassword/", {
      old_password: payload.oldPassword,
      new_password: payload.newPassword,
      confirm_password: payload.confirmPassword,
    });
    return response.data;
  },
  logout: async (refreshToken: string) => {
    const response = await apiClient.post("/api/logout/", {
      refresh_token: refreshToken,
    });
    return response.data;
  },
  logoutAll: async () => {
    const response = await apiClient.post("/api/logoutall/", {});
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get("/api/getuserprofile/");
    return response.data;
  },
};
