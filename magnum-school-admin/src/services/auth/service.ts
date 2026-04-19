import { publicApi, isAxiosError } from '@/lib/api/enhancedApiClient';
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
): Promise<SignInResponse> => {
  try {
    const response = await publicApi.post(AUTH_URLS.LOGIN, {
      username: email,
      password,
    });

    return {
      ...(response.data as any),
      status: response.status,
    } as SignInResponse;
  } catch (error: any) {
    if (isAxiosError(error) && error.response) {
      const message =
        error.response.data?.message ||
        error.response.statusText ||
        `Request failed with status ${error.response.status}`;
      const e: any = new Error(message);
      e.status = error.response.status;
      // Attach statusMessage so UI helpers prefer API-provided messages
      e.statusMessage = error.response.data?.message || message;
      throw e;
    }

    throw error;
  }
};

export const handleVerifyOTP = async (
  email: string,
  otp: string,
): Promise<VerifyOTPResponse> => {
  try {
    const response = await publicApi.post(AUTH_URLS.VERIFY_OTP, {
      username: email,
      one_time_pin: otp,
    });

    return {
      ...(response.data as any),
      status: response.status,
    } as VerifyOTPResponse;
  } catch (error: any) {
    if (isAxiosError(error) && error.response) {
      const message =
        error.response.data?.message ||
        error.response.statusText ||
        `Request failed with status ${error.response.status}`;
      const e: any = new Error(message);
      e.status = error.response.status;
      e.statusMessage = error.response.data?.message || message;
      throw e;
    }

    throw error;
  }
};

export const handleResendOTP = async (
  email: string,
): Promise<ResendOTPResponse> => {
  try {
    const response = await publicApi.post(AUTH_URLS.RESEND_OTP, {
      email,
      purpose: 'login',
    });

    return {
      ...(response.data as any),
      status: response.status,
    } as ResendOTPResponse;
  } catch (error: any) {
    if (isAxiosError(error) && error.response) {
      const message =
        error.response.data?.message ||
        error.response.statusText ||
        `Request failed with status ${error.response.status}`;
      const e: any = new Error(message);
      e.status = error.response.status;
      e.statusMessage = error.response.data?.message || message;
      throw e;
    }

    throw error;
  }
};

export const handleForgotPassword = async (email: string) =>
  publicApi.post(AUTH_URLS.FORGOT_PASSWORD, {
    email,
  });

export const handleResetPassword = async (body: {
  email: string;
  otp: string;
  new_password: string;
  confirm_password: string;
}): Promise<any> => publicApi.post(AUTH_URLS.RESET_PASSWORD, body);

export const handleChangePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
): Promise<ChangePasswordResponse> => {
  const response = await publicApi.post(AUTH_URLS.CHANGE_PASSWORD, {
    old_password: oldPassword,
    new_password: newPassword,
    confirm_password: confirmPassword,
  });

  return {
    ...(response.data as any),
    status: response.status,
  } as ChangePasswordResponse;
};

export const handleLogout = async (refreshToken?: string) =>
  publicApi.post(AUTH_URLS.LOGOUT, {
    ...(refreshToken ? { refresh_token: refreshToken } : {}),
  });

export const getUserProfile = async (): Promise<any> =>
  publicApi.get(AUTH_URLS.GET_USER_PROFILE);
