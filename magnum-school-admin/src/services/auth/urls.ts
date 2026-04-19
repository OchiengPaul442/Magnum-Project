// Authentication service URLs
export const AUTH_URLS = {
  LOGIN: '/auth/login',
  VERIFY_OTP: '/auth/verifyotp',
  RESEND_OTP: '/auth/resendotp',
  FORGOT_PASSWORD: '/auth/forgotpassword',
  CHANGE_PASSWORD: '/auth/changepassword',
  RESET_PASSWORD: '/auth/resetpassword',
  LOGOUT: '/auth/logout',
  GET_USER_PROFILE: '/auth/getuserprofile',
} as const;

// Authentication service configuration
export const AUTH_CONFIG = {
  SECURE: false, // Login/OTP/reset endpoints are public; secure service used for protected endpoints
  BASE_RESOURCE: 'auth',
  TIMEOUT: 10000,
} as const;
