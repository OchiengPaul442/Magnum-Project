"use client";

import React, { useState } from "react";
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
  password: z.string().min(6, "Password is required"),
});

type LoginValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/dashboard";
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: LoginValues) => {
    setError(null);
    try {
      await login(values);
      sessionStorage.setItem("magnum_pending_user", values.username);
      router.push(`/verify-otp?next=${encodeURIComponent(nextPath)}`);
    } catch (err) {
      captureError(err, { source: "login" });
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-center">
          <Image
            src="/logos/logo.png"
            alt="Magnum"
            width={48}
            height={48}
            className="h-auto w-auto"
          />
        </div>
        <CardTitle className="text-2xl">Sign in to Magnum</CardTitle>
        <p className="text-sm text-muted-foreground">
          Use your admin email and password. You will verify an OTP next.
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
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password ? (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            ) : null}
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </CardContent>
        <CardFooter className="flex">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing in..." : "Continue"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
