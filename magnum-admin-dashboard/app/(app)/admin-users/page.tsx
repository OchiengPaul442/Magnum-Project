"use client";

import React, { useMemo, useState } from "react";

import PageHeader from "@/components/layout/page-header";
import ListToolbar from "@/components/shared/list-toolbar";
import DataTable, { DataColumn } from "@/components/shared/data-table";
import PaginationControls from "@/components/shared/pagination-controls";
import ErrorState from "@/components/shared/error-state";
import NoData from "@/components/shared/no-data";
import AssignRolesDialog from "@/components/admin/assign-roles-dialog";
import { useDetailData, useListData } from "@/hooks/use-list-data";
import type { ListParams } from "@/lib/api/admin";
import { normalizeGroupEntries, normalizeStringList } from "@/lib/display";

interface AdminUserRow {
  id: string;
  user_id?: string;
  email?: string;
  full_name?: string;
  groups?: string[];
}

export default function AdminUsersPage() {
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

  const {
    data: adminData,
    error,
    isLoading,
    mutate,
  } = useListData<AdminUserRow>("/api/admin/users/", params);
  const { data: groupData } = useDetailData<Record<string, unknown>>(
    "/api/admin/groups-permissions/",
  );

  const admins = adminData?.data?.results ?? [];
  const pagination = adminData?.data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const groupPayload = groupData?.data as Record<string, unknown> | undefined;
  const availableGroups = normalizeGroupEntries(
    groupPayload?.groups ?? groupPayload,
  ).map((group) => group.name);

  const columns: DataColumn<AdminUserRow>[] = [
    { key: "user_id", header: "User ID" },
    { key: "full_name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "groups",
      header: "Groups",
      render: (row) => normalizeStringList(row.groups).join(", ") || "-",
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <AssignRolesDialog
          userId={row.user_id ?? row.id}
          currentGroups={row.groups ?? []}
          availableGroups={availableGroups}
          onSuccess={() => mutate()}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Users"
        subtitle="Manage admin users and access groups."
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
      ) : admins.length === 0 ? (
        <NoData title="No admin users" description="No admins found." />
      ) : (
        <div className="space-y-4">
          <DataTable columns={columns} data={admins} rowKey={(row) => row.id} />
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
