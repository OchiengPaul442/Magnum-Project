'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import Sidebar from './Sidebar';
import { closeSidebar } from '@/redux-store/slices/sidebarSlice';
import { useDispatch, useSelector } from '@/redux-store/hooks';

const MobileSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          dispatch(closeSidebar());
        }
      }}
    >
      {/* 
        Instead of w-64, we can use w-[260px] or any narrower value that suits 
        your design. Also removing extra padding so the sidebar fits neatly. 
      */}
      <SheetContent side="left" className="w-[260px] p-0">
        <SheetHeader className="px-4 sr-only pt-4 pb-2">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <Sidebar mobile />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
