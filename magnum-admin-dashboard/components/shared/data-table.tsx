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

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-white",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
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
                    rowIndex % 2 === 1 && "bg-muted/30",
                    "pointer-events-none",
                  )}
                >
                  {columns.map((column, columnIndex) => (
                    <TableCell
                      key={`skeleton-${rowIndex}-${column.key}`}
                      className={column.className}
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
            : data.map((row, index) => (
                <TableRow
                  key={rowKey(row)}
                  className={cn(
                    "transition-colors",
                    index % 2 === 1 && "bg-muted/25",
                    onRowClick && "cursor-pointer hover:bg-muted/35",
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
                      key={`${rowKey(row)}-${column.key}`}
                      className={cn(
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
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
