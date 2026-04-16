"use client";

import React from "react";

import PageHeader from "@/components/layout/page-header";
import DetailGrid from "@/components/shared/detail-grid";
import ErrorState from "@/components/shared/error-state";
import NoData from "@/components/shared/no-data";
import LoadingScreen from "@/components/shared/loading-screen";
import DataTable, { DataColumn } from "@/components/shared/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDetailData, useListData } from "@/hooks/use-list-data";
import StatusBadge from "@/components/shared/status-badge";

interface ParentDetail {
  id: string;
  profile_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  contact?: string;
  created_at?: string;
  students?: StudentRow[];
}

interface StudentRow {
  id: string;
  student_id?: string;
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

interface ParentDetailPageProps {
  params: { parentId: string };
}

export default function ParentDetailPage({ params }: ParentDetailPageProps) {
  const { parentId } = params;
  const { data, error, isLoading } = useDetailData<ParentDetail>(
    `/api/admin/parents/${parentId}/`,
  );

  const { data: transactionsData } = useListData<TransactionRow>(
    "/api/admin/transactions/",
    { parent_id: parentId, page: 1, page_size: 5 },
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState />;
  }

  const parent = data?.data;
  const students = parent?.students ?? [];

  const studentColumns: DataColumn<StudentRow>[] = [
    { key: "student_id", header: "Student ID" },
    {
      key: "name",
      header: "Student Name",
      render: (row) => `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
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
      />
      <DetailGrid
        title="Parent Profile"
        fields={[
          { label: "UUID", value: parent?.id },
          { label: "Profile ID", value: parent?.profile_id },
          {
            label: "Name",
            value:
              `${parent?.first_name ?? ""} ${parent?.last_name ?? ""}`.trim(),
          },
          { label: "Email", value: parent?.email },
          { label: "Contact", value: parent?.contact },
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
          {transactionsData?.data?.results?.length ? (
            <DataTable
              columns={transactionColumns}
              data={transactionsData.data.results}
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
