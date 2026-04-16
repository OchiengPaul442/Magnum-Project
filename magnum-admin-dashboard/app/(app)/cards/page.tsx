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
import CreateCardDialog from "@/components/cards/create-card-dialog";
import BulkImportDialog from "@/components/cards/bulk-import-dialog";

interface CardRow {
  id: string;
  card_id?: string;
  card_number?: string;
  card_serial_number?: string;
  student_name?: string;
  school_name?: string;
  status?: string;
  expiration_date?: string;
}

export default function CardsPage() {
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

  const { data, error, isLoading, mutate } = useListData<CardRow>(
    "/api/admin/cards/",
    params,
  );

  const cards = data?.data?.results ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const columns: DataColumn<CardRow>[] = [
    { key: "card_id", header: "Card ID" },
    { key: "card_number", header: "Card Number" },
    { key: "card_serial_number", header: "Serial" },
    { key: "student_name", header: "Student" },
    { key: "school_name", header: "School" },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: "expiration_date", header: "Expires" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cards"
        subtitle="Manage card inventory and assignments."
        actions={
          <>
            <BulkImportDialog onSuccess={() => mutate()} />
            <CreateCardDialog onSuccess={() => mutate()} />
          </>
        }
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
      ) : cards.length === 0 ? (
        <NoData title="No cards" description="No cards match your filters." />
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={cards}
            rowKey={(row) => row.id}
            onRowClick={(row) => router.push(`/cards/${row.id}`)}
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
