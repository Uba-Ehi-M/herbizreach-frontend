"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SectionError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-8 text-center">
      <AlertCircle className="size-10 text-[var(--danger)]" />
      <p className="text-sm text-[var(--text-secondary)]">{message}</p>
      {onRetry ? (
        <Button type="button" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
