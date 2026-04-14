import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatState {
  unreadByConversation: Record<string, number>;
  activeOwnerConversationId: string | null;
  bumpUnreadFor: (conversationId: string) => void;
  clearUnreadFor: (conversationId: string) => void;
  setActiveOwnerConversationId: (id: string | null) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      unreadByConversation: {},
      activeOwnerConversationId: null,
      bumpUnreadFor: (conversationId) =>
        set((s) => {
          if (s.activeOwnerConversationId === conversationId) return s;
          return {
            unreadByConversation: {
              ...s.unreadByConversation,
              [conversationId]: (s.unreadByConversation[conversationId] ?? 0) + 1,
            },
          };
        }),
      clearUnreadFor: (conversationId) =>
        set((s) => {
          const next = { ...s.unreadByConversation };
          delete next[conversationId];
          return { unreadByConversation: next };
        }),
      setActiveOwnerConversationId: (id) => set({ activeOwnerConversationId: id }),
    }),
    {
      name: "herbizreach-owner-chat-unread",
      partialize: (state) => ({ unreadByConversation: state.unreadByConversation }),
    },
  ),
);
