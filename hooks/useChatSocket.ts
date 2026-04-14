"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/stores/useAuthStore";

/** Join the active conversation room for real-time `message` events while viewing a thread. */
export function useOwnerActiveConversationJoin(activeConversationId: string | null) {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);

  useEffect(() => {
    if (!token || role !== "OWNER" || !activeConversationId) return;

    const socket = getSocket(token);
    const join = () => {
      socket.emit("join", { conversationId: activeConversationId });
    };

    if (!socket.connected) {
      socket.connect();
      socket.once("connect", join);
      return () => {
        socket.off("connect", join);
      };
    }

    join();
    return undefined;
  }, [token, role, activeConversationId]);
}
