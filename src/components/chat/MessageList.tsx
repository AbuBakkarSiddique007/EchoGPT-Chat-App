"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

import { MessageItem } from "@/components/chat/MessageItem";
import { useChatStore } from "@/components/providers/ChatProvider";

const BOTTOM_THRESHOLD_PX = 32;

export function MessageList() {
  const { selected } = useChatStore();
  const messages = selected?.messages ?? [];
  const conversationId = selected?.id ?? null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [missedCount, setMissedCount] = useState(0);
  const stickToBottom = useRef(true);
  const previousConversation = useRef<string | null>(null);
  const previousCount = useRef(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distance <= BOTTOM_THRESHOLD_PX;
    stickToBottom.current = atBottom;
    setIsAtBottom(atBottom);
    if (atBottom) setMissedCount(0);
  }, []);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (conversationId !== previousConversation.current) {
      previousConversation.current = conversationId;
      previousCount.current = messages.length;
      stickToBottom.current = true;
      el.scrollTop = el.scrollHeight;
      setIsAtBottom(true);
      setMissedCount(0);
      return;
    }

    const added = messages.length - previousCount.current;
    previousCount.current = messages.length;
    if (added <= 0) return;

    if (stickToBottom.current) {
      el.scrollTop = el.scrollHeight;
    } else {
      setMissedCount((count) => count + added);
    }
  }, [conversationId, messages.length]);

  const showJump = missedCount > 0 && !isAtBottom;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="app-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
      >
        <div className="flex flex-col gap-5 py-5 sm:gap-6 sm:py-6">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      </div>

      {showJump ? (
        <button
          type="button"
          onClick={() => {
            stickToBottom.current = true;
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
            setMissedCount(0);
          }}
          className="focus-ring absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-line bg-surface-2/95 px-3 py-1.5 text-[12px] text-fg-2 shadow-[0_0_18px_-6px_var(--echo-brand-glow)] backdrop-blur transition-colors hover:border-brand/40 hover:text-fg"
        >
          <ArrowDown className="size-3.5" aria-hidden="true" />
          Jump to latest
        </button>
      ) : null}
    </div>
  );
}
