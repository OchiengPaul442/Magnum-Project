import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDisplayValue } from "@/lib/display";

export interface DataColumn<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  className?: string;
  isLoading?: boolean;
  loadingRows?: number;
}

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  className,
  isLoading = false,
  loadingRows = 6,
}: DataTableProps<T>) {
  const loadingWidths = ["w-3/4", "w-2/3", "w-5/6", "w-1/2", "w-4/5", "w-3/5"];
  const isDateLikeColumn = (key: string) =>
    /(^|_)(created_at|updated_at|timestamp|expiration_date|expires_at|date)$/.test(
      key.toLowerCase(),
    );

  const resolveRowKey = (row: T, index: number) => {
    const rawKey = rowKey(row);
    return rawKey ? `${rawKey}-${index}` : `row-${index}`;
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm",
        className,
      )}
    >
      <Table>
        <TableHeader className="bg-gray-50 [&_tr]:border-gray-200">
          <TableRow className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  "px-6 py-4 text-left text-sm font-semibold text-gray-700",
                  column.className,
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: loadingRows }).map((_, rowIndex) => (
                <TableRow
                  key={`skeleton-row-${rowIndex}`}
                  className={cn(
                    rowIndex % 2 === 1 && "bg-gray-50",
                    "pointer-events-none",
                  )}
                >
                  {columns.map((column, columnIndex) => (
                    <TableCell
                      key={`skeleton-${rowIndex}-${column.key}`}
                      className={cn(
                        "px-6 py-4 text-sm text-gray-600",
                        column.className,
                      )}
                    >
                      <Skeleton
                        className={cn(
                          "h-4 rounded-full",
                          loadingWidths[
                            (rowIndex + columnIndex) % loadingWidths.length
                          ],
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : data.map((row, index) => {
                const resolvedRowKey = resolveRowKey(row, index);

                return (
                  <TableRow
                    key={resolvedRowKey}
                    className={cn(
                      "border-b border-gray-100 transition-colors",
                      index % 2 === 1 && "bg-[#EEECF3]/50",
                      onRowClick && "cursor-pointer hover:bg-gray-50",
                    )}
                    onClick={(event) => {
                      const target = event.target;
                      if (
                        target instanceof Element &&
                        target.closest('[data-no-row-click="true"]')
                      ) {
                        return;
                      }

                      onRowClick?.(row);
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={`${resolvedRowKey}-${column.key}`}
                        className={cn(
                          "px-6 py-4 text-sm text-gray-600",
                          column.className,
                          isDateLikeColumn(column.key) && "whitespace-nowrap",
                        )}
                      >
                        {column.render
                          ? column.render(row)
                          : formatDisplayValue(
                              (row as Record<string, unknown>)[column.key],
                            )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
}
