"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApi } from "@/lib/api/admin";
import { captureError } from "@/lib/logging";

const schema = z.object({
  school_name: z.string().min(2, "School name is required"),
  school_address: z.string().min(2, "School address is required"),
  first_name: z.string().min(2, "Bursar first name is required"),
  last_name: z.string().min(2, "Bursar last name is required"),
  email: z.string().email("Valid email is required"),
  contact: z.string().min(6, "Contact is required"),
});

type OnboardSchoolValues = z.infer<typeof schema>;

interface OnboardSchoolDialogProps {
  onSuccess: () => void;
}

export default function OnboardSchoolDialog({
  onSuccess,
}: OnboardSchoolDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardSchoolValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: OnboardSchoolValues) => {
    setSubmitting(true);
    try {
      await adminApi.onboardSchool(values);
      toast.success("School onboarded successfully");
      onSuccess();
      setOpen(false);
    } catch (error) {
      captureError(error, { source: "onboard-school" });
      toast.error("Failed to onboard school");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add a school</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Onboard School</DialogTitle>
          <DialogDescription>
            Create a school and invite the main bursar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school_name">School Name</Label>
            <Input id="school_name" {...register("school_name")} />
            {errors.school_name ? (
              <p className="text-xs text-red-600">
                {errors.school_name.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="school_address">School Address</Label>
            <Input id="school_address" {...register("school_address")} />
            {errors.school_address ? (
              <p className="text-xs text-red-600">
                {errors.school_address.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">Bursar First Name</Label>
              <Input id="first_name" {...register("first_name")} />
              {errors.first_name ? (
                <p className="text-xs text-red-600">
                  {errors.first_name.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Bursar Last Name</Label>
              <Input id="last_name" {...register("last_name")} />
              {errors.last_name ? (
                <p className="text-xs text-red-600">
                  {errors.last_name.message}
                </p>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Bursar Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact</Label>
            <Input id="contact" {...register("contact")} />
            {errors.contact ? (
              <p className="text-xs text-red-600">{errors.contact.message}</p>
            ) : null}
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Onboarding..." : "Onboard School"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
