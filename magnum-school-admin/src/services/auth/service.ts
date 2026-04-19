import { authApi } from '@/lib/api/authClient';
import type {
  ChangePasswordResponse,
  ResendOTPResponse,
  SignInResponse,
  VerifyOTPResponse,
} from '@/types/auth';
import { AUTH_URLS } from './urls';

export const handleSignIn = async (
  email: string,
  password: string,
): Promise<SignInResponse> =>
  authApi.post<SignInResponse>(AUTH_URLS.LOGIN, {
    username: email,
    password,
  });

export const handleVerifyOTP = async (
  email: string,
  otp: string,
): Promise<VerifyOTPResponse> =>
  authApi.post<VerifyOTPResponse>(AUTH_URLS.VERIFY_OTP, {
    username: email,
    one_time_pin: otp,
  });

export const handleResendOTP = async (
  email: string,
): Promise<ResendOTPResponse> =>
  authApi.post<ResendOTPResponse>(AUTH_URLS.RESEND_OTP, {
    email,
    purpose: 'login',
  });

export const handleForgotPassword = async (email: string) =>
  authApi.post(AUTH_URLS.FORGOT_PASSWORD, {
    email,
  });

export const handleResetPassword = async (body: {
  email: string;
  otp: string;
  new_password: string;
  confirm_password: string;
}): Promise<any> => authApi.post(AUTH_URLS.RESET_PASSWORD, body);

export const handleChangePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
): Promise<ChangePasswordResponse> =>
  authApi.post<ChangePasswordResponse>(AUTH_URLS.CHANGE_PASSWORD, {
    old_password: oldPassword,
    new_password: newPassword,
    confirm_password: confirmPassword,
  });

export const handleLogout = async (refreshToken?: string) =>
  authApi.post(AUTH_URLS.LOGOUT, {
    ...(refreshToken ? { refresh_token: refreshToken } : {}),
  });

export const getUserProfile = async (): Promise<any> =>
  authApi.get(AUTH_URLS.GET_USER_PROFILE);
