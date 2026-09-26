"use client";

import { Search, X } from "lucide-react";

import { useChatStore } from "@/components/providers/ChatProvider";
import { Input } from "@/components/ui/input";

export function ConversationSearch() {
  const { searchQuery, setSearchQuery } = useChatStore();
  const hasQuery = searchQuery.length > 0;

  return (
    <div className="px-2 pb-1">
      <label htmlFor="conversation-search" className="sr-only">
        Search conversations by title
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-fg-dim"
          aria-hidden="true"
        />
        <Input
          id="conversation-search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search conversations"
          className="h-8 border-line bg-surface-2/60 pr-8 pl-8 text-[13px] text-fg placeholder:text-fg-dim [&::-webkit-search-cancel-button]:appearance-none"
        />
        {hasQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Clear conversation search"
            className="focus-ring absolute top-1/2 right-1.5 flex size-5 -translate-y-1/2 items-center justify-center rounded text-fg-dim transition-colors hover:bg-brand/10 hover:text-fg"
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
