// Types for API responses
export interface SignInResponse {
  message: string;
  requires_otp: boolean;
  status: number;
}

export interface VerifyOTPResponse {
  message: string;
  user_data: {
    user_data: {
      id: number;
      user_profile_picture: string | null;
      first_name: string;
      last_name: string;
      email: string;
      user_category: string;
    };
    first_time_login: boolean;
    token: string;
  };
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
