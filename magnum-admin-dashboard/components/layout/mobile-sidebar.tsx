"use client";

import React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Sidebar from "@/components/layout/sidebar";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileSidebar({
  open,
  onOpenChange,
}: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] border-0 p-0 shadow-none">
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <Sidebar mobile />
      </SheetContent>
    </Sheet>
  );
}
