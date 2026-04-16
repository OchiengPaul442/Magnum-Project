"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import OTPInput from "@/components/shared/otp-input";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { authApi } from "@/lib/api/auth";
import { captureError } from "@/lib/logging";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;
const PENDING_USER_KEY = "magnum_pending_user";

// Using a custom, accessible OTP input component (see components/shared/otp-input.tsx)

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/dashboard";
  const [username, setUsername] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  useEffect(() => {
    const pendingUser = sessionStorage.getItem(PENDING_USER_KEY);
    if (!pendingUser) {
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    setUsername(pendingUser);
    setIsHydrated(true);
  }, [nextPath, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username) {
      return;
    }

    if (!new RegExp(`^\\d{${OTP_LENGTH}}$`).test(otp)) {
      toast.error("Enter the 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        username,
        otp,
        redirect: false,
      });

      if (!result || result.error) {
        toast.error("OTP verification failed. Please try again.");
        return;
      }

      sessionStorage.removeItem(PENDING_USER_KEY);
      router.replace(nextPath);
    } catch (err) {
      captureError(err, { source: "verify-otp" });
      toast.error("OTP verification failed. Please try again.");
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
      toast.success("A new 6-digit code has been sent.");
    } catch (err) {
      captureError(err, { source: "resend-otp" });
      toast.error("We could not resend the code. Please try again.");
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
      <Card className="w-full max-w-md shadow-xl" aria-busy="true">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center">
            <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>
          <Skeleton className="mx-auto h-8 w-52 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="mx-auto h-4 w-[90%] rounded-full" />
            <Skeleton className="mx-auto h-4 w-[72%] rounded-full" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3" aria-hidden>
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-14 w-11 rounded-2xl sm:h-16 sm:w-12"
              />
            ))}
          </div>
          <Skeleton className="mx-auto h-4 w-64 rounded-full" />
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-3">
          <Skeleton className="h-11 w-full rounded-full" />
          <div className="flex flex-col items-center gap-3 pt-1">
            <Skeleton className="h-4 w-44 rounded-full" />
            <Skeleton className="h-4 w-28 rounded-full" />
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center">
          <Image src="/logos/logo.png" alt="Magnum" width={48} height={48} />
        </div>
        <CardTitle className="text-2xl">Enter the 6-digit code</CardTitle>
        <p className="text-sm text-muted-foreground">
          We sent a verification code to your inbox. Enter it below to finish
          signing in.
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <OTPInput
              length={OTP_LENGTH}
              value={otp}
              autoFocus
              onChange={(value) => {
                setOtp(value);
              }}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || otp.length !== OTP_LENGTH}
            className="w-full"
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
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
