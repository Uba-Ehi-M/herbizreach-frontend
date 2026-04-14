import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChatService } from "@/services/chat.service";

export const CHAT_CONVERSATIONS_KEY = ["chat", "conversations"] as const;

export function useConversations() {
  return useQuery({
    queryKey: CHAT_CONVERSATIONS_KEY,
    queryFn: ChatService.listConversations,
  });
}

export function useConversationMessages(
  conversationId: string | null,
  guestToken?: string | null,
) {
  return useQuery({
    queryKey: ["chat", "messages", conversationId, guestToken ?? ""],
    queryFn: () =>
      ChatService.listMessages(conversationId!, {
        page: 1,
        limit: 100,
        guestToken: guestToken ?? undefined,
      }),
    enabled: !!conversationId,
  });
}

export function useSendChatMessage(conversationId: string, guestToken?: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) =>
      ChatService.sendMessage(conversationId, {
        body,
        guestToken: guestToken ?? undefined,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["chat", "messages", conversationId, guestToken ?? ""],
      });
      void qc.invalidateQueries({ queryKey: CHAT_CONVERSATIONS_KEY });
    },
    onError: () => toast.error("Message could not be sent."),
  });
}

export function useArchiveConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ChatService.archive,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: CHAT_CONVERSATIONS_KEY });
      toast.success("Conversation archived.");
    },
    onError: () => toast.error("Could not archive."),
  });
}

export function useStartConversation() {
  return useMutation({
    mutationFn: (vars: { storeSlug: string; productId?: string }) =>
      ChatService.startConversation(vars.storeSlug, {
        productId: vars.productId,
      }),
  });
}
