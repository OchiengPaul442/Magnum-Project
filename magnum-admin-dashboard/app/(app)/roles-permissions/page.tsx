"use client";

import React from "react";

import PageHeader from "@/components/layout/page-header";
import ErrorState from "@/components/shared/error-state";
import ContentLoader from "@/components/shared/content-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDetailData } from "@/hooks/use-list-data";
import { normalizeGroupEntries } from "@/lib/display";

export default function RolesPermissionsPage() {
  const { data, error, isLoading } = useDetailData<Record<string, unknown>>(
    "/api/admin/groups-permissions/",
  );

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const payload = (data?.data as Record<string, unknown>) ?? {};
  const groups = normalizeGroupEntries(payload.groups ?? payload);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles and Permissions"
        subtitle="Review available admin groups and permissions."
      />
      <div className="grid gap-4">
        {groups.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No groups returned.
              </p>
            </CardContent>
          </Card>
        ) : null}
        {groups.map((group) => (
          <Card key={group.name}>
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {group.permissions.length ? (
                <ul className="text-sm text-muted-foreground space-y-1">
                  {group.permissions.map((permission) => (
                    <li key={permission}>{permission}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No permissions listed.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
