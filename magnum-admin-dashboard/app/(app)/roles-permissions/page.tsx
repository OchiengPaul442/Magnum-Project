"use client";

import React from "react";

import PageHeader from "@/components/layout/page-header";
import ErrorState from "@/components/shared/error-state";
import LoadingScreen from "@/components/shared/loading-screen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDetailData } from "@/hooks/use-list-data";

export default function RolesPermissionsPage() {
  const { data, error, isLoading } = useDetailData<Record<string, unknown>>(
    "/api/admin/groups-permissions/",
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState />;
  }

  const payload = (data?.data as Record<string, unknown>) ?? {};
  const groupsObject =
    payload.groups &&
    typeof payload.groups === "object" &&
    !Array.isArray(payload.groups)
      ? (payload.groups as Record<string, string[]>)
      : {};
  const groupsArray = Array.isArray(payload.groups)
    ? (payload.groups as string[])
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles and Permissions"
        subtitle="Review available admin groups and permissions."
      />
      <div className="grid gap-4">
        {Object.keys(groupsObject).length === 0 && groupsArray.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No groups returned.
              </p>
            </CardContent>
          </Card>
        ) : null}
        {Object.entries(groupsObject).map(([group, permissions]) => (
          <Card key={group}>
            <CardHeader>
              <CardTitle>{group}</CardTitle>
            </CardHeader>
            <CardContent>
              {permissions?.length ? (
                <ul className="text-sm text-muted-foreground space-y-1">
                  {permissions.map((permission) => (
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
        {groupsArray.map((group) => (
          <Card key={group}>
            <CardHeader>
              <CardTitle>{group}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Permissions are not provided in the response.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
