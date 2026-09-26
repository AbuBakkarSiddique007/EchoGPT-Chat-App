"use client";

import { useCallback, useMemo, useReducer } from "react";

import { DEMO_CONVERSATIONS } from "@/data/demo-conversations";
import { groupConversations } from "@/lib/conversation-groups";
import type { Conversation, ConversationGroup, DraftMap } from "@/types/chat";

type State = {
  conversations: Conversation[];
  selectedId: string | null;
  drafts: DraftMap;
};

type Action =
  | { type: "create"; conversation: Conversation }
  | { type: "select"; id: string | null }
  | { type: "setDraft"; id: string; text: string };

let newChatCounter = 0;

function createConversation(): Conversation {
  newChatCounter += 1;
  const now = new Date().toISOString();

  return {
    id: `conv-new-${now}-${newChatCounter}`,
    title: "New chat",
    updatedAt: now,
    messages: [],
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "create": {
      return {
        conversations: [action.conversation, ...state.conversations],
        selectedId: action.conversation.id,
        drafts: { ...state.drafts, [action.conversation.id]: "" },
      };
    }
    case "select":
      return { ...state, selectedId: action.id };
    case "setDraft": {
      if (state.drafts[action.id] === action.text) return state;
      return { ...state, drafts: { ...state.drafts, [action.id]: action.text } };
    }
  }
}

const INITIAL_STATE: State = {
  conversations: DEMO_CONVERSATIONS,
  selectedId: DEMO_CONVERSATIONS[0]?.id ?? null,
  drafts: {},
};

export function useConversationState() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const groups: ConversationGroup[] = useMemo(
    () => groupConversations(state.conversations),
    [state.conversations],
  );

  const selected = useMemo(
    () => state.conversations.find((c) => c.id === state.selectedId) ?? null,
    [state.conversations, state.selectedId],
  );

  const selectConversation = useCallback((id: string | null) => {
    dispatch({ type: "select", id });
  }, []);

  const startNewChat = useCallback(() => {
    dispatch({ type: "create", conversation: createConversation() });
  }, []);

  const setDraft = useCallback((id: string, text: string) => {
    dispatch({ type: "setDraft", id, text });
  }, []);

  const draft = state.selectedId ? (state.drafts[state.selectedId] ?? "") : "";

  return {
    conversations: state.conversations,
    groups,
    selectedId: state.selectedId,
    selected,
    draft,
    selectConversation,
    startNewChat,
    setDraft,
  };
}

export type ConversationState = ReturnType<typeof useConversationState>;
