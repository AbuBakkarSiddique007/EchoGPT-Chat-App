"use client";

import { CapabilityCards } from "@/components/chat/CapabilityCards";
import { Composer } from "@/components/chat/Composer";
import { EmptyChatState } from "@/components/chat/EmptyChatState";
import { MessageList } from "@/components/chat/MessageList";
import { PromptStarters } from "@/components/chat/PromptStarters";
import { useChatStore } from "@/components/providers/ChatProvider";

export function ConversationStage() {
  const { selected, sendMessage, ensureConversation } = useChatStore();
  const hasMessages = (selected?.messages.length ?? 0) > 0;

  const handleSend = (text: string) => {
    const conversationId = selected?.id ?? ensureConversation();
    void sendMessage(conversationId, text, selected?.messages ?? []);
  };

  return (
    <>
      {hasMessages ? (
        <MessageList />
      ) : (
        <div className="app-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          <div className="mx-auto flex w-full max-w-[800px] flex-1 flex-col items-center justify-center gap-5 px-4 py-8 sm:gap-6 sm:px-6 lg:py-10">
            <EmptyChatState />
            <PromptStarters />
          </div>

          <CapabilityCards />
        </div>
      )}

      <div className="shrink-0 border-t border-line bg-surface/30 px-4 pt-3 pb-[max(0.75rem,var(--safe-bottom))] sm:px-6">
        <div className="mx-auto w-full max-w-[800px]">
          <Composer onSend={handleSend} />
        </div>
      </div>
    </>
  );
}
