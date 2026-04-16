"use client";

import React from "react";
import { useParams } from "next/navigation";

import PageHeader from "@/components/layout/page-header";
import DetailGrid from "@/components/shared/detail-grid";
import ErrorState from "@/components/shared/error-state";
import NoData from "@/components/shared/no-data";
import ContentLoader from "@/components/shared/content-loader";
import DataTable, { DataColumn } from "@/components/shared/data-table";
import { useDetailData } from "@/hooks/use-list-data";

interface SaleDetail {
  id: string;
  sale_id?: string;
  vendor_name?: string;
  student_name?: string;
  school_name?: string;
  total?: string | number;
  created_at?: string;
  sale_items?: SaleItemRow[];
  items?: SaleItemRow[];
}

interface SaleItemRow {
  id: string;
  sale_item_id?: string;
  item_name?: string;
  quantity?: string | number;
  unit_price?: string | number;
  subtotal?: string | number;
}

export default function SaleDetailPage() {
  const routeParams = useParams<{ saleId?: string | string[] }>();
  const saleId = Array.isArray(routeParams.saleId)
    ? (routeParams.saleId[0] ?? null)
    : (routeParams.saleId ?? null);
  const { data, error, isLoading } = useDetailData<SaleDetail>(
    saleId ? `/api/admin/sales/${saleId}` : null,
  );

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <ErrorState />;
  }

  const sale = data?.data;
  const items = sale?.sale_items ?? sale?.items ?? [];

  const itemColumns: DataColumn<SaleItemRow>[] = [
    { key: "sale_item_id", header: "Sale Item ID" },
    { key: "item_name", header: "Item" },
    { key: "quantity", header: "Qty" },
    { key: "unit_price", header: "Unit Price" },
    { key: "subtotal", header: "Subtotal" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sale Detail"
        subtitle="Audit sale line items."
        backHref="/sales"
      />
      <DetailGrid
        title="Sale Summary"
        fields={[
          { label: "UUID", value: sale?.id },
          { label: "Sale ID", value: sale?.sale_id },
          { label: "Vendor", value: sale?.vendor_name },
          { label: "Student", value: sale?.student_name },
          { label: "School", value: sale?.school_name },
          { label: "Total", value: sale?.total },
          { label: "Created", value: sale?.created_at },
        ]}
      />
      {items.length ? (
        <DataTable
          columns={itemColumns}
          data={items}
          rowKey={(row) => row.id}
        />
      ) : (
        <NoData
          title="No sale items"
          description="No line items found for this sale."
        />
      )}
    </div>
  );
}
