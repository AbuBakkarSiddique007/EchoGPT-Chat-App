"use client";

import { useCallback, useRef, useState } from "react";

import { createLocalTransport, type ChatTransport } from "@/lib/chat-adapter";
import type { ChatStatus, Message } from "@/types/chat";

type ConversationActions = {
  appendMessage: (conversationId: string, message: Message) => void;
  clearDraft: (conversationId: string) => void;
};

let messageCounter = 0;

function nextMessageId(role: Message["role"]): string {
  messageCounter += 1;
  return `msg-${role}-${Date.now()}-${messageCounter}`;
}

export function useChatState({
  appendMessage,
  clearDraft,
}: ConversationActions) {
  const [statuses, setStatuses] = useState<Record<string, ChatStatus>>({});
  const [transport] = useState<ChatTransport>(() => createLocalTransport());
  const inFlight = useRef<Set<string>>(new Set());

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

  const sendMessage = useCallback(
    async (conversationId: string | null, text: string, history: Message[]) => {
      if (!conversationId) return;

      const prompt = text.trim();
      if (!prompt) return;
      if (inFlight.current.has(conversationId)) return;

      inFlight.current.add(conversationId);
      setStatus(conversationId, "sending");

      const now = new Date().toISOString();
      const userMessage: Message = {
        id: nextMessageId("user"),
        role: "user",
        content: prompt,
        createdAt: now,
        status: "complete",
      };

      appendMessage(conversationId, userMessage);
      clearDraft(conversationId);

      try {
        const completion = await transport.send({
          conversationId,
          history: [...history, userMessage],
        });

        appendMessage(conversationId, {
          id: nextMessageId("assistant"),
          role: "assistant",
          content: completion.content,
          createdAt: new Date().toISOString(),
          status: "complete",
          model: completion.model,
        });

        setStatus(conversationId, "idle");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setStatus(conversationId, "idle");
          return;
        }

        setStatus(conversationId, "error");
      } finally {
        inFlight.current.delete(conversationId);
      }
    },
    [appendMessage, clearDraft, setStatus, transport],
  );

  return { statuses, statusFor, setStatus, sendMessage };
}

export type ChatState = ReturnType<typeof useChatState>;
