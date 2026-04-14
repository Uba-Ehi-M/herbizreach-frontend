"use client";

import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionError } from "@/components/shared/SectionError";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAdminConversationMessages, useAdminConversations } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import type { AdminConversationRow } from "@/types/admin.types";
import type { MessageSenderType } from "@/types/chat.types";

const PAGE_SIZE = 20;
const MSG_PAGE_SIZE = 100;
const columnHelper = createColumnHelper<AdminConversationRow>();

function senderLabel(t: MessageSenderType): string {
  switch (t) {
    case "OWNER":
      return "Store";
    case "CUSTOMER":
      return "Customer";
    case "GUEST":
      return "Guest";
    case "SYSTEM":
      return "System";
    default:
      return t;
  }
}

export default function AdminConversationsPage() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const params = useMemo(() => ({ page, limit: PAGE_SIZE }), [page]);
  const { data, isLoading, isError, refetch } = useAdminConversations(params);
  const messagesQuery = useAdminConversationMessages(
    selectedId ?? undefined,
    { page: 1, limit: MSG_PAGE_SIZE },
    Boolean(selectedId),
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "store",
        header: "Store",
        cell: (info) => {
          const s = info.row.original.storeOwner;
          return (
            <span className="text-[var(--text-secondary)]">
              {s?.businessName || s?.email || "—"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "customer",
        header: "Customer / guest",
        cell: (info) => {
          const c = info.row.original.customer;
          const guest = info.row.original.guestToken;
          if (c?.fullName) return c.fullName;
          if (guest) return <span className="text-[var(--text-muted)]">Guest chat</span>;
          return "—";
        },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <Badge variant={info.getValue() === "OPEN" ? "success" : "secondary"}>
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor("lastMessageAt", {
        header: "Last activity",
        cell: (info) => {
          const v = info.getValue();
          return v ? format(new Date(v), "MMM d, yyyy HH:mm") : "—";
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: (info) => (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="min-h-9"
            onClick={() => setSelectedId(info.row.original.id)}
          >
            <MessageSquare className="size-4" />
            <span className="hidden sm:inline">Messages</span>
          </Button>
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
        title="Chats"
        description="Review conversations across the platform (read-only)."
      />

      {isError ? (
        <SectionError message="Could not load conversations." onRetry={() => void refetch()} />
      ) : isLoading ? (
        <div className="h-48 animate-pulse rounded-[var(--radius-lg)] bg-[var(--bg-muted)]" />
      ) : (
        <>
          <AdminDataTable table={table} emptyMessage="No conversations yet." />
          <AdminPagination
            page={page}
            totalPages={totalPages}
            totalItems={data?.total ?? 0}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      <Sheet open={Boolean(selectedId)} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent
          side="right"
          className="flex h-full w-[min(100vw,28rem)] max-w-[100vw] flex-col gap-0 overflow-hidden p-0 sm:w-[28rem]"
        >
          <div className="shrink-0 border-b border-[var(--border-default)] px-4 py-4 pr-14">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">
              Messages
            </h2>
            <p className="truncate text-xs text-[var(--text-muted)]">{selectedId}</p>
          </div>
          <ScrollArea className="h-[calc(100dvh-6rem)] px-4 py-4">
            {messagesQuery.isLoading ? (
              <div className="h-40 animate-pulse rounded-[var(--radius-md)] bg-[var(--bg-muted)]" />
            ) : messagesQuery.isError ? (
              <p className="text-sm text-[var(--danger)]">Could not load messages.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {(messagesQuery.data?.items ?? []).map((m) => (
                  <li
                    key={m.id}
                    className={cn(
                      "rounded-[var(--radius-md)] border border-[var(--border-default)] px-3 py-2 text-sm",
                      m.senderType === "OWNER" && "border-[var(--brand-primary)]/30 bg-[var(--brand-glow)]",
                    )}
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        {senderLabel(m.senderType)}
                      </span>
                      <span>{format(new Date(m.createdAt), "MMM d, HH:mm")}</span>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-[var(--text-primary)]">{m.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
          {messagesQuery.data && messagesQuery.data.total > MSG_PAGE_SIZE ? (
            <p className="border-t border-[var(--border-default)] px-4 py-2 text-center text-xs text-[var(--text-muted)]">
              Showing first {MSG_PAGE_SIZE} of {messagesQuery.data.total} messages
            </p>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
