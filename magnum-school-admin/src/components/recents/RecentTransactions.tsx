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
      <div className="space-y-2">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="flex items-center justify-around p-3 rounded-lg bg-white border-b border-gray-200"
          >
            <div className="w-8 text-sm text-gray-500">{index + 1}</div>

            <div className="flex-grow flex items-center justify-around space-x-4">
              <span className="text-gray-800 font-medium">
                {transaction.name}
              </span>

              <span className="text-gray-600">{transaction.cardNumber}</span>

              <span className="text-gray-800">{transaction.amount}</span>

              <span
                className={`
                    px-2 py-1 rounded-md text-sm font-bold
                    ${
                      transaction.transactionType === 'Withdraw'
                        ? 'bg-yellow-100 text-peach-900'
                        : 'bg-teal-100 text-teal-600'
                    }
                  `}
              >
                {transaction.transactionType}
              </span>

              <span className="text-gray-600">{transaction.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
