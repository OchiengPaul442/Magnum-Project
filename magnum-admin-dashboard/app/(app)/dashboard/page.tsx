"use client";

import React from "react";
import useSWR from "swr";

import PageHeader from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorState from "@/components/shared/error-state";
import ContentLoader from "@/components/shared/content-loader";
import DataTable, { DataColumn } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";

const buildMetric = (label: string, value: unknown) => ({
  label,
  value: typeof value === "number" || typeof value === "string" ? value : "-",
});

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR("/api/admin/dashboard/overview/");

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <ErrorState />;
  }

  const overview = (data?.data as Record<string, unknown>) ?? {};

  const metrics = [
    buildMetric("Schools", overview.total_schools ?? overview.school_count),
    buildMetric("Students", overview.total_students ?? overview.student_count),
    buildMetric("Parents", overview.total_parents ?? overview.parent_count),
    buildMetric("Vendors", overview.total_vendors ?? overview.vendor_count),
    buildMetric("Cards", overview.total_cards ?? overview.card_count),
    buildMetric(
      "Transactions",
      overview.total_transactions ?? overview.transaction_count,
    ),
  ];

  const recentRecords =
    (overview.recent_records as Record<string, unknown>[]) ?? [];

  const columns: DataColumn<Record<string, unknown>>[] = [
    { key: "type", header: "Type" },
    { key: "reference", header: "Reference" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.status ? "secondary" : "outline"}>
          {(row.status as string) ?? "-"}
        </Badge>
      ),
    },
    { key: "created_at", header: "Created" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Whole-system health and recent operations."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">
                {metric.value ?? "-"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentRecords.length ? (
            <DataTable
              columns={columns}
              data={recentRecords}
              rowKey={(row) =>
                String(
                  row.id ?? row.reference ?? row.created_at ?? Math.random(),
                )
              }
            />
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
