"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminApi } from "@/lib/api/admin";
import { captureError } from "@/lib/logging";

interface UpdateCardStatusDialogProps {
  cardId: string;
  onSuccess: () => void;
}

export default function UpdateCardStatusDialog({
  cardId,
  onSuccess,
}: UpdateCardStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("active");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      await adminApi.updateCardStatus(cardId, status);
      toast.success("Card status updated");
      onSuccess();
      setOpen(false);
    } catch (error) {
      captureError(error, { source: "update-card-status" });
      toast.error("Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update Status</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Card Status</DialogTitle>
          <DialogDescription>
            Change the status for this card.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
