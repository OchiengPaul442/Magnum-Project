"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";

import PageHeader from "@/components/layout/page-header";
import DetailGrid from "@/components/shared/detail-grid";
import { Button, buttonVariants } from "@/components/ui/button";
import PasswordField from "@/components/shared/password-field";
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

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "New password is required"),
    confirmPassword: z.string().min(6, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function AccountPage() {
  const { data: session, update } = useSession();
  const profile = session?.user;
  const fullName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOutAll, setLoggingOutAll] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: passwordErrors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

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

  const handleChangePassword = async (values: ChangePasswordValues) => {
    try {
      await authApi.changePassword(values);
      toast.success("Password changed successfully");
      reset();
    } catch (error) {
      captureError(error, { source: "change-password" });
      toast.error("Failed to change password");
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
          Change your current password, refresh your session, or log out all
          sessions from the back office.
        </p>
        <form
          className="mt-6 space-y-4 rounded-xl border border-border/60 bg-background p-4"
          onSubmit={handleSubmit(handleChangePassword)}
        >
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Change Current Password
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your current password and choose a new one.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <PasswordField
              id="oldPassword"
              label="Current password"
              registration={register("oldPassword")}
              error={passwordErrors.oldPassword?.message}
              autoComplete="current-password"
            />

            <PasswordField
              id="newPassword"
              label="New password"
              registration={register("newPassword")}
              error={passwordErrors.newPassword?.message}
              autoComplete="new-password"
            />

            <PasswordField
              id="confirmPassword"
              label="Confirm password"
              registration={register("confirmPassword")}
              error={passwordErrors.confirmPassword?.message}
              autoComplete="new-password"
            />
          </div>

          <div className="flex justify-start">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>

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
