"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import AuthShell from "@/components/shared/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi, getAuthErrorMessage } from "@/lib/api/auth";
import {
  buildResetPasswordPath,
  RESET_EMAIL_KEY,
  resolveCallbackUrl,
} from "@/lib/auth/flow";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = resolveCallbackUrl(searchParams);
  const [authError, setAuthError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setAuthError(null);

    try {
      await authApi.forgotPassword({ email: values.email });
      toast.success("Password reset code sent. Check your email.");
      sessionStorage.setItem(RESET_EMAIL_KEY, values.email);
      router.push(buildResetPasswordPath(values.email, nextPath));
    } catch (error) {
      setAuthError(
        getAuthErrorMessage(
          error,
          "Unable to start password reset. Please try again.",
        ),
      );
    }
  };

  return (
    <AuthShell
      title="Forgot your password?"
      description="Enter the email address associated with the account and we'll send a reset code."
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

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@magnum.app"
            autoComplete="email"
            className="h-12 !rounded-full !border-gray-300 !bg-white px-4 shadow-sm placeholder:text-gray-400 focus-visible:!ring-2 focus-visible:!ring-[#6f54c5]/20 focus-visible:!ring-offset-0"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-full bg-[#6f54c5] px-6 text-white shadow-sm transition-colors hover:bg-[#5b45a3]"
        >
          {isSubmitting ? "Sending code..." : "Send reset code"}
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-[#6f54c5] transition-colors hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
