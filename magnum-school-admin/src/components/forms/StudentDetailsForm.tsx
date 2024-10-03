'use client';
import React from 'react';
import { CustomInputField, CustomButton } from '../ui';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/navigation';

const StudentDetailsForm = ({ stdID }: any) => {
  const router = useRouter();
  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-semibold text-gray-900">Student Details</h2>

        <div className="flex items-center gap-4">
          <CustomButton
            type="button"
            onClick={() => null}
            text="Deactivate card"
            className="py-1 px-4 border-2 text-purple-700 border-purple-700 hover:bg-purple-400 hover:text-white rounded-full bg-transparent"
          />

          <button type="button" onClick={() => router.push('/students')}>
            <MdClose className=" text-gray-500 text-2xl hover:text-gray-900 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Student Details Section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <CustomInputField
          label="Student Name"
          type="text"
          placeholder="Enter student name"
          value="Namulindwa Lisa"
        />
        <CustomInputField
          label="Card Number"
          type="text"
          placeholder="Enter card number"
          value="ADC 556 5678035"
        />
        <CustomInputField
          label="Current Balance"
          type="text"
          placeholder="Enter current balance"
          value="UGX 243,000"
        />
      </div>

      {/* Student's Parents Section */}
      <h2 className="text-md font-semibold text-gray-900 mb-4">
        Student's Parents
      </h2>
      <div className="grid grid-cols-2 gap-6 mb-4">
        <CustomInputField
          label="Primary Parent"
          type="text"
          placeholder="Enter primary parent name"
          value="Mulindwa Jeffrey"
        />
        <CustomInputField
          label="Other Parents"
          type="text"
          placeholder="Enter other parent name"
          value="Mutesi Darline"
        />
      </div>
    </div>
  );
};

export default StudentDetailsForm;
