"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import AuthShell from "@/components/shared/auth-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import OTPInput from "@/components/shared/otp-input";
import PasswordField from "@/components/shared/password-field";
import { authApi, getAuthErrorMessage } from "@/lib/api/auth";
import { RESET_EMAIL_KEY, resolveCallbackUrl } from "@/lib/auth/flow";

const schema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    otp: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Enter the 6-digit reset code"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = resolveCallbackUrl(searchParams);
  const emailFromQuery = searchParams.get("email")?.trim() ?? "";
  const [authError, setAuthError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: emailFromQuery,
      otp: "",
    },
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!emailFromQuery) {
        const storedEmail = sessionStorage.getItem(RESET_EMAIL_KEY);
        if (storedEmail) {
          reset({
            email: storedEmail,
            otp: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      }

      setIsHydrated(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [emailFromQuery, reset]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const currentEmail =
      emailFromQuery || sessionStorage.getItem(RESET_EMAIL_KEY);
    if (!currentEmail) {
      router.replace(`/forgot-password?next=${encodeURIComponent(nextPath)}`);
    }
  }, [emailFromQuery, isHydrated, nextPath, router]);

  const onSubmit = async (values: ResetPasswordValues) => {
    setAuthError(null);

    try {
      await authApi.resetPassword({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      toast.success("Password reset successfully. You can sign in now.");
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
    } catch (error) {
      setAuthError(
        getAuthErrorMessage(
          error,
          "Unable to reset the password. Please try again.",
        ),
      );
    }
  };

  if (!isHydrated) {
    return (
      <AuthShell
        title="Reset Password"
        description="Preparing the password reset form..."
      >
        <div className="mt-10 space-y-6 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-sm">
          <div className="space-y-2">
            <div className="h-4 w-40 rounded-full bg-muted/70" />
            <div className="h-12 rounded-full bg-muted/60" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-32 rounded-full bg-muted/70" />
            <div className="flex justify-center gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-14 w-12 rounded-lg border border-gray-200 bg-muted/60 sm:h-16 sm:w-14"
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 w-36 rounded-full bg-muted/70" />
            <div className="h-12 rounded-full bg-muted/60" />
            <div className="h-4 w-40 rounded-full bg-muted/70" />
            <div className="h-12 rounded-full bg-muted/60" />
          </div>
          <div className="h-12 rounded-full bg-muted/70" />
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset Password"
      description="Enter the code from your email and choose a new password."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
        {authError ? (
          <div
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm"
            role="alert"
            aria-live="polite"
          >
            {authError}
          </div>
        ) : null}

        <input type="hidden" {...register("email")} />

        <div className="space-y-2">
          <Label htmlFor="otp" className="sr-only">
            Reset code
          </Label>
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <OTPInput
                    length={6}
                    value={field.value ?? ""}
                    autoFocus
                    onChange={field.onChange}
                  />
                </div>
              </div>
            )}
          />
          {errors.otp ? (
            <p className="text-center text-xs text-red-600">
              {errors.otp.message}
            </p>
          ) : null}
        </div>

        <PasswordField
          id="newPassword"
          label="New password"
          registration={register("newPassword")}
          error={errors.newPassword?.message}
          autoComplete="new-password"
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm new password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-full bg-[#6f54c5] px-6 text-white shadow-sm transition-colors hover:bg-[#5b45a3]"
        >
          {isSubmitting ? "Resetting..." : "Reset password"}
        </Button>

        <div className="flex flex-col items-center gap-2 text-sm">
          <Link
            href="/forgot-password"
            className="font-medium text-[#6f54c5] transition-colors hover:underline"
          >
            Need a new reset code?
          </Link>
          <Link
            href="/login"
            className="font-medium text-[#6f54c5] transition-colors hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
