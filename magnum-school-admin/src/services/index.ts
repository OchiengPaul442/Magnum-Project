// Re-export all auth functions from the new auth service
export {
  handleSignIn,
  handleVerifyOTP,
  handleResendOTP,
  handleForgotPassword,
  handleChangePassword,
  handleLogout,
  handleResetPassword,
  getUserProfile,
} from './auth/service';

// Re-export student functions
export {
  getStudentData,
  registerNewStudent,
  activateStudent,
  deactivateStudent,
  getStudentDetails,
} from './students/service';

// Re-export vendor functions
export {
  getVendorData,
  getVendorEntityDetailsBySchool,
  updateVendorEntityStatusBySchool,
  onboardVendorWithOwner,
} from './vendors/service';

// Re-export dashboard functions
export { getAnalytics } from './dashboard/service';
