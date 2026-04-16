"use client";

import React from "react";

import PageHeader from "@/components/layout/page-header";
import DetailGrid from "@/components/shared/detail-grid";
import ErrorState from "@/components/shared/error-state";
import NoData from "@/components/shared/no-data";
import ContentLoader from "@/components/shared/content-loader";
import DataTable, { DataColumn } from "@/components/shared/data-table";
import StatusBadge from "@/components/shared/status-badge";
import UpdateStatusDialog from "@/components/shared/update-status-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDetailData, useListData } from "@/hooks/use-list-data";
import { adminApi } from "@/lib/api/admin";

interface VendorDetail {
  id: string;
  vendor_id?: string;
  vendor_name?: string;
  owner_name?: string;
  owner_email?: string;
  school_name?: string;
  status?: string;
  created_at?: string;
  operators?: OperatorRow[];
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

interface AccountRow {
  id: string;
  user_account_id?: string;
  balance?: string | number;
  status?: string;
}

interface VendorDetailPageProps {
  params: { vendorId: string };
}

export default function VendorDetailPage({ params }: VendorDetailPageProps) {
  const { vendorId } = params;
  const { data, error, isLoading } = useDetailData<VendorDetail>(
    `/api/admin/vendors/${vendorId}/`,
  );

  const { data: itemsData } = useListData<ItemRow>("/api/admin/items/", {
    vendor_id: vendorId,
    page: 1,
    page_size: 5,
  });

  const { data: salesData } = useListData<SaleRow>("/api/admin/sales/", {
    vendor_id: vendorId,
    page: 1,
    page_size: 5,
  });

  const { data: accountsData } = useListData<AccountRow>(
    "/api/admin/user-accounts/",
    { vendor_id: vendorId, page: 1, page_size: 5 },
  );

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <ErrorState />;
  }

  const vendor = data?.data;
  const operators = vendor?.operators ?? [];

  const operatorColumns: DataColumn<OperatorRow>[] = [
    { key: "profile_id", header: "Profile ID" },
    {
      key: "name",
      header: "Operator Name",
      render: (row) => `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
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

  const accountColumns: DataColumn<AccountRow>[] = [
    { key: "user_account_id", header: "Account ID" },
    { key: "balance", header: "Balance" },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Detail"
        subtitle="Vendor operations and activity."
        actions={
          <UpdateStatusDialog
            title="Update Vendor Status"
            description="Change the status for this vendor."
            currentStatus={vendor?.status}
            onUpdate={(status) => adminApi.updateVendorStatus(vendorId, status)}
          />
        }
      />
      <DetailGrid
        title="Vendor Profile"
        fields={[
          { label: "UUID", value: vendor?.id },
          { label: "Vendor ID", value: vendor?.vendor_id },
          { label: "Vendor", value: vendor?.vendor_name },
          { label: "Owner", value: vendor?.owner_name },
          { label: "Owner Email", value: vendor?.owner_email },
          { label: "School", value: vendor?.school_name },
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
          {itemsData?.data?.results?.length ? (
            <DataTable
              columns={itemColumns}
              data={itemsData.data.results}
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
          {salesData?.data?.results?.length ? (
            <DataTable
              columns={saleColumns}
              data={salesData.data.results}
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
          {accountsData?.data?.results?.length ? (
            <DataTable
              columns={accountColumns}
              data={accountsData.data.results}
              rowKey={(row) => row.id}
            />
          ) : (
            <NoData
              title="No accounts"
              description="No user accounts found for this vendor."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
