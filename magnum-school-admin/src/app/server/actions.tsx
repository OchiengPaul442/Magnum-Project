import { getApiClient } from '@/utils/apiClient';

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

/**
 * Handles user sign-in by sending credentials to the API.
 * @param email User's email.
 * @param password User's password.
 * @returns SignInResponse
 */
export const handleSignIn = async (
  email: string,
  password: string,
): Promise<SignInResponse> => {
  try {
    const client = await getApiClient(false);
    const response = await client.post<SignInResponse>('/login/', {
      username: email,
      password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message || 'An error occurred during sign-in.',
      );
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

/**
 * Handles OTP verification by sending the OTP and username to the API.
 * @param email User's email.
 * @param otp One-time password.
 * @returns VerifyOTPResponse
 */
export const handleVerifyOTP = async (
  email: string,
  otp: string,
): Promise<VerifyOTPResponse> => {
  try {
    const client = await getApiClient(false);
    const response = await client.post<VerifyOTPResponse>('/verifyotp/', {
      username: email,
      one_time_pin: otp,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message ||
          'An error occurred during OTP verification.',
      );
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

/**
 * Handles resending OTP by sending the username to the API.
 * @param email User's email.
 * @param purpose Purpose of OTP (default is 'login').
 * @returns ResendOTPResponse
 */
export const handleResendOTP = async (
  email: string,
  purpose: string = 'login',
): Promise<ResendOTPResponse> => {
  try {
    const client = await getApiClient(false);
    const response = await client.post<ResendOTPResponse>('/resendotp/', {
      email,
      purpose,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message || 'An error occurred during OTP resend.',
      );
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

/**
 * Handles password change by sending the required details to the API.
 * @param oldPassword User's current password.
 * @param newPassword New password.
 * @param confirmPassword Confirmation of the new password.
 * @returns ChangePasswordResponse
 */
export const handleChangePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
): Promise<ChangePasswordResponse> => {
  try {
    const client = await getApiClient(true);
    const response = await client.post<ChangePasswordResponse>(
      '/changepassword/',
      {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const apiError: any = error.response.data;
      throw new Error(
        apiError.message || 'An error occurred during password change.',
      );
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};
