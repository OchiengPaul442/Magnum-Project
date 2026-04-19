// Student service URLs
export const STUDENT_URLS = {
  GET_STUDENTS: '/getstudentsunderschool',
  REGISTER_STUDENT: '/registerstudent',
  ACTIVATE_STUDENT: '/activatestudent',
  DEACTIVATE_STUDENT: '/deactivatestudent',
  GET_STUDENT_DETAILS: '/getstudentdetails',
  RESET_CARD_PIN: '/schoolresetcardpin',
} as const;

// Student service configuration
export const STUDENT_CONFIG = {
  SECURE: true,
  BASE_RESOURCE: 'students',
  TIMEOUT: 15000,
} as const;
