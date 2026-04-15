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
  student_id: z.string().min(6, "Student UUID is required"),
});

type AssignCardValues = z.infer<typeof schema>;

interface AssignCardDialogProps {
  cardId: string;
  onSuccess: () => void;
}

export default function AssignCardDialog({
  cardId,
  onSuccess,
}: AssignCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignCardValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: AssignCardValues) => {
    setSubmitting(true);
    try {
      await adminApi.assignCard(cardId, values);
      toast.success("Card assigned successfully");
      onSuccess();
      setOpen(false);
    } catch (error) {
      captureError(error, { source: "assign-card" });
      toast.error("Failed to assign card");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Assign Card</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Card</DialogTitle>
          <DialogDescription>
            Assign this card to a student UUID.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student_id">Student UUID</Label>
            <Input id="student_id" {...register("student_id")} />
            {errors.student_id ? (
              <p className="text-xs text-red-600">
                {errors.student_id.message}
              </p>
            ) : null}
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Assigning..." : "Assign"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
