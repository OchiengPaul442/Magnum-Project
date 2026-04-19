"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import AuthShell from "@/components/shared/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hasOtpRequirement } from "@/lib/auth/session";
import { authApi, getAuthErrorMessage } from "@/lib/api/auth";
import {
  buildVerifyOtpPath,
  LOGIN_PENDING_USER_KEY,
  resolveCallbackUrl,
} from "@/lib/auth/flow";

const schema = z.object({
  username: z.string().min(3, "Email or username is required"),
  password: z.string().min(6, "Password is required"),
});

type LoginValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = resolveCallbackUrl(searchParams);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: LoginValues) => {
    setAuthError(null);

    try {
      const response = await authApi.login(values);

      if (hasOtpRequirement(response)) {
        sessionStorage.setItem(LOGIN_PENDING_USER_KEY, values.username);
        router.push(buildVerifyOtpPath(values.username, nextPath));
        return;
      }

      const signInResult = await signIn("credentials", {
        username: values.username,
        verifiedPayload: JSON.stringify(response),
        redirect: false,
      });

      if (!signInResult || signInResult.error) {
        setAuthError(
          getAuthErrorMessage(
            signInResult?.error,
            "Login failed. Please try again.",
          ),
        );
        return;
      }

      toast.success("Signed in successfully.");
      router.replace(nextPath);
    } catch (err) {
      setAuthError(
        getAuthErrorMessage(err, "Unable to sign in. Please try again."),
      );
    }
  };

  return (
    <AuthShell
      title="Sign in to Magnum"
      description="Use your Magnum admin credentials to continue. Accounts that require a verification code will move to the next step automatically."
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
          <Label
            htmlFor="username"
            className="text-sm font-medium text-gray-700"
          >
            Email address
          </Label>
          <Input
            id="username"
            placeholder="admin@magnum.app"
            className="h-12 !rounded-full !border-gray-300 !bg-white px-4 shadow-sm placeholder:text-gray-400 focus-visible:!ring-2 focus-visible:!ring-[#6f54c5]/20 focus-visible:!ring-offset-0"
            autoComplete="username"
            {...register("username")}
          />
          {errors.username ? (
            <p className="text-xs text-red-600">{errors.username.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            className="h-12 !rounded-full !border-gray-300 !bg-white px-4 shadow-sm placeholder:text-gray-400 focus-visible:!ring-2 focus-visible:!ring-[#6f54c5]/20 focus-visible:!ring-offset-0"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#6f54c5] transition-colors hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-full bg-[#6f54c5] px-6 text-white shadow-sm transition-colors hover:bg-[#5b45a3]"
        >
          {isSubmitting ? "Signing in..." : "Continue"}
        </Button>
      </form>
    </AuthShell>
  );
}
