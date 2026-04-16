"use client";

import React, { useEffect, useState } from "react";
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
import { captureError } from "@/lib/logging";

interface UpdateStatusDialogProps {
  title: string;
  description: string;
  currentStatus?: string | null;
  onUpdate: (status: string) => Promise<void>;
  triggerLabel?: string;
  children?: React.ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Controlled open change callback */
  onOpenChange?: (open: boolean) => void;
}

export default function UpdateStatusDialog({
  title,
  description,
  currentStatus,
  onUpdate,
  triggerLabel = "Update Status",
  children,
  open: openProp,
  onOpenChange,
}: UpdateStatusDialogProps) {
  const isControlled = typeof openProp === "boolean";
  const [openState, setOpenState] = useState<boolean>(openProp ?? false);
  const [status, setStatus] = useState(currentStatus ?? "active");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setStatus(currentStatus ?? "active");
  }, [currentStatus]);

  useEffect(() => {
    if (isControlled) {
      setOpenState(Boolean(openProp));
    }
  }, [openProp, isControlled]);

  const handleOpenChange = (next: boolean) => {
    if (onOpenChange) onOpenChange(next);
    if (!isControlled) setOpenState(next);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onUpdate(status);
      toast.success("Status updated");
      handleOpenChange(false);
    } catch (error) {
      captureError(error, { source: "update-status" });
      toast.error("Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={openState} onOpenChange={handleOpenChange}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : !isControlled ? (
        <DialogTrigger asChild>
          <Button variant="outline">{triggerLabel}</Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
