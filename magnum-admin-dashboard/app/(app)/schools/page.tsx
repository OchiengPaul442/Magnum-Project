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
import OnboardSchoolDialog from "@/components/schools/onboard-school-dialog";
import { useListData } from "@/hooks/use-list-data";
import type { ListParams } from "@/lib/api/admin";

interface SchoolRow {
  id: string;
  school_id?: string;
  name?: string;
  address?: string;
  status?: string;
  created_at?: string;
}

export default function SchoolsPage() {
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

  const { data, error, isLoading, mutate } = useListData<SchoolRow>(
    "/api/admin/schools/",
    params,
  );

  const schools = data?.data?.results ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const columns: DataColumn<SchoolRow>[] = [
    { key: "school_id", header: "School ID" },
    { key: "name", header: "Name" },
    { key: "address", header: "Address" },
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
        title="Schools"
        subtitle="Manage and review all schools onboarded in Magnum."
        actions={<OnboardSchoolDialog onSuccess={() => mutate()} />}
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
      ) : schools.length === 0 ? (
        <NoData
          title="No schools"
          description="No schools match your filters."
        />
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={schools}
            rowKey={(row) => row.id}
            onRowClick={(row) => router.push(`/schools/${row.id}`)}
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
