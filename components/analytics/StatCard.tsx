"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  index = 0,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-sm)]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            {label}
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--text-primary)]">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-[var(--success)]">{hint}</p>
          ) : null}
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-glow)] text-[var(--brand-primary)]">
          <Icon className="size-5" />
        </div>
      </div>
    </motion.div>
  );
}
