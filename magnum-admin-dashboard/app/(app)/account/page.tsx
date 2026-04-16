"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";

import PageHeader from "@/components/layout/page-header";
import DetailGrid from "@/components/shared/detail-grid";
import { Button, buttonVariants } from "@/components/ui/button";
import { captureError } from "@/lib/logging";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { authApi } from "@/lib/api/auth";

export default function AccountPage() {
  const { data: session, update } = useSession();
  const profile = session?.user;
  const fullName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOutAll, setLoggingOutAll] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await update();
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
      await authApi.logoutAll();
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Log out</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Log out?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be signed out of your admin session on this device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() => void signOut({ callbackUrl: "/login" })}
                >
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        }
      />
      <DetailGrid
        title="Admin Profile"
        fields={[
          {
            label: "Name",
            value: String(profile?.name || fullName || "-"),
          },
          {
            label: "Email",
            value: String(profile?.email ?? "-"),
          },
          {
            label: "Category",
            value: String(profile?.category ?? "Admin"),
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
            {refreshing ? "Refreshing..." : "Refresh Session"}
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
