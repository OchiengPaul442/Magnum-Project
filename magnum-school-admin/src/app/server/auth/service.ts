import { createService } from '@/@core/utils/serviceFactory';
import { AUTH_URLS, AUTH_CONFIG } from './urls';
import type {
  SignInResponse,
  VerifyOTPResponse,
  ResendOTPResponse,
  ChangePasswordResponse,
} from '@/@core/types/auth';

// Create auth service instance
const authService = createService({
  secure: AUTH_CONFIG.SECURE,
});

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
  const response = await authService.post<SignInResponse>(AUTH_URLS.LOGIN, {
    username: email,
    password,
  });

  return response.data;
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
  const response = await authService.post<VerifyOTPResponse>(
    AUTH_URLS.VERIFY_OTP,
    {
      username: email,
      one_time_pin: otp,
    },
  );

  return response.data;
};

/**
 * Handles OTP resend by sending the username to the API.
 * @param email User's email.
 * @returns ResendOTPResponse
 */
export const handleResendOTP = async (
  email: string,
): Promise<ResendOTPResponse> => {
  const response = await authService.post<ResendOTPResponse>(
    AUTH_URLS.RESEND_OTP,
    {
      username: email,
    },
  );

  return response.data;
};

/**
 * Handles forgot password request by sending the email to the API.
 * @param email User's email.
 * @returns Basic response
 */
export const handleForgotPassword = async (email: string) => {
  const response = await authService.post(AUTH_URLS.FORGOT_PASSWORD, {
    username: email,
  });

  return response.data;
};

/**
 * Handles password change by sending the new password to the API.
 * @param email User's email.
 * @param newPassword New password.
 * @param otp One-time password.
 * @returns ChangePasswordResponse
 */
export const handleChangePassword = async (
  email: string,
  newPassword: string,
  otp: string,
): Promise<ChangePasswordResponse> => {
  const response = await authService.post<ChangePasswordResponse>(
    AUTH_URLS.CHANGE_PASSWORD,
    {
      username: email,
      new_password: newPassword,
      one_time_pin: otp,
    },
  );

  return response.data;
};

/**
 * Handles user logout
 */
export const handleLogout = async () => {
  const response = await authService.post(AUTH_URLS.LOGOUT);

  return response.data;
};
