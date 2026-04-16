"use client";

import * as React from "react";
import { Toaster } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  XCircle,
} from "lucide-react";

const TOAST_DURATION = 4500;

export default function AppToaster() {
  return (
    <Toaster
      richColors={false}
      position="bottom-right"
      duration={TOAST_DURATION}
      icons={{
        success: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
        error: <XCircle className="h-4 w-4 text-red-600" />,
        warning: <AlertTriangle className="h-4 w-4 text-amber-600" />,
        info: <Info className="h-4 w-4 text-sky-600" />,
        loading: <Loader2 className="h-4 w-4 animate-spin text-slate-500" />,
      }}
      toastOptions={{
        duration: TOAST_DURATION,
        style: {
          "--toast-duration": `${TOAST_DURATION}ms`,
        } as React.CSSProperties,
        classNames: {
          toast:
            "group relative overflow-hidden rounded-xl border border-border/80 bg-white text-foreground shadow-lg",
          title: "text-sm font-semibold text-foreground",
          description: "text-xs text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton: "bg-muted text-foreground hover:bg-muted/80",
          icon: "shrink-0",
        },
      }}
    />
  );
}
