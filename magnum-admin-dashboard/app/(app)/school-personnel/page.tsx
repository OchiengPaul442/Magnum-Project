"use client";

import React from "react";

import PageHeader from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SchoolPersonnelPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="School Personnel"
        subtitle="School staff management will be added once the API is available."
      />
      <Card>
        <CardHeader>
          <CardTitle>School Personnel Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The current API does not expose a dedicated school personnel
            endpoint. Once available, this section will list school personnel
            and allow create/update actions. For now, use Admin Users to manage
            admin access.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
