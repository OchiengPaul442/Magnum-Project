'use client';

import React, { createContext, useContext, useState } from 'react';

export interface VendorDataItem {
  id: string;
  name: string; // e.g. full name or vendor name
  email: string;
  canteenName: string;
  status: 'Activated' | 'Deactivated';
  raw: any; // full vendor object returned from the API
}

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
