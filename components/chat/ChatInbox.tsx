"use client";

import { Archive, ArrowLeft, ExternalLink, MoreVertical, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useArchiveConversation, useConversationMessages } from "@/hooks/useChat";
import { useOwnerActiveConversationJoin } from "@/hooks/useChatSocket";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat.types";
import { cn, formatChatListTime, formatDate } from "@/lib/utils";

function rowLabel(c: Conversation): string {
  return c.customer?.fullName?.trim() || (c.guestToken ? "Guest" : "Customer");
}

function avatarLetter(label: string): string {
  const t = label.trim();
  return t ? t[0]!.toUpperCase() : "?";
}

export function ChatInbox(props: { conversations: Conversation[] | undefined; loading: boolean }) {
  const { conversations, loading } = props;
  const token = useAuthStore((s) => s.token);
  const businessSlug = useAuthStore((s) => s.user?.businessSlug);
  const clearUnreadFor = useChatStore((s) => s.clearUnreadFor);
  const setActiveOwnerConversationId = useChatStore((s) => s.setActiveOwnerConversationId);
  const unreadByConversation = useChatStore((s) => s.unreadByConversation);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => conversations?.find((c) => c.id === selectedId) ?? null,
    [conversations, selectedId],
  );

  const sorted = useMemo(() => {
    if (!conversations?.length) return [];
    return [...conversations].sort((a, b) => {
      const ta = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const tb = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return tb - ta;
    });
  }, [conversations]);

  const { data: messagesData } = useConversationMessages(selectedId, null);
  const archive = useArchiveConversation();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useOwnerActiveConversationJoin(selectedId);

  useEffect(() => {
    setActiveOwnerConversationId(selectedId);
    if (selectedId) clearUnreadFor(selectedId);
    return () => setActiveOwnerConversationId(null);
  }, [selectedId, clearUnreadFor, setActiveOwnerConversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData?.items, selectedId]);

  function send() {
    const t = text.trim();
    if (!t || !selectedId || !token) return;
    setText("");
    const socket = getSocket(token);
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("sendMessage", { conversationId: selectedId, body: t });
  }

  function backToList() {
    setSelectedId(null);
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem-4rem)] flex-col md:h-auto md:min-h-[calc(100vh-9rem)] md:flex-row md:gap-0 md:rounded-[var(--radius-lg)] md:border md:border-[var(--border-default)] md:bg-[var(--bg-card)]">
      {/* Conversation list — full screen on mobile until a chat is opened */}
      <aside
        className={cn(
          "flex min-h-0 w-full flex-col border-[var(--border-default)] bg-[var(--bg-base)] md:w-80 md:max-h-[calc(100vh-9rem)] md:shrink-0 md:rounded-l-[var(--radius-lg)] md:border-0 md:border-r",
          selectedId ? "hidden md:flex" : "flex flex-1",
        )}
      >
        <div className="flex items-center border-b border-[var(--border-default)] px-4 py-3.5 md:px-3 md:py-3">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--text-primary)] md:text-sm md:font-semibold">
            Chats
          </h2>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col">
            {loading ? (
              <p className="px-4 py-6 text-sm text-[var(--text-muted)] md:px-3">Loading…</p>
            ) : !sorted.length ? (
              <p className="px-4 py-6 text-sm text-[var(--text-muted)] md:px-3">No conversations yet.</p>
            ) : (
              sorted.map((c) => {
                const label = rowLabel(c);
                const unread = unreadByConversation[c.id] ?? 0;
                const active = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      "flex w-full items-center gap-3 border-b border-[var(--border-default)] px-4 py-3.5 text-left transition-colors md:px-3 md:py-2.5",
                      active
                        ? "bg-[var(--brand-glow)] md:bg-[var(--brand-glow)]"
                        : "hover:bg-[var(--bg-muted)]/80 active:bg-[var(--bg-muted)]",
                    )}
                  >
                    <div
                      className="flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-[var(--text-inverse)] md:size-12 md:text-base"
                      style={{ backgroundColor: "var(--brand-primary)" }}
                    >
                      {avatarLetter(label)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-semibold text-[var(--text-primary)]">{label}</span>
                        <span className="shrink-0 text-xs tabular-nums text-[var(--text-muted)]">
                          {formatChatListTime(c.lastMessageAt)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <span className="truncate text-sm text-[var(--text-muted)]">
                          {c.status === "ARCHIVED"
                            ? "Archived"
                            : c.product
                              ? `Re: ${c.product.name}`
                              : "Tap to open chat"}
                        </span>
                        {unread > 0 ? (
                          <span
                            className="flex min-h-[22px] min-w-[22px] shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold tabular-nums text-white shadow-sm"
                            aria-label={`${unread} unread`}
                          >
                            {unread > 99 ? "99+" : unread}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* Thread — full screen on mobile when selected */}
      <section
        className={cn(
          "flex min-h-0 flex-1 flex-col bg-[var(--bg-base)] md:max-h-[calc(100vh-9rem)] md:rounded-r-[var(--radius-lg)] md:border-0",
          !selectedId && "hidden md:flex",
        )}
      >
        {!selected ? (
          <div className="hidden flex-1 items-center justify-center p-8 text-sm text-[var(--text-muted)] md:flex">
            Select a conversation
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1 border-b border-[var(--border-default)] px-2 py-2 md:px-4 md:py-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden"
                onClick={backToList}
                aria-label="Back to chats"
              >
                <ArrowLeft className="size-5" />
              </Button>
              <div className="min-w-0 flex-1 px-1">
                <p className="truncate font-semibold text-[var(--text-primary)]">{rowLabel(selected)}</p>
                {selected.customer?.email ? (
                  <p className="truncate text-xs text-[var(--text-muted)]">{selected.customer.email}</p>
                ) : null}
                {selected.product ? (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-[var(--brand-glow)] px-2 py-0.5 text-[11px] font-medium text-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]/25">
                      {selected.product.name}
                    </span>
                    {businessSlug ? (
                      <Link
                        href={`/store/${businessSlug}/products/${selected.product.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[var(--brand-primary)] hover:underline"
                      >
                        Open product
                        <ExternalLink className="size-3 shrink-0" aria-hidden />
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </div>
              {selected.status === "OPEN" ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="hidden min-h-10 shrink-0 md:inline-flex"
                    onClick={() => archive.mutate(selected.id)}
                    disabled={archive.isPending}
                  >
                    <Archive className="mr-1 size-4" />
                    Archive
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 md:hidden"
                        aria-label="More"
                      >
                        <MoreVertical className="size-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => archive.mutate(selected.id)}
                        disabled={archive.isPending}
                      >
                        <Archive className="mr-2 size-4" />
                        Archive chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : null}
            </div>

            <ScrollArea className="min-h-0 flex-1 p-4 md:min-h-[min(360px,calc(100vh-14rem))]">
              <div className="space-y-3 pr-2">
                {messagesData?.items.map((m) =>
                  m.senderType === "SYSTEM" ? (
                    <div
                      key={m.id}
                      className="mx-auto max-w-[95%] rounded-[var(--radius-md)] bg-[var(--bg-muted)]/80 px-3 py-2 text-center text-xs leading-relaxed text-[var(--text-muted)] ring-1 ring-[var(--border-default)]"
                    >
                      {m.body}
                    </div>
                  ) : (
                    <div
                      key={m.id}
                      className={cn(
                        "max-w-[90%] rounded-[var(--radius-md)] px-3 py-2 text-sm",
                        m.senderType === "OWNER"
                          ? "ml-auto bg-[var(--brand-primary)] text-[var(--text-inverse)]"
                          : "bg-[var(--bg-muted)] text-[var(--text-primary)]",
                      )}
                    >
                      <p>{m.body}</p>
                      <p className="mt-1 text-[10px] opacity-70">{formatDate(m.createdAt)}</p>
                    </div>
                  ),
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {selected.status === "OPEN" ? (
              <div className="flex gap-2 border-t border-[var(--border-default)] bg-[var(--bg-base)] p-3 pb-safe">
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Message…"
                  className="min-h-11 rounded-full border-[var(--border-default)] bg-[var(--bg-card)] px-4"
                  onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <Button type="button" size="icon" className="size-11 shrink-0 rounded-full" onClick={send}>
                  <Send className="size-4" />
                </Button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
