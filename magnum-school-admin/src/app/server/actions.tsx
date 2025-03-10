import {
  ChangePasswordResponse,
  ResendOTPResponse,
  SignInResponse,
  VerifyOTPResponse,
} from '@/@core/types/auth';
import apiClient, { secureApiClient } from '@/@core/utils/apiClient';
import { handleApiError } from '@/@core/utils/handleApiErrors';

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
    const response = await apiClient.post<SignInResponse>('/login/', {
      username: email,
      password,
    });
    return response.data;
  } catch (error: any) {
    return handleApiError(error);
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
    const response = await apiClient.post<VerifyOTPResponse>('/verifyotp/', {
      username: email,
      one_time_pin: otp,
    });
    return response.data;
  } catch (error: any) {
    return handleApiError(error);
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
    const response = await apiClient.post<ResendOTPResponse>('/resendotp/', {
      email,
      purpose,
    });
    return response.data;
  } catch (error: any) {
    return handleApiError(error);
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
    const response = await secureApiClient.post<ChangePasswordResponse>(
      '/changepassword/',
      {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
    );
    return response.data;
  } catch (error: any) {
    return handleApiError(error);
  }
};

/**
 * Handle Forgot Password by sending the required details to the API.
 * @param email User's email.
 * @returns ResendOTPResponse
 */
export const handleForgotPassword = async (
  email: string,
): Promise<ResendOTPResponse> => {
  try {
    const response = await apiClient.post<ResendOTPResponse>(
      '/forgotpassword/',
      {
        email,
      },
    );
    return response.data;
  } catch (error: any) {
    return handleApiError(error);
  }
};
