import { publicApi } from "@/lib/public-api";
import type { MessagesPage, StartConversationResponse } from "@/types/chat.types";

/** Public-store buyer chat (never sends owner JWT). Logged-in customers keep using `ChatService` from the dashboard. */
export const StoreGuestChatService = {
  startConversation: (storeSlug: string, opts?: { productId?: string }) =>
    publicApi
      .post<StartConversationResponse>("/chat/conversations/start", {
        storeSlug,
        ...(opts?.productId ? { productId: opts.productId } : {}),
      })
      .then((r) => r.data),

  listMessages: (
    conversationId: string,
    params: { page?: number; limit?: number; guestToken?: string },
  ) =>
    publicApi
      .get<MessagesPage>(`/chat/conversations/${conversationId}/messages`, {
        params,
      })
      .then((r) => r.data),

  sendMessage: (conversationId: string, body: { body: string; guestToken?: string }) =>
    publicApi
      .post(`/chat/conversations/${conversationId}/messages`, body)
      .then((r) => r.data),
};
