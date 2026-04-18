"use client";

import React from "react";
import useSWR from "swr";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Clock3,
  CreditCard,
  DollarSign,
  School,
  Store,
  UsersRound,
  UserRound,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import PageHeader from "@/components/layout/page-header";
import EntityCell from "@/components/shared/entity-cell";
import ErrorState from "@/components/shared/error-state";
import ContentLoader from "@/components/shared/content-loader";
import StatusBadge from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/format-date";
import { formatCurrencyValue, formatNumberValue } from "@/lib/display";
import { cn } from "@/lib/utils";

type IconType = React.ComponentType<{ className?: string }>;

interface DashboardStatusEntry {
  status?: string;
  total?: number;
}

interface DashboardSchool {
  id: string;
  school_id?: string;
  school_name?: string;
  school_address?: string;
  status?: string;
  created_at?: string;
}

interface DashboardStudent {
  id: string;
  student_id?: string;
  ssid?: string;
  full_name?: string;
  status?: string;
  school?: {
    id: string;
    school_id?: string;
    school_name?: string;
    school_address?: string;
    status?: string;
  } | null;
  card?: {
    id: string;
    card_id?: string;
    card_number?: string;
    status?: string;
  } | null;
  created_at?: string;
}

interface DashboardVendor {
  id: string;
  vendor_id?: string;
  vendor_name?: string;
  status?: string;
  school?: {
    id: string;
    school_id?: string;
    school_name?: string;
    school_address?: string;
    status?: string;
  } | null;
  owner?: {
    id?: string | number;
    user_profile_id?: string;
    contact?: string;
    user?: {
      full_name?: string;
      email?: string;
    } | null;
  } | null;
  created_at?: string;
}

interface DashboardActivity {
  id: string;
  activity_log_id?: string;
  action?: string;
  ip_address?: string | null;
  created_at?: string;
  user?: {
    id?: number;
    full_name?: string;
    email?: string;
    is_active?: boolean;
  } | null;
}

interface DashboardOverview {
  totals?: Record<string, unknown>;
  statuses?: {
    schools?: DashboardStatusEntry[];
    students?: DashboardStatusEntry[];
    vendors?: DashboardStatusEntry[];
    cards?: DashboardStatusEntry[];
    transactions?: DashboardStatusEntry[];
  };
  money?: Record<string, unknown>;
  recent?: {
    schools?: DashboardSchool[];
    students?: DashboardStudent[];
    vendors?: DashboardVendor[];
    activity?: DashboardActivity[];
    transactions?: unknown[];
  };
}

interface StatTileProps {
  icon: IconType;
  label: string;
  value: string;
  note: string;
  size?: "sm" | "md";
}

interface DashboardSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

interface RecentCardProps<T> {
  icon: IconType;
  title: string;
  description: string;
  items: T[];
  emptyText: string;
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  contentClassName?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: unknown }>;
  label?: string;
  formatValue?: (value: unknown) => string;
}

const PORTFOLIO_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary) / 0.7)",
  "hsl(var(--accent) / 0.7)",
  "hsl(var(--chart-1) / 0.7)",
];

const getNumericValue = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "bigint") {
    return Number(value);
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (!value || typeof value !== "object") {
    return 0;
  }

  const record = value as Record<string, unknown>;
  return getNumericValue(
    record.parsedValue ??
      record.value ??
      record.amount ??
      record.total ??
      record.source,
  );
};

function StatTile({
  icon: Icon,
  label,
  value,
  note,
  size = "md",
}: StatTileProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        size === "sm" ? "p-4" : "p-5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={cn(
              "uppercase tracking-[0.22em] text-muted-foreground",
              size === "sm" ? "text-[10px]" : "text-xs",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "mt-2 font-semibold text-foreground",
              size === "sm" ? "text-xl" : "text-2xl",
            )}
          >
            {value}
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p
        className={cn(
          "mt-3 text-muted-foreground",
          size === "sm" ? "text-xs" : "text-sm",
        )}
      >
        {note}
      </p>
    </div>
  );
}

function DashboardSection({
  title,
  description,
  children,
}: DashboardSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function RecentItemFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
      {children}
    </div>
  );
}

