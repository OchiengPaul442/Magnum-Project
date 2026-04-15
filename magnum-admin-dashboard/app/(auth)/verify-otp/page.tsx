"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";
import { captureError } from "@/lib/logging";

const schema = z.object({
  username: z.string().min(3, "Email or username is required"),
  otp: z.string().min(4, "OTP is required"),
});

type OtpValues = z.infer<typeof schema>;

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/dashboard";
  const { verifyOtp } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OtpValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const pendingUser = sessionStorage.getItem("magnum_pending_user");
    if (pendingUser) {
      setValue("username", pendingUser);
    }
  }, [setValue]);

  const onSubmit = async (values: OtpValues) => {
    setError(null);
    try {
      await verifyOtp(values);
      sessionStorage.removeItem("magnum_pending_user");
      router.push(nextPath);
    } catch (err) {
      captureError(err, { source: "verify-otp" });
      setError("OTP verification failed. Please try again.");
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-center">
          <Image src="/logos/logo.png" alt="Magnum" width={48} height={48} />
        </div>
        <CardTitle className="text-2xl">Verify OTP</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter the OTP sent to your email to finish signing in.
        </p>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Email</Label>
            <Input
              id="username"
              placeholder="admin@magnum.app"
              {...register("username")}
            />
            {errors.username ? (
              <p className="text-xs text-red-600">{errors.username.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="otp">OTP</Label>
            <Input id="otp" placeholder="Enter OTP" {...register("otp")} />
            {errors.otp ? (
              <p className="text-xs text-red-600">{errors.otp.message}</p>
            ) : null}
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify and Continue"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
