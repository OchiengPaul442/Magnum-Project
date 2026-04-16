"use client";

import React, { useMemo, useState } from "react";

import PageHeader from "@/components/layout/page-header";
import ListToolbar from "@/components/shared/list-toolbar";
import DataTable, { DataColumn } from "@/components/shared/data-table";
import PaginationControls from "@/components/shared/pagination-controls";
import ErrorState from "@/components/shared/error-state";
import NoData from "@/components/shared/no-data";
import { useListData } from "@/hooks/use-list-data";
import type { ListParams } from "@/lib/api/admin";
import { formatDisplayValue } from "@/lib/display";

interface ActivityRow {
  id: string;
  user?: string;
  action?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export default function ActivityLogsPage() {
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

  const { data, error, isLoading } = useListData<ActivityRow>(
    "/api/admin/activitylogs/",
    params,
  );

  const logs = data?.data?.results ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const columns: DataColumn<ActivityRow>[] = [
    {
      key: "user",
      header: "User",
      render: (row) => formatDisplayValue(row.user),
    },
    { key: "action", header: "Action" },
    { key: "ip_address", header: "IP" },
    { key: "user_agent", header: "User Agent" },
    { key: "created_at", header: "Timestamp" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Logs"
        subtitle="Audit actions performed in the admin dashboard."
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
      ) : logs.length === 0 ? (
        <NoData title="No logs" description="No activity logs found." />
      ) : (
        <div className="space-y-4">
          <DataTable columns={columns} data={logs} rowKey={(row) => row.id} />
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
