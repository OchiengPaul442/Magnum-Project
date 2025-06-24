'use client';
import React, { useState } from 'react';
import {
  MdClose,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';

interface Operator {
  id: string;
  name: string;
  email: string;
  amountTransacted: string;
}

interface Vendor {
  entityName: string;
  entityOwner: string;
  salesAmount: string;
  operators: Operator[];
}

interface VendorDetailsFormProps {
  vendor?: Vendor;
  onClose: () => void;
}

// Placeholder data
const fallbackOperators: Operator[] = [
  {
    id: '1',
    name: 'Jane Nabukenya',
    email: 'jnabukenya@gmail.com',
    amountTransacted: 'UGX 400,500',
  },
  {
    id: '2',
    name: 'John Kato',
    email: 'jkato@example.com',
    amountTransacted: 'UGX 1,890,000',
  },
  {
    id: '3',
    name: 'Mary Achieng',
    email: 'machieng@example.com',
    amountTransacted: 'UGX 800,700',
  },
  {
    id: '4',
    name: 'Paul Okello',
    email: 'pokello@example.com',
    amountTransacted: 'UGX 3,000,500',
  },
  {
    id: '5',
    name: 'Susan Achola',
    email: 'sachola@example.com',
    amountTransacted: 'UGX 2,100,300',
  },
  {
    id: '6',
    name: 'Michael Otieno',
    email: 'motieno@example.com',
    amountTransacted: 'UGX 750,200',
  },
];

const fallbackVendor: Vendor = {
  entityName: 'Campus Bites',
  entityOwner: 'Kaddu Richard',
  salesAmount: 'UGX 5,000,679',
  operators: fallbackOperators,
};

const ITEMS_PER_PAGE = 4;

const VendorDetailsForm: React.FC<VendorDetailsFormProps> = ({
  vendor = fallbackVendor,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const operators = vendor.operators;
  const totalPages = Math.ceil(operators.length / ITEMS_PER_PAGE);

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOperators = operators.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Vendor Details</h2>
        <button onClick={onClose}>
          <MdClose className="text-gray-500 text-2xl hover:text-gray-900 cursor-pointer" />
        </button>
      </div>

      {/* Entity info and sales card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Fields */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
          <div>
            <p className="text-sm text-gray-600">Entity Name</p>
            <p className="mt-1 text-base text-gray-900">{vendor.entityName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Entity Owner</p>
            <p className="mt-1 text-base text-gray-900">{vendor.entityOwner}</p>
          </div>
        </div>
        {/* Sales card */}
        <div>
          <div className="h-full bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-center text-center">
            <p className="text-sm text-gray-600">Amount made in sales</p>
            <p className="mt-2 text-2xl font-bold text-purple-700">
              {vendor.salesAmount}
            </p>
          </div>
        </div>
      </div>

      {/* Operators section */}
      <h3 className="text-lg font-semibold text-purple-700 mb-4">
        Operators under this entity
      </h3>
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-purple-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Operator’s Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Email address
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Amount transacted
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOperators.map((op) => (
              <tr key={op.id} className="border-t border-gray-200">
                <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                  {op.name}
                </td>
                <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                  {op.email}
                </td>
                <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                  {op.amountTransacted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-start items-center space-x-2 text-gray-600 text-sm">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center space-x-1 disabled:opacity-50"
        >
          <MdKeyboardArrowLeft />
          <span>Previous</span>
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-2 py-1 rounded-full ${page === currentPage ? 'text-purple-700' : 'hover:text-gray-900'}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-1 disabled:opacity-50"
        >
          <span>Next</span>
          <MdKeyboardArrowRight />
        </button>
      </div>
    </div>
  );
};

export default VendorDetailsForm;
