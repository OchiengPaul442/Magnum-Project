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
import { adminApi } from "@/lib/api/admin";
import { captureError } from "@/lib/logging";

interface BulkImportDialogProps {
  onSuccess: () => void;
}

export default function BulkImportDialog({ onSuccess }: BulkImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!file) return;
    setSubmitting(true);
    try {
      await adminApi.bulkImportCards(file);
      toast.success("Cards imported successfully");
      onSuccess();
      setOpen(false);
      setFile(null);
    } catch (error) {
      captureError(error, { source: "bulk-import-cards" });
      toast.error("Bulk import failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Bulk Import CSV</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Import Cards</DialogTitle>
          <DialogDescription>
            Upload a CSV with card_number, card_serial_number, card_pin, and
            expiration_date.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="file"
            accept=".csv"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <Button onClick={onSubmit} disabled={!file || submitting}>
            {submitting ? "Uploading..." : "Upload CSV"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
