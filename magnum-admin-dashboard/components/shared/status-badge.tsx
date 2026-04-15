import React from "react";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status?: string | null;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status?.toLowerCase?.() ?? "";
  if (!status) return <Badge variant="secondary">Unknown</Badge>;

  if (["active", "approved", "enabled", "activated"].includes(normalized)) {
    return <Badge variant="success">Activated</Badge>;
  }

  if (["pending", "draft"].includes(normalized)) {
    return <Badge variant="secondary">Pending</Badge>;
  }

  if (["inactive", "disabled", "blocked", "deactivated"].includes(normalized)) {
    return <Badge variant="destructive">Deactivated</Badge>;
  }

  return <Badge variant="outline">{status}</Badge>;
}
