// Student service URLs
export const STUDENT_URLS = {
  GET_STUDENTS: '/getstudentsunderschool/',
  REGISTER_STUDENT: '/registerstudent/',
  ACTIVATE_STUDENT: '/activatestudent/',
  DEACTIVATE_STUDENT: '/deactivatestudent/',
  UPDATE_STUDENT: '/updatestudent/',
  DELETE_STUDENT: '/deletestudent/',
  GET_STUDENT_DETAILS: '/getstudentdetails/',
  GET_STUDENT_TRANSACTIONS: '/getstudenttransactions/',
  GET_STUDENT_DETAILS_POST: '/getstudentdetails/',
} as const;

// Student service configuration
export const STUDENT_CONFIG = {
  SECURE: true,
  BASE_RESOURCE: 'students',
  TIMEOUT: 15000,
} as const;
