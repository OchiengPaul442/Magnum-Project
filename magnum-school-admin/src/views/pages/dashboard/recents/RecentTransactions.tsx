import React from 'react';
import { useRouter } from 'next/navigation';

interface Transaction {
  name: string;
  cardNumber: string;
  amount: string;
  transactionType: string;
  date: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
}) => {
  const router = useRouter();

  return (
    <div className="p-4 bg-white rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Recent Transactions
        </h3>
        <button
          onClick={() => router.push('/transactions')}
          className="text-teal-700 text-sm font-medium underline"
        >
          See All
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg lg:rounded-none bg-gray-50 lg:bg-transparent  border-b border-gray-200"
          >
            <div className="w-full sm:w-auto flex items-center mb-2 sm:mb-0">
              <div className="w-8 text-sm text-gray-500">{index + 1}</div>
              <span className="text-gray-800 font-medium ml-2 truncate">
                {transaction.name}
              </span>
            </div>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center justify-around flex-wrap gap-2 sm:gap-4 flex-grow">
              <span className="text-gray-600 truncate">
                {transaction.cardNumber}
              </span>
              <span className="text-gray-800 font-semibold">
                {transaction.amount}
              </span>
              <span
                className={`px-2 py-1 rounded-md text-sm font-bold whitespace-nowrap ${
                  transaction.transactionType === 'Withdraw'
                    ? 'bg-yellow-100 text-yellow-900'
                    : 'bg-teal-100 text-teal-600'
                }`}
              >
                {transaction.transactionType}
              </span>
              <span className="text-gray-600 whitespace-nowrap">
                {transaction.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
