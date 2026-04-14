"use client";

import { ChatInbox } from "@/components/chat/ChatInbox";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { SectionError } from "@/components/shared/SectionError";
import { useConversations } from "@/hooks/useChat";

export default function ChatPage() {
  const { data, isLoading, isError, refetch } = useConversations();

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (isError) {
    return <SectionError message="Could not load conversations." onRetry={() => void refetch()} />;
  }

  return (
    <div className="flex flex-col md:space-y-4">
      <PageHeader
        className="hidden md:block"
        title="Messages"
        description="Chat with customers in real time."
      />
      <ChatInbox conversations={data ?? []} loading={false} />
    </div>
  );
}
