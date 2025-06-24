import React from 'react';
import { MdClose } from 'react-icons/md';
import { CustomInputField, CustomButton } from '@/components/shared';
import RecentTransactions, {
  Transaction,
} from '@/views/pages/students/RecentTransactions';
interface ParentData {
  user_name: string;
}

interface StudentDetails {
  id: string;
  student_first_name: string;
  student_last_name: string;
  student_account_balance: string;
  card_number: string;
  status: 'active' | 'inactive';
  parents?: ParentData[];
  transactions?: Transaction[];
}

interface StudentDetailsFormProps {
  student?: StudentDetails;
  onClose?: () => void;
}

const StudentDetailsForm: React.FC<StudentDetailsFormProps> = ({
  student,
  onClose,
}) => {
  // Default placeholder data
  const placeholderStudent: StudentDetails = {
    id: '1',
    student_first_name: 'Namulindwa',
    student_last_name: 'Lisa',
    student_account_balance: '243000',
    card_number: 'ADC 556 5678035',
    status: 'active',
    parents: [
      { user_name: 'Mutesi Darline' },
      { user_name: 'Jeffrey Mulindwa' },
      { user_name: 'Musisi Kenneth' },
    ],
    transactions: undefined,
  };

  const current = student ?? placeholderStudent;
  // Always have parents
  const parents =
    current.parents && current.parents.length > 0
      ? current.parents
      : placeholderStudent.parents!;
  // Always have transactions
  const transactions = current.transactions ?? undefined;
  const buttonText =
    current.status === 'active' ? 'Deactivate card' : 'Activate card';
  const balanceFormatted = `UGX ${new Intl.NumberFormat().format(parseFloat(current.student_account_balance) || 0)}`;

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
        <div className="flex items-center gap-4">
          <CustomButton
            type="button"
            onClick={() => console.log('toggle status')}
            text={buttonText}
            className="py-1 px-4 border-2 text-purple-700 border-purple-700 hover:bg-purple-700 hover:text-white rounded-full bg-transparent"
          />
          <button type="button" onClick={onClose ?? (() => {})}>
            <MdClose className="text-gray-500 text-2xl hover:text-gray-900 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Student Info Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <CustomInputField
          label="Student Name"
          type="text"
          value={`${current.student_first_name} ${current.student_last_name}`}
          readOnly
        />
        <CustomInputField
          label="Card Number"
          type="text"
          value={current.card_number}
          readOnly
        />
        <CustomInputField
          label="Current Balance"
          type="text"
          value={balanceFormatted}
          readOnly
        />
      </div>

      {/* Transactions & Parents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions transactions={transactions} />
        </div>

        <div className="w-full bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">
            Student&apos;s Parents
          </h3>
          <ul className="divide-y divide-gray-200">
            {parents.map((p, idx) => (
              <li key={idx} className="py-3">
                <span className="text-gray-800">{p.user_name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsForm;
