"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

import PageHeader from "@/components/layout/page-header";
import DetailGrid from "@/components/shared/detail-grid";
import ErrorState from "@/components/shared/error-state";
import ContentLoader from "@/components/shared/content-loader";
import { Button } from "@/components/ui/button";
import { useDetailData } from "@/hooks/use-list-data";
import { adminApi } from "@/lib/api/admin";
import { captureError } from "@/lib/logging";

interface StudentAccountDetail {
  id: string;
  student_account_id?: string;
  student_name?: string;
  school_name?: string;
  balance?: string | number;
  transaction_limit?: string | number;
  created_at?: string;
}

export default function StudentAccountDetailPage() {
  const routeParams = useParams<{ accountId?: string | string[] }>();
  const accountId = Array.isArray(routeParams.accountId)
    ? (routeParams.accountId[0] ?? null)
    : (routeParams.accountId ?? null);
  const { data, error, isLoading, mutate } =
    useDetailData<StudentAccountDetail>(
      accountId ? `/api/admin/student-accounts/${accountId}` : null,
    );
  const [recalculating, setRecalculating] = useState(false);

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <ErrorState />;
  }

  const account = data?.data;

  const handleRecalculate = async () => {
    if (!accountId) return;
    setRecalculating(true);
    try {
      await adminApi.recalculateStudentAccount(accountId);
      toast.success("Balance recalculated");
      mutate();
    } catch (err) {
      captureError(err, { source: "recalculate-student-account" });
      toast.error("Failed to recalculate balance");
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Account Detail"
        subtitle="Balance and transaction limit details."
        backHref="/student-accounts"
        actions={
          <Button onClick={handleRecalculate} disabled={recalculating}>
            {recalculating ? "Recalculating..." : "Recalculate Balance"}
          </Button>
        }
      />
      <DetailGrid
        title="Account Summary"
        fields={[
          { label: "UUID", value: account?.id },
          { label: "Account ID", value: account?.student_account_id },
          { label: "Student", value: account?.student_name },
          { label: "School", value: account?.school_name },
          { label: "Balance", value: account?.balance },
          { label: "Limit", value: account?.transaction_limit },
          { label: "Created", value: account?.created_at },
        ]}
      />
    </div>
  );
}
