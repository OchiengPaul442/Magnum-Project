"use client";

import React, { useState } from "react";
import { toast } from "sonner";

import PageHeader from "@/components/layout/page-header";
import DetailGrid from "@/components/shared/detail-grid";
import ErrorState from "@/components/shared/error-state";
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

interface StudentAccountDetailPageProps {
  params: { accountId: string };
}

export default function StudentAccountDetailPage({
  params,
}: StudentAccountDetailPageProps) {
  const { accountId } = params;
  const { data, error, isLoading, mutate } =
    useDetailData<StudentAccountDetail>(
      `/api/admin/student-accounts/${accountId}/`,
    );
  const [recalculating, setRecalculating] = useState(false);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading account...</div>
    );
  }

  if (error) {
    return <ErrorState />;
  }

  const account = data?.data;

  const handleRecalculate = async () => {
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
