import React from 'react';
import { MdClose } from 'react-icons/md';
import { CustomInputField, CustomButton } from '@/components/shared';
import RecentTransactions, {
  Transaction,
} from '@/views/pages/students/RecentTransactions';
import { format } from 'date-fns';

interface CardData {
  card_number: string;
  card_serial_number: string;
  expiration_date: string;
  status: string;
  activation_date: string;
}

interface ParentData {
  parent_name: string;
  relation: string;
}

interface StudentDetails {
  first_name: string;
  last_name: string;
  dob: string;
  status: string;
  account_balance: number;
}

interface StudentDetailsFormProps {
  student: StudentDetails;
  card: CardData;
  transactions: Transaction[];
  parents: ParentData[];
  onClose?: () => void;
  onToggleStatus?: () => void;
}

interface StudentDetailsFormProps {
  student: StudentDetails;
  card: CardData;
  transactions: Transaction[];
  parents: ParentData[];
  onClose?: () => void;
  onToggleStatus?: () => void;
  toggleLoading?: boolean;
}

const StudentDetailsForm: React.FC<StudentDetailsFormProps> = ({
  student,
  card,
  transactions,
  parents,
  onClose,
  onToggleStatus,
  toggleLoading = false,
}) => {
  const buttonText =
    student.status === 'active' ? 'Deactivate card' : 'Activate card';
  const balanceFormatted = `UGX ${new Intl.NumberFormat().format(student.account_balance || 0)}`;

  // Format dates using date-fns
  const formattedDob = student.dob ? format(new Date(student.dob), 'PPP') : '';
  const formattedCardExpiry = card.expiration_date
    ? format(new Date(card.expiration_date), 'PPP')
    : '';
  const formattedActivation = card.activation_date
    ? format(new Date(card.activation_date), 'PPP')
    : '';

  // Pagination for transactions is now handled inside RecentTransactions

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
        <div className="flex items-center gap-4">
          <CustomButton
            type="button"
            onClick={onToggleStatus}
            text={toggleLoading ? 'Please wait...' : buttonText}
            disabled={toggleLoading}
            className={`py-1 px-4 border-2 text-purple-700 border-purple-700 hover:bg-purple-700 hover:text-white rounded-full bg-transparent ${toggleLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
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
          value={`${student.first_name} ${student.last_name}`}
          readOnly
        />
        <CustomInputField
          label="Date of Birth"
          type="text"
          value={formattedDob}
          readOnly
        />
        <CustomInputField
          label="Card Number"
          type="text"
          value={card.card_number}
          readOnly
        />
        <CustomInputField
          label="Current Balance"
          type="text"
          value={balanceFormatted}
          readOnly
        />
        <CustomInputField
          label="Card Serial Number"
          type="text"
          value={card.card_serial_number}
          readOnly
        />
        <CustomInputField
          label="Card Expiry"
          type="text"
          value={formattedCardExpiry}
          readOnly
        />
        <CustomInputField
          label="Card Status"
          type="text"
          value={card.status}
          readOnly
        />
        <CustomInputField
          label="Card Activation Date"
          type="text"
          value={formattedActivation}
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
          {parents.length === 0 ? (
            <div className="text-gray-500">No parents found.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {parents.map((p, idx) => (
                <li key={idx} className="py-3">
                  <span className="text-gray-800">{p.parent_name}</span>
                  {p.relation && (
                    <span className="ml-2 text-gray-500 text-xs">
                      ({p.relation})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsForm;
