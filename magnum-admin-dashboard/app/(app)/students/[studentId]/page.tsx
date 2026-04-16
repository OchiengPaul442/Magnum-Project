"use client";

import React from "react";

import PageHeader from "@/components/layout/page-header";
import DetailGrid from "@/components/shared/detail-grid";
import ErrorState from "@/components/shared/error-state";
import NoData from "@/components/shared/no-data";
import LoadingScreen from "@/components/shared/loading-screen";
import DataTable, { DataColumn } from "@/components/shared/data-table";
import StatusBadge from "@/components/shared/status-badge";
import UpdateStatusDialog from "@/components/shared/update-status-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDetailData, useListData } from "@/hooks/use-list-data";
import { adminApi } from "@/lib/api/admin";

interface StudentDetail {
  id: string;
  student_id?: string;
  student_school_id?: string;
  ssid?: string;
  first_name?: string;
  last_name?: string;
  status?: string;
  school_name?: string;
  created_at?: string;
  parents?: ParentRow[];
}

interface ParentRow {
  id: string;
  profile_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

interface TransactionRow {
  id: string;
  transaction_id?: string;
  amount?: string | number;
  status?: string;
}

interface SaleRow {
  id: string;
  sale_id?: string;
  total?: string | number;
  created_at?: string;
}

interface StudentDetailPageProps {
  params: { studentId: string };
}

export default function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { studentId } = params;
  const { data, error, isLoading } = useDetailData<StudentDetail>(
    `/api/admin/students/${studentId}/`,
  );

  const { data: transactionsData } = useListData<TransactionRow>(
    "/api/admin/transactions/",
    { student_id: studentId, page: 1, page_size: 5 },
  );

  const { data: salesData } = useListData<SaleRow>("/api/admin/sales/", {
    student_id: studentId,
    page: 1,
    page_size: 5,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState />;
  }

  const student = data?.data;
  const parents = student?.parents ?? [];

  const parentColumns: DataColumn<ParentRow>[] = [
    { key: "profile_id", header: "Profile ID" },
    {
      key: "name",
      header: "Parent Name",
      render: (row) => `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
    },
    { key: "email", header: "Email" },
  ];

  const transactionColumns: DataColumn<TransactionRow>[] = [
    { key: "transaction_id", header: "Transaction ID" },
    { key: "amount", header: "Amount" },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const saleColumns: DataColumn<SaleRow>[] = [
    { key: "sale_id", header: "Sale ID" },
    { key: "total", header: "Total" },
    { key: "created_at", header: "Created" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Detail"
        subtitle="Student profile and activity."
        actions={
          <UpdateStatusDialog
            title="Update Student Status"
            description="Change the status for this student."
            currentStatus={student?.status}
            onUpdate={(status) =>
              adminApi.updateStudentStatus(studentId, status)
            }
          />
        }
      />
      <DetailGrid
        title="Student Profile"
        fields={[
          { label: "UUID", value: student?.id },
          { label: "Student ID", value: student?.student_id },
          { label: "SSID", value: student?.student_school_id ?? student?.ssid },
          {
            label: "Name",
            value:
              `${student?.first_name ?? ""} ${student?.last_name ?? ""}`.trim(),
          },
          { label: "School", value: student?.school_name },
          { label: "Status", value: <StatusBadge status={student?.status} /> },
          { label: "Created", value: student?.created_at },
        ]}
      />
      <Tabs defaultValue="parents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="parents">Parents</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
        <TabsContent value="parents">
          {parents.length ? (
            <DataTable
              columns={parentColumns}
              data={parents}
              rowKey={(row) => row.id}
            />
          ) : (
            <NoData
              title="No parents"
              description="No parents attached to this student."
            />
          )}
        </TabsContent>
        <TabsContent value="transactions">
          {transactionsData?.data?.results?.length ? (
            <DataTable
              columns={transactionColumns}
              data={transactionsData.data.results}
              rowKey={(row) => row.id}
            />
          ) : (
            <NoData
              title="No transactions"
              description="No transactions found for this student."
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
              description="No sales recorded for this student."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
