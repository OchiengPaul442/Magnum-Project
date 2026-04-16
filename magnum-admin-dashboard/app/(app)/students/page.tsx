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

interface StudentRow {
  id: string;
  student_id?: string;
  ssid?: string;
  student_school_id?: string;
  first_name?: string;
  last_name?: string;
  school_name?: string;
  status?: string;
  created_at?: string;
}

export default function StudentsPage() {
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

  const { data, error, isLoading } = useListData<StudentRow>(
    "/api/admin/students/",
    params,
  );

  const students = data?.data?.results ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const columns: DataColumn<StudentRow>[] = [
    { key: "student_id", header: "Student ID" },
    { key: "student_school_id", header: "SSID" },
    {
      key: "name",
      header: "Student Name",
      render: (row) => `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
    },
    { key: "school_name", header: "School" },
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
        title="Students"
        subtitle="Review student records, balances, and cards."
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
      ) : students.length === 0 ? (
        <NoData
          title="No students"
          description="No students match your filters."
        />
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={students}
            rowKey={(row) => row.id}
            onRowClick={(row) => router.push(`/students/${row.id}`)}
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
