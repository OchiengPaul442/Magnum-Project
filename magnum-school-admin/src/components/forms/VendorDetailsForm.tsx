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

const ITEMS_PER_PAGE = 4;

const VendorDetailsForm: React.FC<VendorDetailsFormProps> = ({
  vendor,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const operators = vendor?.operators || [];
  const totalPages = Math.ceil(operators.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOperators = operators.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (!vendor) {
    return (
      <div className="w-full p-6 bg-white rounded-lg">
        <span className="block text-gray-500 text-center">
          No vendor details found.
        </span>
      </div>
    );
  }
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
        {operators.length === 0 ? (
          <div className="p-8">
            <span className="block text-gray-500 text-center">
              No operators found for this vendor.
            </span>
          </div>
        ) : (
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
        )}
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
