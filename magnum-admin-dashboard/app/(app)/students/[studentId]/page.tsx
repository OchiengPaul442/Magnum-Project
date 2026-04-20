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
import { useDetailData, useListData } from "@/hooks/use-list-data";
import { adminApi } from "@/lib/api/admin";

interface StudentDetail {
  id: string;
  student_id?: string;
  student_school_id?: string;
  ssid?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  status?: string;
  school_name?: string;
  created_at?: string;
  school?: {
    id?: string;
    school_id?: string;
    school_name?: string;
    school_address?: string;
  } | null;
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

export default function StudentDetailPage() {
  const router = useRouter();
  const routeParams = useParams<{ studentId?: string | string[] }>();
  const studentId = Array.isArray(routeParams.studentId)
    ? (routeParams.studentId[0] ?? null)
    : (routeParams.studentId ?? null);
  const { data, error, isLoading, mutate } = useDetailData<StudentDetail>(
    studentId ? `/api/admin/students/${studentId}` : null,
  );

  const student = data?.data;
  const studentNumber = student?.student_id ?? null;

  const { data: transactionsData } = useListData<TransactionRow>(
    "/api/admin/transactions/",
    studentNumber
      ? { student_id: studentNumber, page: 1, page_size: 10 }
      : null,
  );

  const { data: salesData } = useListData<SaleRow>(
    "/api/admin/sales/",
    studentNumber
      ? { student_id: studentNumber, page: 1, page_size: 10 }
      : null,
  );

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <ErrorState />;
  }

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
      <DetailGrid
        title="Student Detail"
        subtitle="Student profile and activity."
        onClose={() => router.push("/students")}
        actions={
          <UpdateStatusDialog
            title="Update Student Status"
            description="Change the status for this student."
            currentStatus={student?.status}
            onUpdate={async (status) => {
              if (!studentId) return;
              await adminApi.updateStudentStatus(
                student?.id ?? studentId,
                status,
              );
              await mutate?.();
            }}
          />
        }
        className="rounded-2xl border-border/60 bg-card p-4 shadow-sm sm:p-6"
        fields={[
          { label: "UUID", value: student?.id },
          { label: "Student ID", value: student?.student_id },
          { label: "SSID", value: student?.student_school_id ?? student?.ssid },
          {
            label: "Name",
            value:
              student?.full_name ??
              `${student?.first_name ?? ""} ${student?.last_name ?? ""}`.trim(),
          },
          {
            label: "School",
            value: student?.school?.school_name ?? student?.school_name,
          },
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
