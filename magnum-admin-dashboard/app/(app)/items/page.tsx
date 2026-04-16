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

interface ItemRow {
  id: string;
  item_id?: string;
  item_name?: string;
  item_category?: string;
  unit_of_measurement?: string;
  unit_price?: string | number;
  vendor_name?: string;
}

export default function ItemsPage() {
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

  const { data, error, isLoading } = useListData<ItemRow>(
    "/api/admin/items/",
    params,
  );

  const items = data?.data?.results ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const columns: DataColumn<ItemRow>[] = [
    { key: "item_id", header: "Item ID" },
    { key: "item_name", header: "Item" },
    { key: "item_category", header: "Category" },
    { key: "unit_of_measurement", header: "Unit" },
    { key: "unit_price", header: "Unit Price" },
    { key: "vendor_name", header: "Vendor" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Items"
        subtitle="Review vendor catalog items and pricing."
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
      ) : items.length === 0 ? (
        <NoData title="No items" description="No items match your filters." />
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={items}
            rowKey={(row) => row.id}
            onRowClick={(row) => router.push(`/items/${row.id}`)}
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
