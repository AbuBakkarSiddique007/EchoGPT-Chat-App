"use client";

import { useCallback, useMemo, useReducer, useState } from "react";

import { DEMO_CONVERSATIONS } from "@/data/demo-conversations";
import { groupConversations } from "@/lib/conversation-groups";
import type { Conversation, ConversationGroup, DraftMap, Message } from "@/types/chat";

const UNTITLED = "New chat";

function titleFromPrompt(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= 48) return flat;
  return `${flat.slice(0, 48).trimEnd()}…`;
}

type State = {
  conversations: Conversation[];
  selectedId: string | null;
  drafts: DraftMap;
};

type Action =
  | { type: "create"; conversation: Conversation; draft?: string }
  | { type: "select"; id: string | null }
  | { type: "setDraft"; id: string; text: string }
  | { type: "clearDraft"; id: string }
  | { type: "append"; id: string; message: Message }
  | { type: "rename"; id: string; title: string }
  | { type: "delete"; id: string; fallbackId: string | null };

let newChatCounter = 0;

function createConversation(): Conversation {
  newChatCounter += 1;
  const now = new Date().toISOString();

  return {
    id: `conv-new-${now}-${newChatCounter}`,
    title: UNTITLED,
    updatedAt: now,
    messages: [],
  };
}

function withoutKey<T>(source: Record<string, T>, key: string): Record<string, T> {
  if (!(key in source)) return source;
  const next = { ...source };
  delete next[key];
  return next;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "create": {
      return {
        conversations: [action.conversation, ...state.conversations],
        selectedId: action.conversation.id,
        drafts: { ...state.drafts, [action.conversation.id]: action.draft ?? "" },
      };
    }
    case "select":
      return { ...state, selectedId: action.id };
    case "setDraft": {
      if (state.drafts[action.id] === action.text) return state;
      return { ...state, drafts: { ...state.drafts, [action.id]: action.text } };
    }
    case "clearDraft": {
      if (!state.drafts[action.id]) return state;
      return { ...state, drafts: { ...state.drafts, [action.id]: "" } };
    }
    case "append": {
      let changed = false;

      const conversations = state.conversations.map((conversation) => {
        if (conversation.id !== action.id) return conversation;
        changed = true;
        return {
          ...conversation,
          title:
            conversation.title === UNTITLED && action.message.role === "user"
              ? titleFromPrompt(action.message.content)
              : conversation.title,
          updatedAt: action.message.createdAt,
          messages: [...conversation.messages, action.message],
        };
      });

      if (!changed) return state;
      return { ...state, conversations };
    }
    case "rename":
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === action.id
            ? { ...conversation, title: action.title }
            : conversation,
        ),
      };
    case "delete": {
      const removingSelected = state.selectedId === action.id;
      return {
        conversations: state.conversations.filter(
          (conversation) => conversation.id !== action.id,
        ),
        selectedId: removingSelected ? action.fallbackId : state.selectedId,
        drafts: withoutKey(state.drafts, action.id),
      };
    }
  }
}

const INITIAL_SELECTED_ID = "conv-pricing-brief";

const INITIAL_STATE: State = {
  conversations: DEMO_CONVERSATIONS,
  selectedId: INITIAL_SELECTED_ID,
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

  const [searchQuery, setSearchQuery] = useState("");

  const visibleGroups: ConversationGroup[] = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return groups;

    return groups.flatMap((group) => {
      const matches = group.conversations.filter((conversation) =>
        conversation.title.toLowerCase().includes(query),
      );
      return matches.length > 0 ? [{ key: group.key, conversations: matches }] : [];
    });
  }, [groups, searchQuery]);

  const visibleIds = useMemo(
    () => visibleGroups.flatMap((group) => group.conversations.map((c) => c.id)),
    [visibleGroups],
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

  const clearDraft = useCallback((id: string) => {
    dispatch({ type: "clearDraft", id });
  }, []);

  const appendMessage = useCallback((id: string, message: Message) => {
    dispatch({ type: "append", id, message });
  }, []);

  const fillDraft = useCallback(
    (text: string) => {
      if (state.selectedId) {
        dispatch({ type: "setDraft", id: state.selectedId, text });
        return;
      }
      dispatch({ type: "create", conversation: createConversation(), draft: text });
    },
    [state.selectedId],
  );

  const renameConversation = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    dispatch({ type: "rename", id, title: trimmed });
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      const index = visibleIds.indexOf(id);
      const fallbackId = visibleIds[index + 1] ?? visibleIds[index - 1] ?? null;
      dispatch({ type: "delete", id, fallbackId });
    },
    [visibleIds],
  );

  const draft = state.selectedId ? (state.drafts[state.selectedId] ?? "") : "";

  return {
    conversations: state.conversations,
    groups,
    visibleGroups,
    visibleIds,
    searchQuery,
    selectedId: state.selectedId,
    selected,
    draft,
    setSearchQuery,
    selectConversation,
    startNewChat,
    setDraft,
    clearDraft,
    appendMessage,
    fillDraft,
    renameConversation,
    deleteConversation,
  };
}

export type ConversationState = ReturnType<typeof useConversationState>;
