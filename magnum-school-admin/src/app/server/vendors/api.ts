export {
  getVendorData,
  registerNewVendor,
  activateVendor,
  deactivateVendor,
  updateVendor,
  deleteVendor,
  getVendorDetails,
  getVendorTransactions,
  getVendorEntityDetailsBySchool,
} from './service';

// Legacy export aliases for backward compatibility
export { getVendorData as getVendors } from './service';
