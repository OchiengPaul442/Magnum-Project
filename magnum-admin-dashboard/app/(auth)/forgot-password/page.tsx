"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { authApi } from "@/lib/api/auth";
import { captureError } from "@/lib/logging";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      await authApi.forgotPassword({ email: values.email });
      toast.success("Password reset code sent. Check your email.");
      router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      captureError(error, { source: "forgot-password" });
      toast.error("We could not start the reset flow. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center">
          <Image src="/logos/logo.png" alt="Magnum" width={48} height={48} />
        </div>
        <CardTitle className="text-2xl">Forgot your password?</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send a reset code.
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@magnum.app"
              className="!rounded-full"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sending code..." : "Send reset code"}
          </Button>

          <Link
            href="/login"
            className="text-sm font-medium text-[#6f54c5] transition-colors hover:text-[#5b45a3]"
          >
            Back to sign in
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
