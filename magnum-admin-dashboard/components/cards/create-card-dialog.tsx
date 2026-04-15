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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminApi } from "@/lib/api/admin";
import { captureError } from "@/lib/logging";

const schema = z.object({
  card_number: z.string().min(6, "Card number is required"),
  card_serial_number: z.string().min(3, "Card serial number is required"),
  card_pin: z.string().min(4, "Card PIN is required"),
  expiration_date: z.string().min(4, "Expiration date is required"),
  status: z.string().optional(),
});

type CreateCardValues = z.infer<typeof schema>;

interface CreateCardDialogProps {
  onSuccess: () => void;
}

export default function CreateCardDialog({ onSuccess }: CreateCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateCardValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: CreateCardValues) => {
    setSubmitting(true);
    try {
      await adminApi.createCard(values);
      toast.success("Card created successfully");
      onSuccess();
      setOpen(false);
    } catch (error) {
      captureError(error, { source: "create-card" });
      toast.error("Failed to create card");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="teal">Create Card</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Inventory Card</DialogTitle>
          <DialogDescription>
            Create a new card record. Card PINs are never displayed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card_number">Card Number</Label>
            <Input id="card_number" {...register("card_number")} />
            {errors.card_number ? (
              <p className="text-xs text-red-600">
                {errors.card_number.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="card_serial_number">Card Serial Number</Label>
            <Input
              id="card_serial_number"
              {...register("card_serial_number")}
            />
            {errors.card_serial_number ? (
              <p className="text-xs text-red-600">
                {errors.card_serial_number.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="card_pin">Card PIN</Label>
            <Input id="card_pin" type="password" {...register("card_pin")} />
            {errors.card_pin ? (
              <p className="text-xs text-red-600">{errors.card_pin.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiration_date">Expiration Date</Label>
            <Input
              id="expiration_date"
              type="date"
              {...register("expiration_date")}
            />
            {errors.expiration_date ? (
              <p className="text-xs text-red-600">
                {errors.expiration_date.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select onValueChange={(value) => setValue("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Card"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