function RecentCard<T>({
  icon: Icon,
  title,
  description,
  items,
  emptyText,
  getKey,
  renderItem,
  contentClassName,
}: RecentCardProps<T>) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="rounded-xl border border-border/60 bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          "space-y-3",
          contentClassName ?? "max-h-[22rem] overflow-y-auto pr-1",
        )}
      >
        {items.length ? (
          items.map((item) => <div key={getKey(item)}>{renderItem(item)}</div>)
        ) : (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        )}
      </CardContent>
    </Card>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  formatValue = formatNumberValue,
}: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const entry = payload[0];

  return (
    <div className="rounded-xl border border-border/60 bg-card px-3 py-2 shadow-lg">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">
        {formatValue(entry.value)}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR("/api/admin/dashboard/overview/");

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const overview = (data?.data as DashboardOverview | undefined) ?? {};
  const totals = overview.totals ?? {};
  const money = overview.money ?? {};
  const recent = overview.recent ?? {};

  const footprintMetrics = [
    {
      icon: School,
      label: "Schools",
      value: formatNumberValue(totals.schools),
      note: "Registered schools.",
    },
    {
      icon: UsersRound,
      label: "Students",
      value: formatNumberValue(totals.students),
      note: "Student records in the system.",
    },
    {
      icon: UserRound,
      label: "Parents",
      value: formatNumberValue(totals.parents),
      note: "Parent profiles linked to accounts.",
    },
    {
      icon: Store,
      label: "Vendors",
      value: formatNumberValue(totals.vendors),
      note: "Vendor records currently managed.",
    },
    {
      icon: CreditCard,
      label: "Cards",
      value: formatNumberValue(totals.cards),
      note: "Cards in circulation or pending.",
    },
    {
      icon: ArrowUpRight,
      label: "Transactions",
      value: formatNumberValue(totals.transactions),
      note: "Transaction records captured.",
    },
  ];

  const staffingMetrics = [
    {
      icon: UsersRound,
      label: "School personnel",
      value: formatNumberValue(totals.school_personnel),
      note: "Personnel assigned to schools.",
    },
    {
      icon: UsersRound,
      label: "Vendor personnel",
      value: formatNumberValue(totals.vendor_personnel),
      note: "Personnel assigned to vendors.",
    },
    {
      icon: UsersRound,
      label: "Admin personnel",
      value: formatNumberValue(totals.admin_personnel),
      note: "Administrative users with access.",
    },
    {
      icon: Wallet,
      label: "Sales",
      value: formatNumberValue(totals.sales),
      note: "Recorded vendor sales.",
    },
  ];

  const moneyMetrics = [
    {
      icon: DollarSign,
      label: "Today's transactions",
      value: formatCurrencyValue(money.today_transaction_total),
      note: "Transactions completed today.",
    },
    {
      icon: ArrowUpRight,
      label: "Monthly transactions",
      value: formatCurrencyValue(money.monthly_transaction_total),
      note: "Transaction total for the month.",
    },
    {
      icon: Wallet,
      label: "Today's vendor sales",
      value: formatCurrencyValue(money.today_vendor_sales),
      note: "Vendor sales completed today.",
    },
    {
      icon: Wallet,
      label: "Monthly vendor sales",
      value: formatCurrencyValue(money.monthly_vendor_sales),
      note: "Vendor sales total for the month.",
    },
  ];

  const portfolioData = [
    { name: "Schools", value: getNumericValue(totals.schools) },
    { name: "Students", value: getNumericValue(totals.students) },
    { name: "Parents", value: getNumericValue(totals.parents) },
    { name: "Vendors", value: getNumericValue(totals.vendors) },
    { name: "Cards", value: getNumericValue(totals.cards) },
    { name: "Transactions", value: getNumericValue(totals.transactions) },
    { name: "Sales", value: getNumericValue(totals.sales) },
    {
      name: "School personnel",
      value: getNumericValue(totals.school_personnel),
    },
    {
      name: "Vendor personnel",
      value: getNumericValue(totals.vendor_personnel),
    },
    {
      name: "Admin personnel",
      value: getNumericValue(totals.admin_personnel),
    },
  ];
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard Overview" />

      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {footprintMetrics.map((metric) => (
            <StatTile
              key={metric.label}
              icon={metric.icon}
              label={metric.label}
              value={metric.value}
              note={metric.note}
            />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {staffingMetrics.map((metric) => (
            <StatTile
              key={metric.label}
              icon={metric.icon}
              label={metric.label}
              value={metric.value}
              note={metric.note}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div className="space-y-1">
              <CardTitle>Portfolio mix</CardTitle>
              <CardDescription>
                All entity totals arranged from the current overview.
              </CardDescription>
            </div>
            <div className="rounded-xl border border-border/60 bg-primary/10 p-2 text-primary">
              <BarChart3 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={portfolioData}
                  layout="vertical"
                  margin={{ top: 8, right: 16, bottom: 8, left: 12 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    type="number"
                    tickFormatter={(value) => formatNumberValue(value)}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<ChartTooltip formatValue={formatNumberValue} />}
                    cursor={{ fill: "hsl(var(--muted))", fillOpacity: 0.25 }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={18}>
                    {portfolioData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <DashboardSection
        title="Money snapshot"
        description="Today and month-to-date transaction and vendor sales totals."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {moneyMetrics.map((metric) => (
            <StatTile
              key={metric.label}
              icon={metric.icon}
              label={metric.label}
              value={metric.value}
              note={metric.note}
              size="sm"
            />
          ))}
        </div>
      </DashboardSection>

      <section className="grid gap-6 lg:grid-cols-2">
        <RecentCard<DashboardSchool>
          icon={School}
          title="Recent schools"
          description="Newest school registrations."
          items={recent.schools ?? []}
          emptyText="No recent schools."
          getKey={(school) => school.id}
          renderItem={(school) => (
            <RecentItemFrame>
              <div className="flex items-start justify-between gap-3">
                <EntityCell
                  className="min-w-0 flex-1"
                  title={school.school_name ?? "Unnamed school"}
                  subtitle={
                    [school.school_id, school.school_address]
                      .filter(Boolean)
                      .join(" / ") || undefined
                  }
                />
                <StatusBadge status={school.status} />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                <span>{formatDateTime(school.created_at)}</span>
              </div>
            </RecentItemFrame>
          )}
        />

        <RecentCard<DashboardStudent>
          icon={UsersRound}
          title="Recent students"
          description="Latest student registrations and card assignments."
          items={recent.students ?? []}
          emptyText="No recent students."
          getKey={(student) => student.id}
          renderItem={(student) => (
            <RecentItemFrame>
              <div className="flex items-start justify-between gap-3">
                <EntityCell
                  className="min-w-0 flex-1"
                  title={student.full_name ?? "Unnamed student"}
                  subtitle={
                    [
                      student.student_id,
                      student.ssid,
                      student.school?.school_name,
                    ]
                      .filter(Boolean)
                      .join(" / ") || undefined
                  }
                />
                <StatusBadge status={student.status} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" />
                  {formatDateTime(student.created_at)}
                </span>
                <span>Card {student.card?.card_number ?? "unassigned"}</span>
                {student.card?.status ? (
                  <StatusBadge status={student.card.status} />
                ) : null}
              </div>
            </RecentItemFrame>
          )}
        />

        <RecentCard<DashboardVendor>
          icon={Store}
          title="Recent vendors"
          description="Newest vendor registrations and ownership details."
          items={recent.vendors ?? []}
          emptyText="No recent vendors."
          getKey={(vendor) => vendor.id}
          renderItem={(vendor) => (
            <RecentItemFrame>
              <div className="flex items-start justify-between gap-3">
                <EntityCell
                  className="min-w-0 flex-1"
                  title={vendor.vendor_name ?? "Unnamed vendor"}
                  subtitle={
                    [
                      vendor.vendor_id,
                      vendor.school?.school_name,
                      vendor.owner?.user?.full_name,
                    ]
                      .filter(Boolean)
                      .join(" / ") || undefined
                  }
                />
                <StatusBadge status={vendor.status} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" />
                  {formatDateTime(vendor.created_at)}
                </span>
                {vendor.owner?.contact ? (
                  <span>Owner {vendor.owner.contact}</span>
                ) : null}
              </div>
            </RecentItemFrame>
          )}
        />

        <RecentCard<DashboardActivity>
          icon={Activity}
          title="Recent activity"
          description="Latest audit trail entries."
          items={recent.activity ?? []}
          emptyText="No recent activity."
          getKey={(activity) => activity.id}
          renderItem={(activity) => (
            <RecentItemFrame>
              <div className="flex items-start justify-between gap-3">
                <EntityCell
                  className="min-w-0 flex-1"
                  title={activity.action ?? "Activity"}
                  subtitle={
                    [
                      activity.user?.full_name ?? "System",
                      activity.ip_address ?? "No IP address",
                    ]
                      .filter(Boolean)
                      .join(" / ") || undefined
                  }
                />
                <Badge variant="secondary">Log</Badge>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                <span>{formatDateTime(activity.created_at)}</span>
              </div>
            </RecentItemFrame>
          )}
          contentClassName="max-h-[24rem] overflow-y-auto pr-1"
        />
      </section>
    </div>
  );
}
