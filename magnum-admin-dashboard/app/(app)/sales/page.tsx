"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/layout/page-header";
import ListToolbar from "@/components/shared/list-toolbar";
import DataTable, { DataColumn } from "@/components/shared/data-table";
import PaginationControls from "@/components/shared/pagination-controls";
import ErrorState from "@/components/shared/error-state";
import NoData from "@/components/shared/no-data";
import { useListData } from "@/hooks/use-list-data";
import type { ListParams } from "@/lib/api/admin";

interface SaleRow {
  id: string;
  sale_id?: string;
  vendor_name?: string;
  student_name?: string;
  total?: string | number;
  created_at?: string;
}

export default function SalesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ListParams>({
    search: "",
    status: "all",
    page: 1,
    page_size: 20,
  });

  const params = useMemo(() => {
    const nextParams: ListParams = { ...filters };
    if (nextParams.status === "all") {
      delete nextParams.status;
    }
    return nextParams;
  }, [filters]);

  const { data, error, isLoading } = useListData<SaleRow>(
    "/api/admin/sales/",
    params,
  );

  const sales = data?.data?.results ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const columns: DataColumn<SaleRow>[] = [
    { key: "sale_id", header: "Sale ID" },
    { key: "vendor_name", header: "Vendor" },
    { key: "student_name", header: "Student" },
    { key: "total", header: "Total" },
    { key: "created_at", header: "Created" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Sales" subtitle="Review vendor sales and totals." />
      <ListToolbar
        search={filters.search ?? ""}
        onSearchChange={(value) =>
          setFilters((prev) => ({ ...prev, search: value, page: 1 }))
        }
        status={filters.status ?? "all"}
        onStatusChange={(value) =>
          setFilters((prev) => ({ ...prev, status: value, page: 1 }))
        }
      />
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading sales...</div>
      ) : error ? (
        <ErrorState />
      ) : sales.length === 0 ? (
        <NoData title="No sales" description="No sales match your filters." />
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={sales}
            rowKey={(row) => row.id}
            onRowClick={(row) => router.push(`/sales/${row.id}`)}
          />
          <PaginationControls
            page={pagination?.page ?? 1}
            totalPages={totalPages}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </div>
      )}
    </div>
  );
}
