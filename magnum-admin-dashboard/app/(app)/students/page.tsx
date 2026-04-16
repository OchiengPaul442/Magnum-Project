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
import UpdateStatusDialog from "@/components/shared/update-status-dialog";
import { adminApi } from "@/lib/api/admin";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useListData } from "@/hooks/use-list-data";
import type { ListParams } from "@/lib/api/admin";

interface StudentRow {
  id: string;
  student_id?: string;
  ssid?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  school?: {
    id?: string;
    school_id?: string;
    school_name?: string;
    school_address?: string;
  } | null;
  school_name?: string;
  status?: string;
  created_at?: string;
}

export default function StudentsPage() {
  const router = useRouter();
  const [editingStudent, setEditingStudent] = useState<{
    identifier: string;
    status?: string;
  } | null>(null);
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

  const { data, error, isLoading, mutate } = useListData<StudentRow>(
    "/api/admin/students/",
    params,
  );

  const students = data?.data?.results ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const columns: DataColumn<StudentRow>[] = [
    { key: "student_id", header: "Student ID" },
    { key: "ssid", header: "SSID" },
    {
      key: "name",
      header: "Student Name",
      render: (row) =>
        row.full_name ??
        `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
    },
    {
      key: "school_name",
      header: "School",
      render: (row) => row.school?.school_name ?? row.school_name,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: "created_at", header: "Created" },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div
          className="flex justify-end"
          data-no-row-click="true"
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Actions for ${row.student_id ?? row.id}`}
                data-no-row-click="true"
                onClick={(event) => event.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => {
                  event.stopPropagation();
                  setEditingStudent({
                    identifier: row.id,
                    status: row.status,
                  });
                }}
              >
                Edit details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
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
          <UpdateStatusDialog
            open={Boolean(editingStudent)}
            onOpenChange={(open) => {
              if (!open) setEditingStudent(null);
            }}
            currentStatus={editingStudent?.status}
            title="Edit Student Status"
            description="Change the status for this student."
            onUpdate={async (status) => {
              if (!editingStudent?.identifier) return;
              await adminApi.updateStudentStatus(
                editingStudent.identifier,
                status,
              );
              await mutate?.();
              setEditingStudent(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
