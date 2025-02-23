import useSWR from 'swr';
import {
  activateVendor,
  deactivateVendor,
  getVendors,
} from '@/app/server/vendors/api';
import { VendorsData } from '@/types/vendors';
import { swrOptions } from '../swrConfigs';
import useSWRMutation from 'swr/mutation';

export const useVendorData = () => {
  const { data, error, isLoading, mutate } = useSWR<VendorsData>(
    'vendorData',
    getVendors,
    swrOptions,
  );

  return {
    vendors: data?.vendors || [],
    isLoading,
    isError: error,
    refetch: mutate,
  };
};

export const useRegisterNewVendor = () => {
  const registerNewVendor = async (body: any) => {
    console.log(body);
  };
  const isRegistering = false;

  return { registerNewVendor, isRegistering };
};

export const useActivateVendor = () => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    '/activatevendor',
    (_: string, { arg }: { arg: { vendor_id: string } }) => activateVendor(arg),
  );

  return {
    // Call trigger with an object { vendor_id: string } to activate a vendor.
    activateVendor: trigger,
    data,
    error,
    isActivating: isMutating,
  };
};

export const useDeactivateVendor = () => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    '/deactivatevendor',
    (_: string, { arg }: { arg: { vendor_id: string } }) =>
      deactivateVendor(arg),
  );

  return {
    // Call trigger with an object { vendor_id: string } to deactivate a vendor.
    deactivateVendor: trigger,
    data,
    error,
    isDeactivating: isMutating,
  };
};
