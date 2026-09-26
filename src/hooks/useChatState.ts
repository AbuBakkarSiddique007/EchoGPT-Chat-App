"use client";

import { useCallback, useState } from "react";

import type { ChatStatus } from "@/types/chat";

export function useChatState() {
  const [statuses, setStatuses] = useState<Record<string, ChatStatus>>({});

  const setStatus = useCallback((conversationId: string, status: ChatStatus) => {
    setStatuses((prev) =>
      prev[conversationId] === status
        ? prev
        : { ...prev, [conversationId]: status },
    );
  }, []);

  const statusFor = useCallback(
    (conversationId: string | null): ChatStatus =>
      (conversationId ? statuses[conversationId] : undefined) ?? "idle",
    [statuses],
  );

  return { statuses, statusFor, setStatus };
}

export type ChatState = ReturnType<typeof useChatState>;
