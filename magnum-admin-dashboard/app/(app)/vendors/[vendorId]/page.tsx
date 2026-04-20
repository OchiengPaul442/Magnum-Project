"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

import DetailGrid from "@/components/shared/detail-grid";
import ErrorState from "@/components/shared/error-state";
import NoData from "@/components/shared/no-data";
import ContentLoader from "@/components/shared/content-loader";
import DataTable, { DataColumn } from "@/components/shared/data-table";
import StatusBadge from "@/components/shared/status-badge";
import UpdateStatusDialog from "@/components/shared/update-status-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDetailData } from "@/hooks/use-list-data";
import { adminApi } from "@/lib/api/admin";

interface VendorDetail {
  id: string;
  vendor_id?: string;
  vendor_name?: string;
  school?: {
    id?: string;
    school_id?: string;
    school_name?: string;
    school_address?: string;
  } | null;
  owner?: {
    id?: string;
    user_profile_id?: string;
    user?: {
      id?: number;
      email?: string;
      first_name?: string;
      last_name?: string;
      full_name?: string;
      is_active?: boolean;
    } | null;
    contact?: string;
    user_category?: string;
  } | null;
  status?: string;
  created_at?: string;
  operators?: OperatorRow[];
  items?: ItemRow[];
  sales?: SaleRow[];
}

interface OperatorRow {
  id: string;
  profile_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

interface ItemRow {
  id: string;
  item_id?: string;
  item_name?: string;
  category?: string;
  unit_price?: string | number;
}

interface SaleRow {
  id: string;
  sale_id?: string;
  total?: string | number;
  created_at?: string;
}

export default function VendorDetailPage() {
  const router = useRouter();
  const routeParams = useParams<{ vendorId?: string | string[] }>();
  const vendorId = Array.isArray(routeParams.vendorId)
    ? (routeParams.vendorId[0] ?? null)
    : (routeParams.vendorId ?? null);
  const { data, error, isLoading, mutate } = useDetailData<VendorDetail>(
    vendorId ? `/api/admin/vendors/${vendorId}` : null,
  );

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <ErrorState />;
  }

  const vendor = data?.data;
  const operators = vendor?.operators ?? [];
  const items = vendor?.items ?? [];
  const sales = vendor?.sales ?? [];

  const operatorColumns: DataColumn<OperatorRow>[] = [
    { key: "profile_id", header: "Profile ID" },
    {
      key: "name",
      header: "Operator Name",
      render: (row) =>
        row.first_name || row.last_name
          ? `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim()
          : row.email,
    },
    { key: "email", header: "Email" },
  ];

  const itemColumns: DataColumn<ItemRow>[] = [
    { key: "item_id", header: "Item ID" },
    { key: "item_name", header: "Item" },
    { key: "category", header: "Category" },
    { key: "unit_price", header: "Unit Price" },
  ];

  const saleColumns: DataColumn<SaleRow>[] = [
    { key: "sale_id", header: "Sale ID" },
    { key: "total", header: "Total" },
    { key: "created_at", header: "Created" },
  ];

  return (
    <div className="space-y-6">
      <DetailGrid
        title="Vendor Detail"
        subtitle="Vendor operations and activity."
        onClose={() => router.push("/vendors")}
        className="rounded-2xl border-border/60 bg-card p-4 shadow-sm sm:p-6"
        actions={
          <UpdateStatusDialog
            title="Update Vendor Status"
            description="Change the status for this vendor."
            currentStatus={vendor?.status}
            onUpdate={async (status) => {
              if (!vendorId) return;
              await adminApi.updateVendorStatus(vendorId, status);
              await mutate?.();
            }}
          />
        }
        fields={[
          { label: "UUID", value: vendor?.id },
          { label: "Vendor ID", value: vendor?.vendor_id },
          { label: "Vendor", value: vendor?.vendor_name },
          { label: "Owner", value: vendor?.owner?.user?.full_name },
          { label: "Owner Email", value: vendor?.owner?.user?.email },
          { label: "Contact", value: vendor?.owner?.contact },
          { label: "School", value: vendor?.school?.school_name },
          { label: "Status", value: <StatusBadge status={vendor?.status} /> },
          { label: "Created", value: vendor?.created_at },
        ]}
      />
      <Tabs defaultValue="operators" className="space-y-4">
        <TabsList>
          <TabsTrigger value="operators">Operators</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="accounts">User Accounts</TabsTrigger>
        </TabsList>
        <TabsContent value="operators">
          {operators.length ? (
            <DataTable
              columns={operatorColumns}
              data={operators}
              rowKey={(row) => row.id}
            />
          ) : (
            <NoData
              title="No operators"
              description="No operators found for this vendor."
            />
          )}
        </TabsContent>
        <TabsContent value="items">
          {items.length ? (
            <DataTable
              columns={itemColumns}
              data={items}
              rowKey={(row) => row.id}
            />
          ) : (
            <NoData
              title="No items"
              description="No items found for this vendor."
            />
          )}
        </TabsContent>
        <TabsContent value="sales">
          {sales.length ? (
            <DataTable
              columns={saleColumns}
              data={sales}
              rowKey={(row) => row.id}
            />
          ) : (
            <NoData
              title="No sales"
              description="No sales found for this vendor."
            />
          )}
        </TabsContent>
        <TabsContent value="accounts">
          <NoData
            title="No accounts"
            description="No user accounts found for this vendor."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
