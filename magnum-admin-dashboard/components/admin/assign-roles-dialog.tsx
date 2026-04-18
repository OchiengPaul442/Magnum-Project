"use client";

import React, { useMemo, useState } from "react";
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
import { normalizeStringList } from "@/lib/display";

interface AssignRolesDialogProps {
  userId: string | number;
  currentGroups: unknown[];
  availableGroups: unknown[];
  onSuccess: () => void;
}

export default function AssignRolesDialog({
  userId,
  currentGroups,
  availableGroups,
  onSuccess,
}: AssignRolesDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const normalizedCurrentGroups = useMemo(
    () => normalizeStringList(currentGroups),
    [currentGroups],
  );
  const normalizedAvailableGroups = useMemo(
    () => normalizeStringList(availableGroups),
    [availableGroups],
  );
  const [selected, setSelected] = useState<string[]>(normalizedCurrentGroups);

  const sortedGroups = useMemo(
    () => [...normalizedAvailableGroups].sort((a, b) => a.localeCompare(b)),
    [normalizedAvailableGroups],
  );

  React.useEffect(() => {
    setSelected(normalizedCurrentGroups);
  }, [normalizedCurrentGroups]);

  const toggleGroup = (group: string) => {
    setSelected((prev) =>
      prev.includes(group)
        ? prev.filter((item) => item !== group)
        : [...prev, group],
    );
  };

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      await adminApi.updateAdminUserRoles(String(userId), selected);
      toast.success("Roles updated");
      onSuccess();
      setOpen(false);
    } catch (error) {
      captureError(error, { source: "update-roles" });
      toast.error("Failed to update roles");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update Roles
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Roles</DialogTitle>
          <DialogDescription>
            Select the groups for this admin user.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {sortedGroups.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No groups available.
            </p>
          ) : (
            sortedGroups.map((group) => (
              <label key={group} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected.includes(group)}
                  onChange={() => toggleGroup(group)}
                />
                {group}
              </label>
            ))
          )}
        </div>
        <Button onClick={onSubmit} disabled={submitting}>
          {submitting ? "Saving..." : "Save Roles"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
