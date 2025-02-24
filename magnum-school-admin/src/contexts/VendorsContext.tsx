'use client';
import { VendorDataItem } from '@/types/vendors';
import React, { createContext, useContext, useState } from 'react';

interface VendorsContextProps {
  selectedVendor: VendorDataItem | null;
  setSelectedVendor: (vendor: VendorDataItem | null) => void;
}

const VendorsContext = createContext<VendorsContextProps>({
  selectedVendor: null,
  setSelectedVendor: () => {},
});

export const VendorsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedVendor, setSelectedVendor] = useState<VendorDataItem | null>(
    null,
  );

  return (
    <VendorsContext.Provider value={{ selectedVendor, setSelectedVendor }}>
      {children}
    </VendorsContext.Provider>
  );
};

export const useVendorsContext = () => useContext(VendorsContext);
