"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import OTPInput from "@/components/shared/otp-input";

import AuthShell from "@/components/shared/auth-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authApi, getAuthErrorMessage } from "@/lib/api/auth";
import { LOGIN_PENDING_USER_KEY, resolveCallbackUrl } from "@/lib/auth/flow";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = resolveCallbackUrl(searchParams);
  const emailFromQuery = searchParams.get("email")?.trim() ?? "";
  const [username, setUsername] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const pendingUser =
      emailFromQuery || sessionStorage.getItem(LOGIN_PENDING_USER_KEY);
    if (!pendingUser) {
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    setUsername(pendingUser);
    setIsHydrated(true);
  }, [emailFromQuery, nextPath, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);

    if (!username) {
      return;
    }

    if (!new RegExp(`^\\d{${OTP_LENGTH}}$`).test(otp)) {
      toast.error("Enter the 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const verifiedPayload = await authApi.verifyOtp({ username, otp });

      const result = await signIn("credentials", {
        username,
        verifiedPayload: JSON.stringify(verifiedPayload),
        redirect: false,
      });

      if (!result || result.error) {
        setAuthError(
          getAuthErrorMessage(
            result?.error,
            "OTP verification failed. Please try again.",
          ),
        );
        return;
      }

      sessionStorage.removeItem(LOGIN_PENDING_USER_KEY);
      router.replace(nextPath);
    } catch (err) {
      setAuthError(
        getAuthErrorMessage(
          err,
          "Unable to verify the code. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!username || isResending || resendCooldown > 0) {
      return;
    }

    setIsResending(true);
    setResendCooldown(30);

    try {
      await authApi.resendOtp({ email: username, purpose: "login" });
      setOtp("");
      setAuthError(null);
      toast.success("A new 6-digit code has been sent.");
    } catch (err) {
      setAuthError(
        getAuthErrorMessage(
          err,
          "Unable to resend the code. Please try again.",
        ),
      );
      setResendCooldown(0);
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  if (!isHydrated) {
    return (
      <AuthShell
        title="Verify OTP"
        description="Preparing the verification step..."
      >
        <div
          className="mt-10 space-y-6 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-sm"
          aria-busy="true"
        >
          <div className="space-y-4">
            <Skeleton className="mx-auto h-4 w-[88%] rounded-full" />
            <Skeleton className="mx-auto h-4 w-[72%] rounded-full" />
          </div>

          <div className="flex justify-center gap-3 sm:gap-4" aria-hidden>
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-14 w-12 rounded-lg border border-gray-200 sm:h-16 sm:w-14"
              />
            ))}
          </div>

          <Skeleton className="mx-auto h-12 w-full rounded-full" />
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Verify OTP"
      description={
        username ? (
          <>
            We sent a verification code to{" "}
            <span className="font-medium text-[#533E89]">{username}</span>.
            Enter it below to finish signing in.
          </>
        ) : (
          "We sent a verification code to your email. Enter it below to finish signing in."
        )
      }
    >
      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        {authError ? (
          <div
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm"
            role="alert"
            aria-live="polite"
          >
            {authError}
          </div>
        ) : null}

        <div className="space-y-4">
          <OTPInput
            length={OTP_LENGTH}
            value={otp}
            autoFocus
            onChange={(value) => {
              setOtp(value);
            }}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || otp.length !== OTP_LENGTH}
          className="h-12 w-full rounded-full bg-[#6f54c5] px-6 text-white shadow-sm transition-colors hover:bg-[#5b45a3]"
        >
          {isSubmitting ? "Verifying..." : "Continue"}
        </Button>

        <div className="flex flex-col items-center gap-3 pt-1">
          <span className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?
          </span>
          <Button
            type="button"
            variant="link"
            className="h-auto gap-2 p-0 text-sm font-semibold text-[#6f54c5]"
            disabled={isResending || !username || resendCooldown > 0}
            aria-disabled={isResending || !username || resendCooldown > 0}
            title={
              resendCooldown > 0
                ? `Resend available in ${resendCooldown}s`
                : undefined
            }
            onClick={() => void handleResend()}
          >
            <RefreshCw
              className={cn("h-4 w-4", isResending && "animate-spin")}
            />
            {isResending
              ? "Resending..."
              : resendCooldown > 0
                ? `Resend available (${resendCooldown}s)`
                : "Resend code"}
          </Button>

          <Link
            href={`/login?next=${encodeURIComponent(nextPath)}`}
            className="text-sm font-medium text-[#6f54c5] transition-colors hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
