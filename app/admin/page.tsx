"use client";

import { AdminOverviewCharts } from "@/components/admin/AdminOverviewCharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { SectionError } from "@/components/shared/SectionError";
import { useAdminMetrics } from "@/hooks/useAdmin";
import type { AdminMetricsPayload } from "@/types/admin.types";

function normalizeMetrics(raw: unknown): AdminMetricsPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Partial<AdminMetricsPayload>;
  if (!d.users || !d.products || !d.engagement) return null;

  const published = d.products.published ?? 0;
  const total = d.products.total ?? 0;

  return {
    users: {
      total: d.users.total ?? 0,
      owners: d.users.owners ?? 0,
      customers: d.users.customers ?? 0,
      admins: d.users.admins ?? 0,
    },
    products: {
      total,
      published,
      unpublished: d.products.unpublished ?? Math.max(0, total - published),
      featured: d.products.featured ?? 0,
    },
    engagement: {
      pageViews: d.engagement.pageViews ?? 0,
      shareEvents: d.engagement.shareEvents ?? 0,
      conversations: d.engagement.conversations ?? 0,
      leads: d.engagement.leads ?? 0,
      openConversations: d.engagement.openConversations ?? 0,
      messagesTotal: d.engagement.messagesTotal ?? 0,
    },
    activity: {
      auditLogsTotal: d.activity?.auditLogsTotal ?? 0,
      newUsers7d: d.activity?.newUsers7d ?? 0,
      newUsers30d: d.activity?.newUsers30d ?? 0,
      newProducts7d: d.activity?.newProducts7d ?? 0,
      newLeads30d: d.activity?.newLeads30d ?? 0,
    },
    seriesLast14Days: Array.isArray(d.seriesLast14Days) ? d.seriesLast14Days : [],
  };
}

export default function AdminDashboardPage() {
  const { data: raw, isLoading, isError, refetch } = useAdminMetrics();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const data = normalizeMetrics(raw);
  if (isError || !data) {
    return <SectionError message="Could not load admin metrics." onRetry={() => void refetch()} />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        className="!px-0"
        title="Platform overview"
        description="Aggregate stats, trends, and health signals across all tenants."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
          <p className="text-xs font-medium uppercase text-[var(--text-muted)]">Users</p>
          <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{data.users.total}</p>
          <p className="text-xs text-[var(--text-muted)]">
            {data.users.owners} owners · {data.users.customers} customers · {data.users.admins} admins
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
          <p className="text-xs font-medium uppercase text-[var(--text-muted)]">Products</p>
          <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{data.products.total}</p>
          <p className="text-xs text-[var(--text-muted)]">
            {data.products.published} published · {data.products.unpublished} drafts
          </p>
          <p className="text-xs text-[var(--text-muted)]">{data.products.featured} featured</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium uppercase text-[var(--text-muted)]">Engagement</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {data.engagement.pageViews} views · {data.engagement.shareEvents} shares
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            {data.engagement.conversations} chats ({data.engagement.openConversations} open) ·{" "}
            {data.engagement.leads} leads
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {data.engagement.messagesTotal} messages total
          </p>
        </div>
      </div>

      <AdminOverviewCharts data={data} />
    </div>
  );
}
