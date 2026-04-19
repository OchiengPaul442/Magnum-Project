// Types for API responses
export interface AuthUserPayload {
  user_data: {
    id: number;
    user_profile_picture: string | null;
    first_name: string;
    last_name: string;
    email: string;
    user_category: string;
  };
  first_time_login?: boolean;
  token: string;
  refresh_token?: string;
  refreshToken?: string;
}

export interface SignInResponse {
  message: string;
  requires_otp: boolean;
  status: number;
  token?: string;
  refresh_token?: string;
  refreshToken?: string;
  user_data?: AuthUserPayload | { user_data?: AuthUserPayload };
}

export interface VerifyOTPResponse {
  message: string;
  user_data: AuthUserPayload;
  status: number;
}

export interface ResendOTPResponse {
  message: string;
  status: number;
}

export interface ChangePasswordResponse {
  status: number;
  message: string;
}
