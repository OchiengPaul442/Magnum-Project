// Re-export all auth functions from the new auth service
export {
  handleSignIn,
  handleVerifyOTP,
  handleResendOTP,
  handleForgotPassword,
  handleChangePassword,
  handleLogout,
} from './auth/service';

// Re-export student functions
export {
  getStudentData,
  registerNewStudent,
  activateStudent,
  deactivateStudent,
  updateStudent,
  deleteStudent,
  getStudentDetails,
  getStudentTransactions,
} from './students/service';

// Re-export vendor functions
export {
  getVendorData,
  registerNewVendor,
  activateVendor,
  deactivateVendor,
  updateVendor,
  deleteVendor,
  getVendorDetails,
  getVendorTransactions,
} from './vendors/service';

// Re-export dashboard functions
export {
  getAnalytics,
  getRecentTransactions,
  getActivityFeed,
  getStatistics,
} from './dashboard/service';
