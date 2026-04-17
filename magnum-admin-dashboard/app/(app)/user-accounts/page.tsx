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
import EntityCell from "@/components/shared/entity-cell";
import { useListData } from "@/hooks/use-list-data";
import type { ListParams } from "@/lib/api/admin";
import { formatCurrencyValue } from "@/lib/display";

interface UserAccountRow {
  id: string;
  user_account_id?: string;
  balance?:
    | {
        source?: string;
        parsedValue?: number;
      }
    | string
    | number;
  user?: {
    id: number;
    email?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    is_active?: boolean;
  };
  user_profile?: {
    id: string;
    user_profile_id?: string;
    contact?: string;
    user_category?: string;
    user?: {
      id: number;
      email?: string;
      first_name?: string;
      last_name?: string;
      full_name?: string;
      is_active?: boolean;
    };
  };
  updated_at?: string;
}

const renderUserCell = (account: UserAccountRow) => {
  const user = account.user ?? account.user_profile?.user;

  return (
    <EntityCell
      title={user?.full_name ?? "Unnamed user"}
      subtitle={
        [user?.email, account.user_profile?.user_category]
          .filter(Boolean)
          .join(" / ") || undefined
      }
    />
  );
};

const renderContactCell = (account: UserAccountRow) => {
  if (!account.user_profile?.contact) {
    return <span className="text-sm text-muted-foreground">-</span>;
  }

  return (
    <EntityCell
      title={account.user_profile.contact}
      subtitle={account.user_profile.user_profile_id}
    />
  );
};

export default function UserAccountsPage() {
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

  const { data, error, isLoading } = useListData<UserAccountRow>(
    "/api/admin/user-accounts/",
    params,
  );

  const accounts = data?.data?.results ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const columns: DataColumn<UserAccountRow>[] = [
    {
      key: "user_account_id",
      header: "Account ID",
      className: "whitespace-nowrap font-medium text-foreground",
    },
    {
      key: "user",
      header: "User",
      render: (row) => renderUserCell(row),
    },
    {
      key: "contact",
      header: "Contact",
      render: (row) => renderContactCell(row),
    },
    {
      key: "balance",
      header: "Balance",
      render: (row) => (
        <span className="font-medium text-foreground">
          {formatCurrencyValue(row.balance)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.user?.is_active ? "active" : "inactive"} />
      ),
    },
    { key: "updated_at", header: "Updated" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Accounts"
        subtitle="Review balances for parents, vendors, and admins."
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
        <NoData
          title="No accounts"
          description="No user accounts match the current filters."
        />
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={accounts}
            rowKey={(row) => row.id}
            onRowClick={(row) => router.push(`/user-accounts/${row.id}`)}
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
