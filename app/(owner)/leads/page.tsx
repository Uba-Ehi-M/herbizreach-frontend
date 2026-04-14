"use client";

import { Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { SectionError } from "@/components/shared/SectionError";
import { useLeads } from "@/hooks/useLeads";
import { normalizeWaMeDigits } from "@/lib/ng-whatsapp-phone";
import { formatCurrency, formatDate } from "@/lib/utils";

function waHref(phone: string): string {
  return `https://wa.me/${normalizeWaMeDigits(phone)}`;
}

export default function LeadsPage() {
  const { data, isLoading, isError, refetch } = useLeads();

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (isError) {
    return <SectionError message="Could not load leads." onRetry={() => void refetch()} />;
  }

  if (!data?.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="Leads" description="People who reached out from your store." />
        <EmptyState
          title="No leads yet"
          description="When shoppers submit the contact form on your store, they appear here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Leads" description="Follow up while interest is hot." />
      <ul className="space-y-3">
        {data.map((lead) => (
          <li
            key={lead.id}
            className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-sm)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{lead.name}</p>
                <a
                  href={waHref(lead.phone)}
                  className="mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--brand-primary)]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="size-4" />
                  {lead.phone}
                </a>
              </div>
              <p className="text-xs text-[var(--text-muted)]">{formatDate(lead.createdAt)}</p>
            </div>
            {lead.message ? (
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{lead.message}</p>
            ) : null}
            {lead.product ? (
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                Product: {lead.product.name} · {formatCurrency(lead.product.price)}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
