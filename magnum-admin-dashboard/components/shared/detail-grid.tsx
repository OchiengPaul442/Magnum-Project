"use client";

import React from "react";
import { X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDisplayValue } from "@/lib/display";
import { cn } from "@/lib/utils";

interface DetailField {
  label: string;
  value?: React.ReactNode;
}

interface DetailGridProps {
  title: string;
  subtitle?: string;
  fields: DetailField[];
  actions?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export default function DetailGrid({
  title,
  subtitle,
  fields,
  actions,
  onClose,
  className,
}: DetailGridProps) {
  return (
    <Card className={cn("border-border/60 shadow-sm", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div className="min-w-0 space-y-1">
          <CardTitle>{title}</CardTitle>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {actions ? (
            <div className="flex items-center gap-2">{actions}</div>
          ) : null}
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close ${title}`}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-white text-muted-foreground shadow-sm transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {field.label}
              </p>
              <p className="text-sm font-medium text-foreground">
                {formatDisplayValue(field.value)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
