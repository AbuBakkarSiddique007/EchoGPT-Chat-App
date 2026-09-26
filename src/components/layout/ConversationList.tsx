"use client";

import { MessageSquare } from "lucide-react";

import { useChatStore } from "@/components/providers/ChatProvider";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/chat";

function ConversationRow({
  conversation,
  selected,
  onSelect,
}: {
  conversation: Conversation;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const { title, messages } = conversation;
  const count = messages.length;

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      aria-current={selected ? "true" : undefined}
      title={title}
      className={cn(
        "focus-ring flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
        selected
          ? "bg-brand/15 font-medium text-fg ring-1 ring-inset ring-brand/35 hover:bg-brand/20"
          : "text-fg-2 hover:bg-brand/5 hover:text-fg",
      )}
    >
      <MessageSquare
        className={cn("size-4 shrink-0", selected ? "text-brand-text" : "text-fg-3")}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate">{title}</span>
      {count === 0 ? (
        <span className="shrink-0 text-[10px] tracking-wide text-fg-dim">Empty</span>
      ) : (
        <span className="shrink-0 text-[10px] tabular-nums text-fg-dim">{count}</span>
      )}
    </button>
  );
}

export function ConversationList() {
  const { groups, selectedId, selectConversation } = useChatStore();

  if (groups.length === 0) return null;

  return (
    <div className="px-2">
      <h2 className="px-2.5 pb-1.5 pt-3 text-[11px] font-medium uppercase tracking-[0.08em] text-fg-dim">
        Conversations
      </h2>
      <div className="flex flex-col">
        {groups.map((group) => (
          <section key={group.key} aria-label={`${group.key} conversations`}>
            <h3 className="px-2.5 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.08em] text-fg-3">
              {group.key}
            </h3>
            <ul className="flex flex-col gap-0.5">
              {group.conversations.map((conversation) => (
                <li key={conversation.id}>
                  <ConversationRow
                    conversation={conversation}
                    selected={conversation.id === selectedId}
                    onSelect={selectConversation}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
