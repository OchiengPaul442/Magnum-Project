"use client";

"use client";

import React, { useState } from "react";
import { toast } from "sonner";

import PageHeader from "@/components/layout/page-header";
import DetailGrid from "@/components/shared/detail-grid";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { captureError } from "@/lib/logging";

export default function AccountPage() {
  const { profile, logout, logoutAll, refreshSession, refreshToken } =
    useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOutAll, setLoggingOutAll] = useState(false);

  const handleRefresh = async () => {
    if (!refreshToken) {
      toast.error("No refresh token available");
      return;
    }
    setRefreshing(true);
    try {
      await refreshSession();
      toast.success("Session refreshed");
    } catch (error) {
      captureError(error, { source: "refresh-session" });
      toast.error("Failed to refresh session");
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogoutAll = async () => {
    setLoggingOutAll(true);
    try {
      await logoutAll();
      toast.success("Logged out of all sessions");
    } catch (error) {
      captureError(error, { source: "logout-all" });
      toast.error("Failed to logout all sessions");
    } finally {
      setLoggingOutAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account & Security"
        subtitle="Review your profile and manage session security."
        actions={
          <Button variant="outline" onClick={() => void logout()}>
            Log out
          </Button>
        }
      />
      <DetailGrid
        title="Admin Profile"
        fields={[
          {
            label: "Name",
            value: String(
              (profile?.first_name as string | undefined) ??
                (profile?.firstname as string | undefined) ??
                "-",
            ),
          },
          {
            label: "Email",
            value: String((profile?.email as string | undefined) ?? "-"),
          },
          {
            label: "Category",
            value: String(
              (profile?.user_category as string | undefined) ?? "Admin",
            ),
          },
        ]}
      />
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">
          Security Actions
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Use logout all sessions from the back office or refresh your token if
          needed.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh Token"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogoutAll}
            disabled={loggingOutAll}
          >
            {loggingOutAll ? "Logging out..." : "Logout All Sessions"}
          </Button>
        </div>
      </div>
    </div>
  );
}
