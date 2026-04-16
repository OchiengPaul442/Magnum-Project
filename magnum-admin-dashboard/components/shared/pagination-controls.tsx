import React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PaginationItemValue = number | "ellipsis-left" | "ellipsis-right";

const buildPageItems = (
  page: number,
  totalPages: number,
): PaginationItemValue[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PaginationItemValue[] = [1];
  const startPage = Math.max(2, page - 1);
  const endPage = Math.min(totalPages - 1, page + 1);

  if (startPage > 2) {
    items.push("ellipsis-left");
  }

  for (let currentPage = startPage; currentPage <= endPage; currentPage += 1) {
    items.push(currentPage);
  }

  if (endPage < totalPages - 1) {
    items.push("ellipsis-right");
  }

  items.push(totalPages);
  return items;
};

export default function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageItems(page, totalPages);
  const goToPage = (nextPage: number) => {
    onPageChange(Math.min(totalPages, Math.max(1, nextPage)));
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{totalPages}</span>
      </p>
      <Pagination className="justify-start sm:justify-end">
        <PaginationContent className="flex-wrap gap-2">
          <PaginationItem>
            <PaginationPrevious
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
            />
          </PaginationItem>
          {pages.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              {typeof pageNumber === "number" ? (
                <PaginationLink
                  type="button"
                  isActive={pageNumber === page}
                  onClick={() => goToPage(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              ) : (
                <span className="flex h-8 items-center px-2 text-sm text-muted-foreground">
                  ...
                </span>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
