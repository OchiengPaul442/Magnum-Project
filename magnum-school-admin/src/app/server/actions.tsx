// app/server/actions.tsx

'use server';

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    const response = await axios.post<SignInResponse>(`${API_URL}/login/`, {
      username: email,
      password,
    });

    return response.data;
  } catch (error: any) {
    // Handle errors appropriately
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
    const response = await axios.post<VerifyOTPResponse>(
      `${API_URL}/verifyotp/`,
      {
        username: email,
        one_time_pin: otp,
      },
    );

    return response.data;
  } catch (error: any) {
    // Handle errors appropriately
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
 * @returns ResendOTPResponse
 */
export const handleResendOTP = async (
  email: string,
  purpose: string = 'login',
): Promise<ResendOTPResponse> => {
  try {
    const response = await axios.post<ResendOTPResponse>(
      `${API_URL}/resendotp/`,
      {
        email,
        purpose,
      },
    );

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
