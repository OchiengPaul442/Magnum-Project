import React from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

// Transaction type for backend data
export type Transaction = {
  reference_number?: string;
  transaction_type?: 'credit' | 'debit';
  amount?: string;
  currency?: string;
  date?: string; // ISO string
  description?: string;
  status?: string;
};

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 10;

import { format } from 'date-fns';

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions = [],
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil(transactions.length / ITEMS_PER_PAGE),
  );

  // Memoize paginated transactions for performance
  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return transactions.slice(start, start + ITEMS_PER_PAGE);
  }, [transactions, page]);

  // Generate page numbers for pagination controls (classic: 1 2 3 ... N)
  const getPageNumbers = () => {
    const maxVisible = 3; // Show 3 page numbers as in the original design
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 2) {
      return [1, 2, 3, '...', totalPages];
    }
    if (page >= totalPages - 1) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', page, '...', totalPages];
  };

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const handlePageClick = (p: number) => setPage(p);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Transactions
      </h3>
      <ul className="flex-1 overflow-y-auto min-h-[120px]">
        {paginatedTransactions.length === 0 ? (
          <li className="text-gray-500 text-center py-8">
            No transactions found.
          </li>
        ) : (
          paginatedTransactions.map((tx, index) => {
            const key = tx.reference_number || `tx-${index}`;
            const type =
              tx.transaction_type === 'credit' ? 'recharge' : 'withdraw';
            const label = tx.description || 'Transaction';
            const dateObj = tx.date ? new Date(tx.date) : undefined;
            const dateStr =
              dateObj && !isNaN(dateObj as any)
                ? format(dateObj, 'PPP')
                : tx.date || '';
            const timeStr =
              dateObj && !isNaN(dateObj as any) ? format(dateObj, 'p') : '';
            const amountValue = Number(tx.amount || 0);
            const amount = `${tx.currency || 'UGX'} ${amountValue.toLocaleString()}`;
            return (
              <li
                key={key}
                className="flex justify-between items-center py-3 border-b last:border-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full bg-gray-100 ${type === 'recharge' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {type === 'recharge' ? <FaArrowDown /> : <FaArrowUp />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{label}</p>
                    <p className="text-sm text-gray-500">
                      {dateStr}
                      {timeStr ? ` at ${timeStr}` : ''}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-semibold ${type === 'recharge' ? 'text-green-700' : 'text-red-700'}`}
                >
                  {amount}
                </p>
              </li>
            );
          })
        )}
      </ul>
      <div className="mt-4 flex justify-start items-center space-x-2 text-gray-600 text-sm">
        <button
          className="flex items-center space-x-1 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePrev}
          disabled={page === 1}
        >
          <span className="border-2 border-gray-700 p-1 rounded">
            <MdKeyboardArrowLeft />
          </span>
          <span>Previous</span>
        </button>
        {getPageNumbers().map((p, idx) =>
          typeof p === 'number' ? (
            <button
              key={p}
              className={`px-2 py-1 rounded-full ${p === page ? 'text-purple-700 font-bold' : 'hover:text-gray-900'}`}
              onClick={() => handlePageClick(p)}
              disabled={p === page}
            >
              {p}
            </button>
          ) : (
            <span key={`ellipsis-${idx}`}>...</span>
          ),
        )}
        <button
          className="flex items-center space-x-1 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={page === totalPages}
        >
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
