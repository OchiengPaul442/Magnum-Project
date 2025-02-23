'use client';

import React from 'react';
import { MdClose } from 'react-icons/md';
import { CustomInputField, CustomButton } from '@/components/shared';
import {
  useActivateStudent,
  useDeactivateStudent,
  useStudentData,
} from '@/@core/hooks/useStudentData';
import { toast } from 'sonner';

interface ParentData {
  user_name: string;
  user_contact: string;
  user_email: string;
  parent_student_relation: string;
}

interface StudentDetails {
  id: string;
  ssid: string;
  student_first_name: string;
  student_last_name: string;
  student_account_balance: string;
  card_number: string;
  status: 'active' | 'inactive';
  parents: ParentData[];
}

interface StudentDetailsFormProps {
  student: StudentDetails;
  onClose?: () => void;
}

const StudentDetailsForm: React.FC<StudentDetailsFormProps> = ({
  student,
  onClose,
}) => {
  const { activateStudent, isActivating } = useActivateStudent();
  const { deactivateStudent, isDeactivating } = useDeactivateStudent();
  const { refetch } = useStudentData();

  const handleToggleCard = async () => {
    try {
      const updatedStatus = student.status === 'active' ? 'inactive' : 'active';
      if (student.status === 'active') {
        await deactivateStudent({ student_id: student.id });
        toast.success('Student card deactivated successfully!');
      } else {
        await activateStudent({ student_id: student.id });
        toast.success('Student card activated successfully!');
      }
      // Optionally update local status for immediate UI feedback.
      student.status = updatedStatus;
      // Refetch student data globally.
      refetch();
    } catch (err) {
      console.error('Error toggling card status:', err);
      toast.error('Error toggling card status. Please try again.');
    }
  };

  const parentNames = student.parents.map((p) => p.user_name).join(', ');

  // Determine button text
  const buttonText =
    isActivating || isDeactivating
      ? 'Processing...'
      : student.status === 'active'
        ? 'Deactivate card'
        : 'Activate card';

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-semibold text-gray-900">Student Details</h2>
        <div className="flex items-center gap-4">
          <CustomButton
            type="button"
            onClick={handleToggleCard}
            loading={isActivating || isDeactivating}
            text={buttonText}
            className="py-1 px-4 border-2 text-purple-700 border-purple-700 hover:bg-purple-400 hover:text-white rounded-full bg-transparent"
          />
          <button type="button" onClick={onClose}>
            <MdClose className="text-gray-500 text-2xl hover:text-gray-900 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Student Details Section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <CustomInputField
          label="Student Name"
          type="text"
          placeholder="Enter student name"
          value={`${student.student_first_name} ${student.student_last_name}`}
          readOnly
        />
        <CustomInputField
          label="Card Number"
          type="text"
          placeholder="Enter card number"
          value={student.card_number}
          readOnly
        />
        <CustomInputField
          label="Current Balance"
          type="text"
          placeholder="Enter current balance"
          value={`UGX ${new Intl.NumberFormat().format(
            parseFloat(student.student_account_balance) || 0,
          )}`}
          readOnly
        />
      </div>

      {/* Student's Parents Section */}
      <h2 className="text-md font-semibold text-gray-900 mb-4">
        Student&apos;s Parents
      </h2>
      <div className="grid grid-cols-2 gap-6 mb-4">
        <CustomInputField
          label="Primary Parent"
          type="text"
          placeholder="Enter primary parent name"
          value={parentNames || 'N/A'}
          readOnly
        />
        <CustomInputField
          label="Parent Contacts"
          type="text"
          placeholder="Enter other parent contact"
          value={student.parents.map((p) => p.user_contact).join(', ')}
          readOnly
        />
      </div>
    </div>
  );
};

export default StudentDetailsForm;
