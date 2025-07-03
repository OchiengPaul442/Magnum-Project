// Re-export all vendor functions from the new service
export {
  getVendorData,
  registerNewVendor,
  activateVendor,
  deactivateVendor,
  updateVendor,
  deleteVendor,
  getVendorDetails,
  getVendorTransactions,
} from './service';

// Legacy export aliases for backward compatibility
export { getVendorData as getVendors } from './service';
