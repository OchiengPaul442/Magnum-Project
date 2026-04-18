"use client";

import React, { useMemo, useState } from "react";

import PageHeader from "@/components/layout/page-header";
import ListToolbar from "@/components/shared/list-toolbar";
import DataTable, { DataColumn } from "@/components/shared/data-table";
import PaginationControls from "@/components/shared/pagination-controls";
import ErrorState from "@/components/shared/error-state";
import NoData from "@/components/shared/no-data";
import AssignRolesDialog from "@/components/admin/assign-roles-dialog";
import EntityCell from "@/components/shared/entity-cell";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/shared/status-badge";
import { useDetailData, useListData } from "@/hooks/use-list-data";
import type { ListParams } from "@/lib/api/admin";
import { normalizeGroupEntries, normalizeStringList } from "@/lib/display";

interface AdminUserRow {
  id: string;
  user_profile_id?: string;
  email?: string;
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
  groups?: string[];
  updated_at?: string;
}

export default function AdminUsersPage() {
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

  const renderGroups = (groups: unknown[]) => {
    const normalizedGroups = normalizeStringList(groups);

    if (normalizedGroups.length === 0) {
      return <span className="text-sm text-muted-foreground">-</span>;
    }

    return (
      <div className="flex flex-wrap gap-1.5">
        {normalizedGroups.map((group) => (
          <Badge key={group} variant="secondary" className="rounded-full">
            {group}
          </Badge>
        ))}
      </div>
    );
  };

  const columns: DataColumn<AdminUserRow>[] = [
    {
      key: "user_profile_id",
      header: "Profile ID",
      className: "whitespace-nowrap font-medium text-foreground",
    },
    {
      key: "user",
      header: "Name",
      render: (row) => (
        <EntityCell
          title={row.user?.full_name ?? "Unnamed admin"}
          subtitle={row.user_category}
        />
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (row) => row.user?.email ?? row.email ?? "-",
    },
    {
      key: "contact",
      header: "Contact",
      render: (row) => row.contact ?? "-",
    },
    {
      key: "groups",
      header: "Groups",
      render: (row) => renderGroups(row.groups ?? []),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.user?.is_active ? "active" : "inactive"} />
      ),
    },
    { key: "updated_at", header: "Updated" },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div data-no-row-click="true">
          {row.user?.id ? (
            <AssignRolesDialog
              userId={row.user.id}
              currentGroups={row.groups ?? []}
              availableGroups={availableGroups}
              onSuccess={() => mutate()}
            />
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )}
        </div>
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
        <ErrorState error={error} />
      ) : admins.length === 0 ? (
        <NoData
          title="No admin users"
          description="No admin users match the current filters."
        />
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
