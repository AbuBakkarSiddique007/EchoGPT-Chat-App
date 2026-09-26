"use client";

import { createContext, useContext, type ReactNode } from "react";

import { useChatState, type ChatState } from "@/hooks/useChatState";
import {
  useConversationState,
  type ConversationState,
} from "@/hooks/useConversationState";

type ChatStore = ConversationState & ChatState;

const ChatContext = createContext<ChatStore | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const conversation = useConversationState();
  const chat = useChatState();

  return (
    <ChatContext.Provider value={{ ...conversation, ...chat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatStore(): ChatStore {
  const store = useContext(ChatContext);
  if (!store) {
    throw new Error("useChatStore must be used inside <ChatProvider>.");
  }
  return store;
}
