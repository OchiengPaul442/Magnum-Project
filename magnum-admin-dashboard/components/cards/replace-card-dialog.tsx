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

const schema = z
  .object({
    new_card_id: z.string().optional(),
    new_card_number: z.string().optional(),
    new_card_serial_number: z.string().optional(),
  })
  .refine(
    (values) =>
      Boolean(
        values.new_card_id ||
        values.new_card_number ||
        values.new_card_serial_number,
      ),
    {
      message: "Provide at least one identifier",
      path: ["new_card_id"],
    },
  );

type ReplaceCardValues = z.infer<typeof schema>;

interface ReplaceCardDialogProps {
  cardId: string;
  onSuccess: () => void;
}

export default function ReplaceCardDialog({
  cardId,
  onSuccess,
}: ReplaceCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReplaceCardValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: ReplaceCardValues) => {
    setSubmitting(true);
    try {
      await adminApi.replaceCard(cardId, values);
      toast.success("Card replaced successfully");
      onSuccess();
      setOpen(false);
    } catch (error) {
      captureError(error, { source: "replace-card" });
      toast.error("Failed to replace card");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Replace Card</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Replace Card</DialogTitle>
          <DialogDescription>
            Replace the current card with a new pending card. Provide at least
            one identifier.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new_card_id">New Card UUID</Label>
            <Input id="new_card_id" {...register("new_card_id")} />
            {errors.new_card_id ? (
              <p className="text-xs text-red-600">
                {errors.new_card_id.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_card_number">New Card Number</Label>
            <Input id="new_card_number" {...register("new_card_number")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_card_serial_number">
              New Card Serial Number
            </Label>
            <Input
              id="new_card_serial_number"
              {...register("new_card_serial_number")}
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Replacing..." : "Replace"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
