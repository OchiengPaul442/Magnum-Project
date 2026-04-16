"use client";

import React from "react";
import { useParams } from "next/navigation";

import PageHeader from "@/components/layout/page-header";
import DetailGrid from "@/components/shared/detail-grid";
import ErrorState from "@/components/shared/error-state";
import NoData from "@/components/shared/no-data";
import ContentLoader from "@/components/shared/content-loader";
import DataTable, { DataColumn } from "@/components/shared/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDetailData } from "@/hooks/use-list-data";
import StatusBadge from "@/components/shared/status-badge";

interface ParentDetail {
  id: string;
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
  account?: {
    id?: string;
    user_account_id?: string;
    balance?: string | number;
  } | null;
  created_at?: string;
  updated_at?: string;
  students?: StudentRow[];
  transactions?: TransactionRow[];
}

interface StudentRow {
  id: string;
  student_id?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  school_name?: string;
  status?: string;
}

interface TransactionRow {
  id: string;
  transaction_id?: string;
  amount?: string | number;
  status?: string;
}

export default function ParentDetailPage() {
  const routeParams = useParams<{ parentId?: string | string[] }>();
  const parentId = Array.isArray(routeParams.parentId)
    ? (routeParams.parentId[0] ?? null)
    : (routeParams.parentId ?? null);
  const { data, error, isLoading } = useDetailData<ParentDetail>(
    parentId ? `/api/admin/parents/${parentId}` : null,
  );

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <ErrorState />;
  }

  const parent = data?.data;
  const students = parent?.students ?? [];
  const transactions = parent?.transactions ?? [];

  const studentColumns: DataColumn<StudentRow>[] = [
    { key: "student_id", header: "Student ID" },
    {
      key: "name",
      header: "Student Name",
      render: (row) =>
        row.full_name ??
        `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
    },
    { key: "school_name", header: "School" },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parent Detail"
        subtitle="Parent profile and activity."
        backHref="/parents"
      />
      <DetailGrid
        title="Parent Profile"
        fields={[
          { label: "UUID", value: parent?.id },
          { label: "Profile ID", value: parent?.user_profile_id },
          {
            label: "Name",
            value:
              parent?.user?.full_name ??
              `${parent?.user?.first_name ?? ""} ${parent?.user?.last_name ?? ""}`.trim(),
          },
          { label: "Email", value: parent?.user?.email },
          { label: "Contact", value: parent?.contact },
          { label: "Category", value: parent?.user_category },
          { label: "Account ID", value: parent?.account?.user_account_id },
          { label: "Balance", value: parent?.account?.balance },
          { label: "Created", value: parent?.created_at },
        ]}
      />
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          {students.length ? (
            <DataTable
              columns={studentColumns}
              data={students}
              rowKey={(row) => row.id}
            />
          ) : (
            <NoData
              title="No students"
              description="No students attached to this parent."
            />
          )}
        </TabsContent>
        <TabsContent value="transactions">
          {transactions.length ? (
            <DataTable
              columns={transactionColumns}
              data={transactions}
              rowKey={(row) => row.id}
            />
          ) : (
            <NoData
              title="No transactions"
              description="No transactions found for this parent."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
