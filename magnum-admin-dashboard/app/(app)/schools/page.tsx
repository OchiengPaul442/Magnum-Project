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
import { formatDateTime } from "@/lib/format-date";
import { useListData } from "@/hooks/use-list-data";
import type { ListParams } from "@/lib/api/admin";

interface SchoolRow {
  id: string;
  school_id?: string;
  school_name?: string;
  school_address?: string;
  status?: string;
  created_at?: string;
}

export default function SchoolsPage() {
  const router = useRouter();
  const [editingSchool, setEditingSchool] = useState<{
    id: string;
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

  const { data, error, isLoading, mutate } = useListData<SchoolRow>(
    "/api/admin/schools/",
    params,
  );

  const schools = data?.data?.results ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const columns: DataColumn<SchoolRow>[] = [
    { key: "school_id", header: "School ID" },
    { key: "school_name", header: "Name" },
    { key: "school_address", header: "Address" },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "created_at",
      header: "Created",
      render: (row) => formatDateTime(row.created_at),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div
          className="flex justify-end"
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          data-no-row-click="true"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  // prevent the table row click from firing when interacting with actions
                  e.stopPropagation();
                }}
                aria-label={`Actions for ${row.school_name ?? row.school_id ?? "school"}`}
                data-no-row-click="true"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => {
                  // prevent table row navigation
                  e.stopPropagation();
                  setEditingSchool({ id: row.id, status: row.status });
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
          <UpdateStatusDialog
            open={Boolean(editingSchool)}
            onOpenChange={(open) => {
              if (!open) setEditingSchool(null);
            }}
            currentStatus={editingSchool?.status}
            title="Edit School Status"
            description="Change the status for this school."
            onUpdate={async (status) => {
              if (!editingSchool?.id) return;
              await adminApi.updateSchoolStatus(editingSchool.id, status);
              await mutate?.();
              setEditingSchool(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
