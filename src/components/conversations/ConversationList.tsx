"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SearchX } from "lucide-react";

import { ConversationRow } from "@/components/conversations/ConversationRow";
import { ConversationSearch } from "@/components/conversations/ConversationSearch";
import { useChatStore } from "@/components/providers/ChatProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ConversationList({ onNavigate }: { onNavigate?: () => void }) {
  const {
    conversations,
    visibleGroups,
    visibleIds,
    searchQuery,
    selectedId,
    selectConversation,
    renameConversation,
    deleteConversation,
  } = useChatStore();

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const rowNodes = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef<string | null>(null);

  const registerRow = useCallback((id: string, node: HTMLButtonElement | null) => {
    if (node) rowNodes.current.set(id, node);
    else rowNodes.current.delete(id);
  }, []);

  useEffect(() => {
    const fallbackId = pendingFocus.current;
    if (!fallbackId) return;
    pendingFocus.current = null;

    const row = rowNodes.current.get(fallbackId);
    if (row) {
      row.focus();
      return;
    }
    document.getElementById("new-chat-button")?.focus();
  }, [visibleGroups]);

  const pendingDelete =
    conversations.find((conversation) => conversation.id === pendingDeleteId) ?? null;
  const isSearching = searchQuery.trim().length > 0;

  function confirmDelete() {
    if (!pendingDeleteId) return;

    const index = visibleIds.indexOf(pendingDeleteId);
    pendingFocus.current = visibleIds[index + 1] ?? visibleIds[index - 1] ?? null;
    deleteConversation(pendingDeleteId);
    setPendingDeleteId(null);
  }

  if (visibleGroups.length === 0 && !isSearching) return null;

  return (
    <div className="sidebar-collapse-hide px-2">
      <h2 className="px-2.5 pb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-fg-dim">
        Conversations
      </h2>

      <ConversationSearch />

      {visibleGroups.length === 0 ? (
        <p className="flex flex-col items-center gap-1.5 px-2 py-6 text-center">
          <SearchX className="size-4 text-fg-dim" aria-hidden="true" />
          <span className="text-[13px] text-fg-2">No conversations found</span>
          <span className="text-[11px] text-fg-dim">
            No titles match “{searchQuery.trim()}”
          </span>
        </p>
      ) : (
        <div className="flex flex-col">
          {visibleGroups.map((group) => (
            <section key={group.key} aria-label={`${group.key} conversations`}>
              <h3 className="px-2.5 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.08em] text-fg-3">
                {group.key}
              </h3>
              <ul className="flex flex-col gap-0.5">
                {group.conversations.map((conversation) => (
                  <ConversationRow
                    key={conversation.id}
                    conversation={conversation}
                    selected={conversation.id === selectedId}
                    onSelect={(id) => {
                      selectConversation(id);
                      onNavigate?.();
                    }}
                    onRename={renameConversation}
                    onRequestDelete={setPendingDeleteId}
                    registerRow={registerRow}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null);
        }}
      >
        <DialogContent className="border-line bg-popover">
          <DialogHeader>
            <DialogTitle className="text-fg">Delete this conversation?</DialogTitle>
            <DialogDescription className="text-fg-2">
              “{pendingDelete?.title}” and its messages will be removed from this device. This cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="ghost" className="text-fg-2 hover:bg-brand/10 hover:text-fg" />
              }
            >
              Cancel
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
