import React from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

export type Transaction = {
  id: string;
  type: 'recharge' | 'withdraw';
  label: string;
  date: string;
  time: string;
  amount: string;
};

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

const placeholderData: Transaction[] = [
  {
    id: '1',
    type: 'recharge',
    label: 'Card recharged',
    date: 'Today',
    time: '09:00',
    amount: 'UGX 50,000',
  },
  {
    id: '2',
    type: 'withdraw',
    label: 'Cash withdraw',
    date: 'Today',
    time: '08:40',
    amount: 'UGX 10,000',
  },
  {
    id: '3',
    type: 'withdraw',
    label: 'Cash withdraw',
    date: '29/08/24',
    time: '17:00',
    amount: 'UGX 30,000',
  },
  {
    id: '4',
    type: 'recharge',
    label: 'Card recharged',
    date: '27/08/24',
    time: '12:00',
    amount: 'UGX 65,000',
  },
  {
    id: '5',
    type: 'recharge',
    label: 'Card recharged',
    date: '27/08/24',
    time: '12:00',
    amount: 'UGX 65,000',
  },
];

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions = placeholderData,
}) => {
  const pages = [1, 2, 3];
  const currentPage = 1;

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Transactions
      </h3>
      <ul className="flex-1 overflow-y-auto">
        {transactions.map((tx) => (
          <li
            key={tx.id}
            className="flex justify-between items-center py-3 border-b last:border-none"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full bg-gray-100 ${tx.type === 'recharge' ? 'text-green-500' : 'text-red-500'}`}
              >
                {tx.type === 'recharge' ? <FaArrowDown /> : <FaArrowUp />}
              </div>
              <div>
                <p className="font-medium text-gray-800">{tx.label}</p>
                <p className="text-sm text-gray-500">
                  {tx.date} at {tx.time}
                </p>
              </div>
            </div>
            <p className="font-semibold text-green-700">{tx.amount}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-start items-center space-x-2 text-gray-600 text-sm">
        <button className="flex items-center space-x-1 hover:text-gray-900">
          <span className="border-2 border-gray-700 p-1 rounded">
            <MdKeyboardArrowLeft />
          </span>
          <span>Previous</span>
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`px-2 py-1 rounded-full ${page === currentPage ? 'text-purple-700' : 'hover:text-gray-900'}`}
          >
            {page}
          </button>
        ))}
        <span>...</span>
        <button className="flex items-center space-x-1 hover:text-gray-900">
          <span>Next</span>
          <span className="border-2 border-gray-700 p-1 rounded">
            <MdKeyboardArrowRight />
          </span>
        </button>
      </div>
    </div>
  );
};

export default RecentTransactions;
