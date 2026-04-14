"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSocket, resetSocket } from "@/lib/socket";
import { StoreGuestChatService } from "@/services/store-guest-chat.service";
import type { Message } from "@/types/chat.types";
import { cn } from "@/lib/utils";

export function ChatWidget(props: { storeSlug: string; storeName: string }) {
  const { storeSlug, storeName } = props;
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [opening, setOpening] = useState(false);
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
    if (!open || !conversationId) return;
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
  }, [open, conversationId, guestToken]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function handleOpen() {
    setOpen(true);
    if (conversationId) {
      await loadMessages(conversationId, guestToken);
    }
  }

  async function send() {
    const t = text.trim();
    if (!t || opening) return;

    if (!conversationId) {
      setOpening(true);
      try {
        const res = await StoreGuestChatService.startConversation(storeSlug);
        setConversationId(res.conversationId);
        setGuestToken(res.guestToken);
        await StoreGuestChatService.sendMessage(res.conversationId, {
          body: t,
          guestToken: res.guestToken ?? undefined,
        });
        setText("");
        await loadMessages(res.conversationId, res.guestToken);
      } catch {
        setOpen(false);
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

  return (
    <>
      <Button
        type="button"
        className="fixed bottom-24 right-4 z-50 size-14 rounded-full shadow-[var(--shadow-brand)] md:bottom-8"
        onClick={() => (open ? setOpen(false) : void handleOpen())}
        disabled={opening}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </Button>

      {open ? (
        <div
          className={cn(
            "fixed bottom-40 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] shadow-[var(--shadow-lg)] md:bottom-24",
          )}
        >
          <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Chat with {storeName}</p>
              <p className="text-xs text-[var(--text-muted)]">We reply as soon as we can</p>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="size-4" />
            </Button>
          </div>
          <ScrollArea className="h-72 px-3 py-2">
            <div className="space-y-2 pr-2">
              {messages.length === 0 ? (
                <p className="py-4 text-center text-xs text-[var(--text-muted)]">Send a message to start.</p>
              ) : null}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "max-w-[85%] rounded-[var(--radius-md)] px-3 py-2 text-sm",
                    m.senderType === "GUEST" || m.senderType === "CUSTOMER"
                      ? "ml-auto bg-[var(--brand-primary)] text-[var(--text-inverse)]"
                      : "bg-[var(--bg-muted)] text-[var(--text-primary)]",
                  )}
                >
                  {m.body}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
          <div className="flex gap-2 border-t border-[var(--border-default)] p-2">
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
        </div>
      ) : null}
    </>
  );
}
