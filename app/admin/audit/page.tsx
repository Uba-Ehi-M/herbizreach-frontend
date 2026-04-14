"use client";

import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionError } from "@/components/shared/SectionError";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuditLogs } from "@/hooks/useAdmin";
import type { AuditLogEntry } from "@/types/admin.types";

const PAGE_SIZE = 50;
const columnHelper = createColumnHelper<AuditLogEntry>();

function formatMetadata(meta: unknown): string {
  if (meta == null) return "—";
  try {
    const s = JSON.stringify(meta);
    return s.length > 120 ? `${s.slice(0, 120)}…` : s;
  } catch {
    return String(meta);
  }
}

export default function AdminAuditPage() {
  const [page, setPage] = useState(1);
  const [actorDraft, setActorDraft] = useState("");
  const [entityDraft, setEntityDraft] = useState("");
  const [actorUserId, setActorUserId] = useState<string | undefined>(undefined);
  const [entityType, setEntityType] = useState<string | undefined>(undefined);

  const params = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      ...(actorUserId ? { actorUserId } : {}),
      ...(entityType ? { entityType } : {}),
    }),
    [page, actorUserId, entityType],
  );

  const { data, isLoading, isError, refetch } = useAdminAuditLogs(params);

  const applyFilters = () => {
    setPage(1);
    const a = actorDraft.trim();
    const e = entityDraft.trim();
    setActorUserId(a || undefined);
    setEntityType(e || undefined);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("createdAt", {
        header: "Time",
        cell: (info) => (
          <span className="whitespace-nowrap tabular-nums">
            {format(new Date(info.getValue()), "MMM d, HH:mm:ss")}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actor",
        header: "Actor",
        cell: (info) => {
          const a = info.row.original.actor;
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-[var(--text-primary)]">{a.fullName}</span>
              <span className="text-xs text-[var(--text-muted)]">{a.email}</span>
              <Badge variant="secondary" className="w-fit text-[10px]">
                {a.role}
              </Badge>
            </div>
          );
        },
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <code className="rounded bg-[var(--bg-muted)] px-1.5 py-0.5 text-xs">{info.getValue()}</code>
        ),
      }),
      columnHelper.accessor("entityType", {
        header: "Entity",
        cell: (info) => (
          <span>
            {info.getValue()}
            {info.row.original.entityId ? (
              <span className="mt-1 block truncate text-xs text-[var(--text-muted)]">
                {info.row.original.entityId}
              </span>
            ) : null}
          </span>
        ),
      }),
      columnHelper.accessor("metadata", {
        header: "Metadata",
        cell: (info) => (
          <span className="font-mono text-xs text-[var(--text-muted)]">{formatMetadata(info.getValue())}</span>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data ? Math.ceil(data.total / PAGE_SIZE) : 0,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="space-y-6">
      <PageHeader
        className="!px-0"
        title="Audit log"
        description="Administrative actions recorded for compliance and debugging."
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="audit-actor">Actor user ID</Label>
            <Input
              id="audit-actor"
              placeholder="UUID filter…"
              value={actorDraft}
              onChange={(e) => setActorDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="audit-entity">Entity type</Label>
            <Input
              id="audit-entity"
              placeholder="e.g. user, product"
              value={entityDraft}
              onChange={(e) => setEntityDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>
        </div>
        <Button type="button" className="w-full shrink-0 sm:w-auto" onClick={applyFilters}>
          Apply filters
        </Button>
      </div>

      {isError ? (
        <SectionError message="Could not load audit log." onRetry={() => void refetch()} />
      ) : isLoading ? (
        <div className="h-48 animate-pulse rounded-[var(--radius-lg)] bg-[var(--bg-muted)]" />
      ) : (
        <>
          <AdminDataTable
            table={table}
            emptyMessage="No audit entries match your filters."
            className="min-w-0"
          />
          <AdminPagination
            page={page}
            totalPages={totalPages}
            totalItems={data?.total ?? 0}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
