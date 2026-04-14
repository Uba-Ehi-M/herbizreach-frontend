import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState(props: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  const { title, description, actionLabel, actionHref } = props;
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] bg-[var(--bg-subtle)] px-6 py-16 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--brand-glow)] text-[var(--brand-primary)]">
        <Sparkles className="size-8" />
      </div>
      <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">{description}</p>
      {actionLabel && actionHref ? (
        <Button asChild className="mt-6 min-h-11">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
