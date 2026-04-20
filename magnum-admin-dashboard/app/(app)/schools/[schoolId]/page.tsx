"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";

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
import { formatDateTime } from "@/lib/format-date";

interface SchoolRow {
  id: string;
  school_id?: string;
  school_name?: string;
  school_address?: string;
  status?: string;
  created_at?: string;
}

interface StudentRow {
  id: string;
  student_id?: string;
  first_name?: string;
  last_name?: string;
  status?: string;
}

interface VendorRow {
  id: string;
  vendor_id?: string;
  vendor_name?: string;
  status?: string;
}

interface CardRow {
  id: string;
  card_id?: string;
  card_number?: string;
  status?: string;
}

interface TransactionRow {
  id: string;
  transaction_id?: string;
  amount?: string | number;
  status?: string;
}

export default function SchoolDetailPage() {
  const router = useRouter();
  const routeParams = useParams<{ schoolId?: string | string[] }>();
  const schoolId = Array.isArray(routeParams.schoolId)
    ? (routeParams.schoolId[0] ?? null)
    : (routeParams.schoolId ?? null);

  const { data, error, isLoading, mutate } = useDetailData<SchoolRow>(
    schoolId ? `/api/admin/schools/${schoolId}` : null,
  );

  const { data: studentsData } = useListData<StudentRow>(
    "/api/admin/students/",
    schoolId ? { school_id: schoolId, page: 1, page_size: 10 } : null,
  );

  const { data: vendorsData } = useListData<VendorRow>(
    "/api/admin/vendors/",
    schoolId ? { school_id: schoolId, page: 1, page_size: 10 } : null,
  );

  const { data: cardsData } = useListData<CardRow>(
    "/api/admin/cards/",
    schoolId ? { school_id: schoolId, page: 1, page_size: 10 } : null,
  );

  const { data: transactionsData } = useListData<TransactionRow>(
    "/api/admin/transactions/",
    schoolId ? { school_id: schoolId, page: 1, page_size: 10 } : null,
  );

  if (!schoolId) {
    return (
      <ErrorState
        title="School not found"
        description="The school identifier is missing from the route."
        actionLabel="Back to schools"
        onActionClick={() => router.push("/schools")}
      />
    );
  }

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <ErrorState />;
  }

  const school = data?.data;

  const studentColumns: DataColumn<StudentRow>[] = [
    { key: "student_id", header: "Student ID" },
    {
      key: "name",
      header: "Student Name",
      render: (row) => `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const vendorColumns: DataColumn<VendorRow>[] = [
    { key: "vendor_id", header: "Vendor ID" },
    { key: "vendor_name", header: "Vendor" },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const cardColumns: DataColumn<CardRow>[] = [
    { key: "card_id", header: "Card ID" },
    { key: "card_number", header: "Card Number" },
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
      <DetailGrid
        title="School Detail"
        subtitle="School profile and recent activity."
        onClose={() => router.push("/schools")}
        actions={
          <UpdateStatusDialog
            title="Update School Status"
            description="Change the status for this school."
            currentStatus={school?.status}
            onUpdate={async (status) => {
              await adminApi.updateSchoolStatus(schoolId, status);
              await mutate?.();
            }}
          />
        }
        className="rounded-2xl border-border/60 bg-card p-4 shadow-sm sm:p-6"
        fields={[
          { label: "UUID", value: school?.id },
          { label: "School ID", value: school?.school_id },
          { label: "Name", value: school?.school_name },
          { label: "Address", value: school?.school_address },
          { label: "Status", value: <StatusBadge status={school?.status} /> },
          { label: "Created", value: formatDateTime(school?.created_at) },
        ]}
      />
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          {studentsData?.data?.results?.length ? (
            <DataTable
              columns={studentColumns}
              data={studentsData.data.results}
              rowKey={(row) => row.id}
            />
          ) : (
            <NoData
              title="No students"
              description="No students found for this school."
            />
          )}
        </TabsContent>
        <TabsContent value="vendors">
          {vendorsData?.data?.results?.length ? (
            <DataTable
              columns={vendorColumns}
              data={vendorsData.data.results}
              rowKey={(row) => row.id}
            />
          ) : (
            <NoData
              title="No vendors"
              description="No vendors found for this school."
            />
          )}
        </TabsContent>
        <TabsContent value="cards">
          {cardsData?.data?.results?.length ? (
            <DataTable
              columns={cardColumns}
              data={cardsData.data.results}
              rowKey={(row) => row.id}
            />
          ) : (
            <NoData
              title="No cards"
              description="No cards found for this school."
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
              description="No transactions found for this school."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
