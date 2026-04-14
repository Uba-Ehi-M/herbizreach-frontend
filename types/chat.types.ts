import type { UserRole } from "./auth.types";

export interface ChatUserPreview {
  id: string;
  fullName: string;
  email?: string;
  avatarUrl: string | null;
  businessName?: string;
  businessSlug?: string;
}

export type ConversationStatus = "OPEN" | "ARCHIVED";

/** When the buyer started chat from a product page. */
export interface ConversationProductSnippet {
  id: string;
  name: string;
}

export interface Conversation {
  id: string;
  storeUserId: string;
  customerUserId: string | null;
  guestToken: string | null;
  status: ConversationStatus;
  lastMessageAt: string | null;
  createdAt: string;
  customer?: ChatUserPreview | null;
  storeOwner?: ChatUserPreview | null;
  product?: ConversationProductSnippet | null;
}

export type MessageSenderType = "OWNER" | "CUSTOMER" | "GUEST" | "SYSTEM";

export interface Message {
  id: string;
  conversationId: string;
  senderType: MessageSenderType;
  senderUserId: string | null;
  body: string;
  readAt: string | null;
  createdAt: string;
  sender: ChatUserPreview & { role?: UserRole } | null;
}

export interface MessagesPage {
  items: Message[];
  total: number;
  page: number;
  limit: number;
}

export interface StartConversationResponse {
  conversationId: string;
  guestToken: string | null;
  storeUserId: string;
}
