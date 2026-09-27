"use client";

import { useEffect, useRef, useState } from "react";
import { Check, MessageSquare, X } from "lucide-react";

import { ConversationMenu } from "@/components/conversations/ConversationMenu";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/chat";

type Props = {
  conversation: Conversation;
  selected: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onRequestDelete: (id: string) => void;
  registerRow: (id: string, node: HTMLButtonElement | null) => void;
};

export function ConversationRow({
  conversation,
  selected,
  onSelect,
  onRename,
  onRequestDelete,
  registerRow,
}: Props) {
  const { id, title, messages } = conversation;
  const [renaming, setRenaming] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    if (renaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
      return;
    }

    if (restoreFocus.current) {
      restoreFocus.current = false;
      selectRef.current?.focus();
    }
  }, [renaming]);

  function beginRename() {
    setDraftTitle(title);
    setRenaming(true);
  }

  function cancelRename() {
    setDraftTitle(title);
    restoreFocus.current = true;
    setRenaming(false);
  }

  function commitRename() {
    const next = draftTitle.trim();
    if (next && next !== title) onRename(id, next);
    restoreFocus.current = true;
    setRenaming(false);
  }

  return (
    <li className="group/row relative" data-conversation-id={id}>
      {renaming ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            commitRename();
          }}
          className="flex items-center gap-1 px-1 py-1"
        >
          <input
            ref={inputRef}
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                cancelRename();
              }
            }}
            aria-label={`Rename ${title}`}
            className="focus-ring h-7 min-w-0 flex-1 rounded border border-brand/40 bg-surface-2 px-2 text-[13px] text-fg outline-none"
          />
          <button
            type="submit"
            aria-label={`Save name for ${title}`}
            className="focus-ring flex size-6 shrink-0 items-center justify-center rounded text-brand-text transition-colors hover:bg-brand/15"
          >
            <Check className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={cancelRename}
            aria-label={`Cancel renaming ${title}`}
            className="focus-ring flex size-6 shrink-0 items-center justify-center rounded text-fg-dim transition-colors hover:bg-brand/10 hover:text-fg"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </form>
      ) : (
        <>
          <button
            ref={(node) => {
              selectRef.current = node;
              registerRow(id, node);
            }}
            type="button"
            onClick={() => onSelect(id)}
            aria-current={selected ? "page" : undefined}
            title={title}
            className={cn(
              "focus-ring flex w-full items-center gap-2.5 rounded-md py-2 pr-8 pl-2.5 text-left text-sm transition-colors",
              selected
                ? "bg-brand/15 font-medium text-fg ring-1 ring-inset ring-brand/35"
                : "text-fg-2 hover:bg-brand/5 hover:text-fg",
            )}
          >
            <MessageSquare
              className={cn("size-4 shrink-0", selected ? "text-brand-text" : "text-fg-3")}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate">{title}</span>
            {messages.length === 0 ? (
              <span className="shrink-0 text-[10px] tracking-wide text-fg-dim">Empty</span>
            ) : (
              <span className="shrink-0 text-[10px] tabular-nums text-fg-dim">
                {messages.length}
              </span>
            )}
            {selected ? <span className="sr-only">(current conversation)</span> : null}
          </button>

          <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center opacity-0 transition-opacity group-focus-within/row:opacity-100 group-hover/row:opacity-100">
            <ConversationMenu
              title={title}
              onRename={beginRename}
              onRequestDelete={() => onRequestDelete(id)}
            />
          </div>
        </>
      )}
    </li>
  );
}
