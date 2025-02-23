'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CustomButton from '@/components/shared/CustomButton';
import AddStudentForm from '../forms/AddStudentForm';
import { useStudentData } from '@/@core/hooks/useStudentData';

export function AddStudentDialog() {
  const { refetch } = useStudentData();
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    refetch();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton
          type="button"
          onClick={() => setOpen(true)}
          text="Add a student"
          className="bg-purple-700 text-sm gap-4 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition duration-200 flex items-center"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>
        <AddStudentForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
