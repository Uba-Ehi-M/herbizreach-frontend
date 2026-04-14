"use client";

import { ArrowLeft, ExternalLink, Send } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StoreGuestChatService } from "@/services/store-guest-chat.service";
import { getSocket, resetSocket } from "@/lib/socket";
import type { Message } from "@/types/chat.types";
import { cn } from "@/lib/utils";

type ProductSummary = { id: string; name: string } | null;

function startChatErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status === 404) {
      return "That product could not be found on this store.";
    }
    if (status === 403) {
      return "Chat is turned off for this store.";
    }
  }
  return "We couldn’t send your message. Check your connection and try again.";
}

export function StoreGuestChatClient(props: {
  slug: string;
  storeName: string;
  accent: string;
  chatEnabled: boolean;
  product: ProductSummary;
}) {
  const { slug, storeName, accent, chatEnabled, product } = props;
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [opening, setOpening] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async (cid: string, token: string | null) => {
    const res = await StoreGuestChatService.listMessages(cid, {
      page: 1,
      limit: 100,
      guestToken: token ?? undefined,
    });
    setMessages(res.items);
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    const socket = getSocket(undefined);
    socket.auth = {};
    socket.connect();
    socket.emit("join", { conversationId, guestToken: guestToken ?? undefined });
    const onMsg = (msg: Message) => {
      setMessages((m) => [...m, msg]);
    };
    socket.on("message", onMsg);
    return () => {
      socket.off("message", onMsg);
      socket.disconnect();
      resetSocket();
    };
  }, [conversationId, guestToken]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const t = text.trim();
    if (!t || opening) return;

    if (!conversationId) {
      setOpening(true);
      setStartError(null);
      try {
        const res = await StoreGuestChatService.startConversation(slug, {
          productId: product?.id,
        });
        setConversationId(res.conversationId);
        setGuestToken(res.guestToken);
        await StoreGuestChatService.sendMessage(res.conversationId, {
          body: t,
          guestToken: res.guestToken ?? undefined,
        });
        setText("");
        await loadMessages(res.conversationId, res.guestToken);
      } catch (err) {
        setStartError(startChatErrorMessage(err));
      } finally {
        setOpening(false);
      }
      return;
    }

    setText("");
    const socket = getSocket(undefined);
    if (socket.connected) {
      socket.emit("sendMessage", {
        conversationId,
        body: t,
        guestToken: guestToken ?? undefined,
      });
    } else {
      await StoreGuestChatService.sendMessage(conversationId, {
        body: t,
        guestToken: guestToken ?? undefined,
      });
      await loadMessages(conversationId, guestToken);
    }
  }

  const backHref = product ? `/store/${slug}/products/${product.id}` : `/store/${slug}`;

  if (!chatEnabled) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] px-4 py-10">
        <div className="mx-auto max-w-lg rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-6 text-center shadow-sm">
          <p className="text-sm text-[var(--text-secondary)]">
            The seller has turned off in-app chat for this store.
          </p>
          <Button asChild className="mt-6">
            <Link href={`/store/${slug}`}>Back to store</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-base)]">
      <header
        className="border-b border-[var(--border-default)]"
        style={{
          background: `linear-gradient(135deg, ${accent}18 0%, var(--bg-subtle) 45%, var(--bg-base) 100%)`,
        }}
      >
        <div className="mx-auto flex max-w-2xl items-start gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" className="mt-0.5 shrink-0" asChild aria-label="Back">
            <Link href={backHref}>
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--text-primary)]">
              Message {storeName}
            </h1>
            <p className="text-xs text-[var(--text-muted)]">We reply as soon as we can</p>
            {product ? (
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                <span className="font-medium">About: {product.name}</span>
                {" · "}
                <Link
                  href={`/store/${slug}/products/${product.id}`}
                  className="inline-flex items-center gap-0.5 font-medium text-[var(--brand-primary)] hover:underline"
                >
                  View product
                  <ExternalLink className="size-3" aria-hidden />
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-6 pt-4">
        {startError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
            <p className="max-w-sm text-sm text-[var(--text-secondary)]">{startError}</p>
            <Button asChild variant="secondary">
              <Link href={backHref}>Go back</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="min-h-0 flex-1 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-3">
              <div className="space-y-2 pr-2">
                {messages.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm text-[var(--text-muted)]">
                    Say hello to the seller — your message starts the chat.
                  </p>
                ) : null}
                {messages.map((m) => {
                  if (m.senderType === "SYSTEM") {
                    return (
                      <div
                        key={m.id}
                        className="mx-auto max-w-[95%] rounded-[var(--radius-md)] bg-[var(--bg-muted)]/80 px-3 py-2 text-center text-xs leading-relaxed text-[var(--text-muted)] ring-1 ring-[var(--border-default)]"
                      >
                        {m.body}
                      </div>
                    );
                  }
                  const fromBuyer =
                    m.senderType === "GUEST" || m.senderType === "CUSTOMER";
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "max-w-[85%] rounded-[var(--radius-md)] px-3 py-2 text-sm",
                        fromBuyer
                          ? "ml-auto bg-[var(--brand-primary)] text-[var(--text-inverse)]"
                          : "bg-[var(--bg-muted)] text-[var(--text-primary)]",
                      )}
                    >
                      {m.body}
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
            <div className="mt-3 flex gap-2">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message…"
                className="min-h-11"
                disabled={opening}
                onKeyDown={(e) => e.key === "Enter" && !opening && void send()}
              />
              <Button
                type="button"
                size="icon"
                className="shrink-0"
                disabled={opening || !text.trim()}
                onClick={() => void send()}
              >
                {opening ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
