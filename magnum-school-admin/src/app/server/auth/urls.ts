// Authentication service URLs
export const AUTH_URLS = {
  LOGIN: '/login/',
  VERIFY_OTP: '/verifyotp/',
  RESEND_OTP: '/resendotp/',
  FORGOT_PASSWORD: '/forgotpassword/',
  CHANGE_PASSWORD: '/changepassword/',
  RESET_PASSWORD: '/resetpassword/',
  LOGOUT: '/logout/',
} as const;

// Authentication service configuration
export const AUTH_CONFIG = {
  SECURE: false, // Auth endpoints are typically public
  BASE_RESOURCE: 'auth',
  TIMEOUT: 10000,
} as const;
