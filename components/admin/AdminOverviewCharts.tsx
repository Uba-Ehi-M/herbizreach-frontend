"use client";

import { format, parseISO } from "date-fns";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import type { AdminMetricsPayload } from "@/types/admin.types";

const BRAND = "#7c3aed";
const MUTED = "#9ca3af";
const CHART_GRID = "var(--border-default)";
const TOOLTIP_BG = "var(--bg-card)";
const TOOLTIP_BORDER = "var(--border-default)";

function chartTick(dateStr: string) {
  try {
    return format(parseISO(dateStr), "MMM d");
  } catch {
    return dateStr;
  }
}

export function AdminOverviewCharts({ data }: { data: AdminMetricsPayload }) {
  const { users, products, engagement, activity, seriesLast14Days } = data;

  const rolePie = [
    { name: "Owners", value: users.owners, color: BRAND },
    { name: "Customers", value: users.customers, color: "#a78bfa" },
    { name: "Admins", value: users.admins, color: "#c4b5fd" },
  ].filter((x) => x.value > 0);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
          <p className="text-xs font-medium uppercase text-[var(--text-muted)]">New users</p>
          <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{activity.newUsers7d}</p>
          <p className="text-xs text-[var(--text-muted)]">last 7 days · {activity.newUsers30d} in 30 days</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
          <p className="text-xs font-medium uppercase text-[var(--text-muted)]">Catalog</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">{products.unpublished}</span>{" "}
            drafts
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">{products.featured}</span>{" "}
            featured
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
          <p className="text-xs font-medium uppercase text-[var(--text-muted)]">Messaging</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">
              {engagement.openConversations}
            </span>{" "}
            open chats
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">
              {engagement.messagesTotal}
            </span>{" "}
            messages (all time)
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
          <p className="text-xs font-medium uppercase text-[var(--text-muted)]">Leads & audit</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">{activity.newLeads30d}</span>{" "}
            leads (30d)
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">{activity.auditLogsTotal}</span>{" "}
            audit entries
          </p>
          <Button asChild variant="link" className="mt-1 h-auto min-h-0 p-0 text-xs">
            <Link href="/admin/audit">View audit log →</Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 sm:p-5">
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
            Traffic & messages (14 days)
          </h2>
          <p className="mb-4 text-xs text-[var(--text-muted)]">Page views vs chat messages per day (UTC)</p>
          <div className="w-full min-w-0">
            <ResponsiveContainer width="100%" height={300} minWidth={0}>
              <AreaChart data={seriesLast14Days} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pvFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="msgFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={chartTick}
                  tick={{ fill: MUTED, fontSize: 11 }}
                  axisLine={{ stroke: CHART_GRID }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: MUTED, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: TOOLTIP_BG,
                    border: `1px solid ${TOOLTIP_BORDER}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelFormatter={(label) => {
                    try {
                      return format(parseISO(String(label)), "EEE, MMM d");
                    } catch {
                      return String(label);
                    }
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  name="Page views"
                  stroke={BRAND}
                  fill="url(#pvFill)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  name="Messages"
                  stroke="#22c55e"
                  fill="url(#msgFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 sm:p-5">
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
            Growth (14 days)
          </h2>
          <p className="mb-4 text-xs text-[var(--text-muted)]">New accounts, products, and shares per day</p>
          <div className="w-full min-w-0">
            <ResponsiveContainer width="100%" height={300} minWidth={0}>
              <BarChart data={seriesLast14Days} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={chartTick}
                  tick={{ fill: MUTED, fontSize: 11 }}
                  axisLine={{ stroke: CHART_GRID }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: MUTED, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: TOOLTIP_BG,
                    border: `1px solid ${TOOLTIP_BORDER}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelFormatter={(label) => {
                    try {
                      return format(parseISO(String(label)), "EEE, MMM d");
                    } catch {
                      return String(label);
                    }
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="signups" name="Signups" fill={BRAND} radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar
                  dataKey="newProducts"
                  name="New products"
                  fill="#a78bfa"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar dataKey="shares" name="Shares" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 sm:p-5">
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
            User mix
          </h2>
          <p className="mb-2 text-xs text-[var(--text-muted)]">By role (excludes zero-count slices)</p>
          <div className="mx-auto w-full min-w-0 max-w-xs">
            {rolePie.length === 0 ? (
              <p className="py-12 text-center text-sm text-[var(--text-muted)]">No user data</p>
            ) : (
              <ResponsiveContainer width="100%" height={260} minWidth={0}>
                <PieChart>
                  <Pie
                    data={rolePie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {rolePie.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: TOOLTIP_BG,
                      border: `1px solid ${TOOLTIP_BORDER}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 sm:p-5">
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
            Quick snapshot
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex justify-between gap-4 border-b border-[var(--border-default)] pb-2">
              <span>New products (7d)</span>
              <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                {activity.newProducts7d}
              </span>
            </li>
            <li className="flex justify-between gap-4 border-b border-[var(--border-default)] pb-2">
              <span>Published / total products</span>
              <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                {products.published} / {products.total}
              </span>
            </li>
            <li className="flex justify-between gap-4 border-b border-[var(--border-default)] pb-2">
              <span>Total conversations</span>
              <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                {engagement.conversations}
              </span>
            </li>
            <li className="flex justify-between gap-4 border-b border-[var(--border-default)] pb-2">
              <span>Total leads (all time)</span>
              <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                {engagement.leads}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Total shares (all time)</span>
              <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                {engagement.shareEvents}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
