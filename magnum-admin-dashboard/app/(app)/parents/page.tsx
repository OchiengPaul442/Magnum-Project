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

interface ParentRow {
  id: string;
  user_profile_id?: string;
  user?: {
    id?: number;
    email?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    is_active?: boolean;
  } | null;
  contact?: string;
  user_category?: string;
  created_at?: string;
}

export default function ParentsPage() {
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

  const { data, error, isLoading } = useListData<ParentRow>(
    "/api/admin/parents/",
    params,
  );

  const parents = data?.data?.results ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const columns: DataColumn<ParentRow>[] = [
    { key: "user_profile_id", header: "Profile ID" },
    {
      key: "name",
      header: "Parent Name",
      render: (row) =>
        row.user?.full_name ??
        `${row.user?.first_name ?? ""} ${row.user?.last_name ?? ""}`.trim(),
    },
    { key: "email", header: "Email", render: (row) => row.user?.email },
    { key: "contact", header: "Contact" },
    {
      key: "user_category",
      header: "Category",
      render: (row) => row.user_category,
    },
    { key: "created_at", header: "Created" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parents"
        subtitle="Manage parent users and their connected students."
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
      ) : parents.length === 0 ? (
        <NoData
          title="No parents"
          description="No parents match your filters."
        />
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={parents}
            rowKey={(row) => row.id}
            onRowClick={(row) => router.push(`/parents/${row.id}`)}
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
