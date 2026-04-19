'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import Sidebar from './Sidebar';

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] border-0 p-0 shadow-none">
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <Sidebar mobile onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
