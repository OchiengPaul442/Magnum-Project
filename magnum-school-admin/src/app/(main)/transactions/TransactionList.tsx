'use client';
import React from 'react';
import ReusableTable from '@components/tables/ReusableTable';
import { tableData } from '@lib/mockdata';

const columns = [
  { header: "Student's name", accessor: 'name' },
  { header: 'Card number', accessor: 'cardNumber' },
  { header: 'Amount', accessor: 'amount' },
  {
    header: 'Transaction type',
    accessor: 'transactionType',
    Cell: ({ value }: { value: string }) => (
      <span
        className={`
          px-2 py-1 rounded-md text-sm font-medium 
         ${
           value === 'Withdraw'
             ? 'bg-peach-100 text-peach-900'
             : 'bg-teal-100 text-teal-600'
         }
        `}
      >
        {value}
      </span>
    ),
  },
  { header: 'Date', accessor: 'date' },
];

const TransactionList = () => {
  return (
    <div>
      {/* transactions Table */}
      <ReusableTable
        columns={columns}
        data={tableData}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </div>
  );
};

export default TransactionList;
