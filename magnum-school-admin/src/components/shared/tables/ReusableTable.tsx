import React, { useState } from 'react';
import { cn } from '@lib/utils';
import { FileText } from 'lucide-react';

interface TableColumn {
  header: string;
  accessor: string;
  Cell?: (cell: { value: any; row: any }) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  rowsPerPageOptions?: number[];
}

/**
 * A simple empty state component for table bodies.
 */
const TableEmptyState: React.FC<{
  icon?: React.ReactNode;
  mainMessage: string;
  subMessage: string;
}> = ({ icon, mainMessage, subMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {icon ? icon : <FileText className="h-12 w-12 text-gray-400 mb-4" />}
      <p className="text-lg font-medium text-gray-900">{mainMessage}</p>
      <p className="text-sm text-gray-500 mt-1">{subMessage}</p>
    </div>
  );
};

const ReusableTable: React.FC<TableProps> = ({
  columns,
  data,
  rowsPerPageOptions = [10, 25, 50],
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(0); // Reset to first page when rows per page changes
  };

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  return (
    <div className="space-y-4">
      {/* Responsive container for the table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left font-bold w-[60px]"
              >
                No.
              </th>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-4 text-left font-bold"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  <TableEmptyState
                    mainMessage="No data available"
                    subMessage="There are no rows to display at the moment."
                    icon={<FileText className="h-12 w-12 text-gray-400 mb-4" />}
                  />
                </td>
              </tr>
            ) : (
              currentData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-100 last:border-none odd:bg-white even:bg-[#EEECF3]"
                >
                  {/* Serial Number */}
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {startIndex + rowIndex + 1}
                  </td>
                  {/* Data Columns */}
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 text-gray-700 whitespace-nowrap"
                    >
                      {column.Cell
                        ? column.Cell({
                            value: row[column.accessor],
                            row,
                          })
                        : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer: Pagination & Rows per page */}
      {data.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
          {/* Pagination */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md border border-gray-200',
                currentPage === 0
                  ? 'cursor-not-allowed text-gray-400 bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-100',
              )}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages || 1}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages - 1}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md border border-gray-200',
                currentPage >= totalPages - 1
                  ? 'cursor-not-allowed text-gray-400 bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-100',
              )}
            >
              Next
            </button>
          </div>

          {/* Rows per page */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border border-gray-300 bg-white rounded-md px-2 py-1 text-sm focus:outline-none"
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReusableTable;
