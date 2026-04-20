"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import DetailGrid from "@/components/shared/detail-grid";
import ErrorState from "@/components/shared/error-state";
import ContentLoader from "@/components/shared/content-loader";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/status-badge";
import { useDetailData } from "@/hooks/use-list-data";
import { adminApi } from "@/lib/api/admin";
import { captureError } from "@/lib/logging";

interface UserAccountDetail {
  id: string;
  user_account_id?: string;
  user_name?: string;
  user_category?: string;
  balance?: string | number;
  status?: string;
  created_at?: string;
}

export default function UserAccountDetailPage() {
  const router = useRouter();
  const routeParams = useParams<{ accountId?: string | string[] }>();
  const accountId = Array.isArray(routeParams.accountId)
    ? (routeParams.accountId[0] ?? null)
    : (routeParams.accountId ?? null);
  const { data, error, isLoading, mutate } = useDetailData<UserAccountDetail>(
    accountId ? `/api/admin/user-accounts/${accountId}` : null,
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
      await adminApi.recalculateUserAccount(accountId);
      toast.success("Balance recalculated");
      mutate();
    } catch (err) {
      captureError(err, { source: "recalculate-user-account" });
      toast.error("Failed to recalculate balance");
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <DetailGrid
        title="User Account Detail"
        subtitle="Balance and status for this account."
        onClose={() => router.push("/user-accounts")}
        className="rounded-2xl border-border/60 bg-card p-4 shadow-sm sm:p-6"
        actions={
          <Button onClick={handleRecalculate} disabled={recalculating}>
            {recalculating ? "Recalculating..." : "Recalculate Balance"}
          </Button>
        }
        fields={[
          { label: "UUID", value: account?.id },
          { label: "Account ID", value: account?.user_account_id },
          { label: "User", value: account?.user_name },
          { label: "Category", value: account?.user_category },
          { label: "Balance", value: account?.balance },
          { label: "Status", value: <StatusBadge status={account?.status} /> },
          { label: "Created", value: account?.created_at },
        ]}
      />
    </div>
  );
}
