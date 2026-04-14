"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CHAT_CONVERSATIONS_KEY } from "@/hooks/useChat";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import type { Message } from "@/types/chat.types";

/**
 * Owner chat socket: `storeMessage` = buyer messages (even when not in the conv room).
 * `message` = broadcast to joined conv rooms — includes the owner’s own replies, which must
 * invalidate the thread or sent bubbles never show (storeMessage is not emitted for OWNER).
 */
export function useOwnerInboxSocket() {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);
  const bumpUnreadFor = useChatStore((s) => s.bumpUnreadFor);
  const qc = useQueryClient();

  useEffect(() => {
    if (!token || role !== "OWNER") return;

    const socket = getSocket(token);
    socket.connect();

    const onStoreMessage = (msg: Message) => {
      void qc.invalidateQueries({ queryKey: CHAT_CONVERSATIONS_KEY });
      void qc.invalidateQueries({ queryKey: ["chat", "messages", msg.conversationId] });
      if (msg.senderType !== "OWNER" && msg.senderType !== "SYSTEM") {
        bumpUnreadFor(msg.conversationId);
      }
    };

    const onRoomMessage = (msg: Message) => {
      if (!msg?.conversationId) return;
      void qc.invalidateQueries({ queryKey: CHAT_CONVERSATIONS_KEY });
      void qc.invalidateQueries({ queryKey: ["chat", "messages", msg.conversationId] });
    };

    socket.on("storeMessage", onStoreMessage);
    socket.on("message", onRoomMessage);

    return () => {
      socket.off("storeMessage", onStoreMessage);
      socket.off("message", onRoomMessage);
    };
  }, [token, role, bumpUnreadFor, qc]);
}
