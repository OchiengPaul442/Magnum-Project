"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import OTPInput from "@/components/shared/otp-input";
import PasswordField from "@/components/shared/password-field";
import { authApi } from "@/lib/api/auth";
import { captureError } from "@/lib/logging";

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
  const defaultEmail = searchParams.get("email") ?? "";
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: defaultEmail,
      otp: "",
    },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    try {
      await authApi.resetPassword({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      toast.success("Password reset successfully. You can sign in now.");
      router.replace("/login");
    } catch (error) {
      captureError(error, { source: "reset-password" });
      toast.error("We could not reset the password. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center">
          <Image src="/logos/logo.png" alt="Magnum" width={48} height={48} />
        </div>
        <CardTitle className="text-2xl">Reset your password</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter the code from your email and choose a new password.
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
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
              <p className="text-xs text-red-600 text-center">
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
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Resetting..." : "Reset password"}
          </Button>

          <div className="flex flex-col items-center gap-2 text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-[#6f54c5] transition-colors hover:text-[#5b45a3]"
            >
              Need a new reset code?
            </Link>
            <Link
              href="/login"
              className="font-medium text-[#6f54c5] transition-colors hover:text-[#5b45a3]"
            >
              Back to sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
