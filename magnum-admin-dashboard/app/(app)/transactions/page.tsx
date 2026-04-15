"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/layout/page-header";
import ListToolbar from "@/components/shared/list-toolbar";
import DataTable, { DataColumn } from "@/components/shared/data-table";
import PaginationControls from "@/components/shared/pagination-controls";
import ErrorState from "@/components/shared/error-state";
import NoData from "@/components/shared/no-data";
import StatusBadge from "@/components/shared/status-badge";
import { useListData } from "@/hooks/use-list-data";
import type { ListParams } from "@/lib/api/admin";

interface TransactionRow {
  id: string;
  transaction_id?: string;
  account_holder?: string;
  amount?: string | number;
  status?: string;
  created_at?: string;
}

export default function TransactionsPage() {
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

  const { data, error, isLoading } = useListData<TransactionRow>(
    "/api/admin/transactions/",
    params,
  );

  const transactions = data?.data?.results ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const columns: DataColumn<TransactionRow>[] = [
    { key: "transaction_id", header: "Transaction ID" },
    { key: "account_holder", header: "Account Holder" },
    { key: "amount", header: "Amount" },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: "created_at", header: "Created" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        subtitle="Track money movement across the platform."
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
        <div className="text-sm text-muted-foreground">
          Loading transactions...
        </div>
      ) : error ? (
        <ErrorState />
      ) : transactions.length === 0 ? (
        <NoData
          title="No transactions"
          description="No transactions match your filters."
        />
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={transactions}
            rowKey={(row) => row.id}
            onRowClick={(row) => router.push(`/transactions/${row.id}`)}
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
