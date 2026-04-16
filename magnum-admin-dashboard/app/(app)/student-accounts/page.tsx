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

interface StudentAccountRow {
  id: string;
  student_account_id?: string;
  student_name?: string;
  school_name?: string;
  balance?: string | number;
  transaction_limit?: string | number;
}

export default function StudentAccountsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ListParams>({
    search: "",
    status: "all",
    page: 1,
    page_size: 10,
  });

  const params = useMemo(() => {
    const nextParams: ListParams = { ...filters };
    if (nextParams.status === "all") {
      delete nextParams.status;
    }
    return nextParams;
  }, [filters]);

  const { data, error, isLoading } = useListData<StudentAccountRow>(
    "/api/admin/student-accounts/",
    params,
  );

  const accounts = data?.data?.results ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const columns: DataColumn<StudentAccountRow>[] = [
    { key: "student_account_id", header: "Account ID" },
    { key: "student_name", header: "Student" },
    { key: "school_name", header: "School" },
    { key: "balance", header: "Balance" },
    { key: "transaction_limit", header: "Limit" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Accounts"
        subtitle="Review balances and transaction limits."
      />
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
        <DataTable
          columns={columns}
          data={[]}
          rowKey={(row) => row.id}
          isLoading
          loadingRows={6}
        />
      ) : error ? (
        <ErrorState />
      ) : accounts.length === 0 ? (
        <NoData title="No accounts" description="No student accounts found." />
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={accounts}
            rowKey={(row) => row.id}
            onRowClick={(row) => router.push(`/student-accounts/${row.id}`)}
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
