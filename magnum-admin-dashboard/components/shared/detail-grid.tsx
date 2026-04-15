import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DetailField {
  label: string;
  value?: React.ReactNode;
}

interface DetailGridProps {
  title: string;
  fields: DetailField[];
}

export default function DetailGrid({ title, fields }: DetailGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {field.label}
              </p>
              <p className="text-sm font-medium text-foreground">
                {field.value ?? "-"}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
