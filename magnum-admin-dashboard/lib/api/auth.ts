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

export const authApi = {
  login: async (payload: LoginPayload) => {
    const response = await apiClient.post("/api/login/", payload, noAuthConfig);
    return response.data;
  },
  verifyOtp: async (payload: VerifyOtpPayload) => {
    const response = await apiClient.post(
      "/api/verifyotp/",
      payload,
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
    const response = await apiClient.post("/api/refreshtoken/", {
      refresh_token: refreshToken,
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
