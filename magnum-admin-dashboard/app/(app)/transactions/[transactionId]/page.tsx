"use client";

import React from "react";
import { useParams } from "next/navigation";

import PageHeader from "@/components/layout/page-header";
import DetailGrid from "@/components/shared/detail-grid";
import ErrorState from "@/components/shared/error-state";
import ContentLoader from "@/components/shared/content-loader";
import StatusBadge from "@/components/shared/status-badge";
import { useDetailData } from "@/hooks/use-list-data";

interface TransactionDetail {
  id: string;
  transaction_id?: string;
  account_holder?: string;
  amount?: string | number;
  status?: string;
  reference?: string;
  created_at?: string;
}

export default function TransactionDetailPage() {
  const routeParams = useParams<{ transactionId?: string | string[] }>();
  const transactionId = Array.isArray(routeParams.transactionId)
    ? (routeParams.transactionId[0] ?? null)
    : (routeParams.transactionId ?? null);
  const { data, error, isLoading } = useDetailData<TransactionDetail>(
    transactionId ? `/api/admin/transactions/${transactionId}` : null,
  );

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <ErrorState />;
  }

  const transaction = data?.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction Detail"
        subtitle="Review transaction metadata and status."
        backHref="/transactions"
      />
      <DetailGrid
        title="Transaction Summary"
        fields={[
          { label: "UUID", value: transaction?.id },
          { label: "Transaction ID", value: transaction?.transaction_id },
          { label: "Reference", value: transaction?.reference },
          { label: "Account Holder", value: transaction?.account_holder },
          { label: "Amount", value: transaction?.amount },
          {
            label: "Status",
            value: <StatusBadge status={transaction?.status} />,
          },
          { label: "Created", value: transaction?.created_at },
        ]}
      />
    </div>
  );
}
