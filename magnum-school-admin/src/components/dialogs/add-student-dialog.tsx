'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CustomButton from '@/components/shared/CustomButton';
import AddStudentForm from '../forms/AddStudentForm';

export function AddStudentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomButton
          type="button"
          onClick={() => null} // DialogTrigger handles opening
          text="Add a student"
          className="bg-purple-700 text-sm gap-4 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition duration-200 flex items-center"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>
        <AddStudentForm />
      </DialogContent>
    </Dialog>
  );
}
