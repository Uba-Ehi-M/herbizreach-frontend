"use client";

import { cn } from "@/lib/utils";

const CHART_HEIGHT_PX = 120;

export function EngagementChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((a, d) => a + d.count, 0);

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
      <h3 className="mb-4 font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--text-primary)]">
        Views (last 7 days)
      </h3>
      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--text-muted)]">No view data yet.</p>
      ) : (
        <div className="flex gap-1 sm:gap-1.5" style={{ height: CHART_HEIGHT_PX + 22 }}>
          {data.map((d) => {
            const barPx =
              d.count === 0 ? 0 : Math.max(4, Math.round((d.count / max) * CHART_HEIGHT_PX));
            return (
              <div
                key={d.date}
                className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
                title={`${d.date}: ${d.count} view${d.count === 1 ? "" : "s"}`}
              >
                <div
                  className="flex w-full flex-col items-center justify-end"
                  style={{ height: CHART_HEIGHT_PX }}
                >
                  <div
                    className={cn(
                      "w-full max-w-[28px] rounded-t-[var(--radius-sm)] bg-[var(--brand-primary)] opacity-90 transition-[height] duration-300",
                    )}
                    style={{ height: barPx }}
                  />
                </div>
                <span className="shrink-0 text-[10px] tabular-nums text-[var(--text-muted)]">
                  {d.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {total > 0 ? (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          {total} view{total === 1 ? "" : "s"} in this range.
        </p>
      ) : null}
    </div>
  );
}
