"use client";

import { useMemo, useState } from "react";
import { Eye, Share2, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionError } from "@/components/shared/SectionError";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatCard } from "@/components/analytics/StatCard";
import { EngagementChart } from "@/components/analytics/EngagementChart";
import { useAnalyticsOverview } from "@/hooks/useAnalytics";
import { useLeads } from "@/hooks/useLeads";
import { Button } from "@/components/ui/button";
import type { AnalyticsProductRow } from "@/types/analytics.types";

type SortKey = "name" | "pageViews" | "shares";

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useAnalyticsOverview();
  const { data: leads } = useLeads();
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "pageViews",
    dir: "desc",
  });

  const sorted = useMemo(() => {
    if (!data?.products) return [];
    const rows = [...data.products];
    rows.sort((a, b) => {
      const mul = sort.dir === "asc" ? 1 : -1;
      if (sort.key === "name") {
        return mul * a.name.localeCompare(b.name);
      }
      return mul * (a[sort.key] - b[sort.key]);
    });
    return rows;
  }, [data?.products, sort]);

  function toggleHeader(key: SortKey) {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" },
    );
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (isError || !data) {
    return <SectionError message="Could not load analytics." onRetry={() => void refetch()} />;
  }

  const leadCount = leads?.length ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader title="Analytics" description="How shoppers engage with your store." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Total views" value={data.totals.pageViews} icon={Eye} index={0} />
        <StatCard label="Total shares" value={data.totals.shares} icon={Share2} index={1} />
        <StatCard label="Leads" value={leadCount} icon={Users} index={2} />
      </div>
      <EngagementChart data={data.viewsLast7Days} />
      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)]">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead className="border-b border-[var(--border-default)] bg-[var(--bg-subtle)]">
            <tr>
              <th className="p-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-10 font-semibold"
                  onClick={() => toggleHeader("name")}
                >
                  Product {sort.key === "name" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
                </Button>
              </th>
              <th className="p-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-10 font-semibold"
                  onClick={() => toggleHeader("pageViews")}
                >
                  Views {sort.key === "pageViews" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
                </Button>
              </th>
              <th className="p-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-10 font-semibold"
                  onClick={() => toggleHeader("shares")}
                >
                  Shares {sort.key === "shares" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row: AnalyticsProductRow) => (
              <tr key={row.productId} className="border-b border-[var(--border-default)]">
                <td className="p-3 font-medium text-[var(--text-primary)]">{row.name}</td>
                <td className="p-3 text-[var(--text-muted)]">{row.pageViews}</td>
                <td className="p-3 text-[var(--text-muted)]">{row.shares}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
