import React, { useState } from 'react';
import { cn } from '@lib/utils';

interface TableProps {
  columns: any[];
  data: any[];
  rowsPerPageOptions?: number[];
}

const ReusableTable: React.FC<TableProps> = ({
  columns,
  data,
  rowsPerPageOptions = [10, 25, 50],
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(0); // Reset to the first page when rows per page change
  };

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div>
      <div className="min-w-[550px] overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-light text-gray-700"
              >
                No.
              </th>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                  {startIndex + rowIndex + 1}
                </td>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                  >
                    {column.Cell
                      ? column.Cell({ value: row[column.accessor], row })
                      : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-start items-center p-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className={cn(
                'text-sm p-2',
                currentPage === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900',
              )}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage >= totalPages - 1}
              className={cn(
                'text-sm p-2',
                currentPage >= totalPages - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900',
              )}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="text-sm flex justify-end items-center py-3 w-full text-gray-700">
        <p>Rows per page:&nbsp;</p>
        <select
          value={rowsPerPage}
          onChange={handlePageChange}
          className="border border-gray-300 bg-white w-full max-w-[120px] rounded-md p-2"
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ReusableTable;
