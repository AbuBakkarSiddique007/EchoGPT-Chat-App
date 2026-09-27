"use client";

import { Download, Settings } from "lucide-react";

import { useChatStore } from "@/components/providers/ChatProvider";

export function ChatTopbar() {
  const { selected } = useChatStore();

  return (
    <header className="flex shrink-0 items-center gap-2 border-b border-line px-3 py-2.5 sm:px-4">
      <span className="hidden shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] tracking-wide text-fg-dim md:inline">
        Static preview
      </span>

      <h1 className="min-w-0 flex-1 truncate px-1 text-center text-[13px] font-medium text-fg-2">
        {selected?.title ?? "New chat"}
      </h1>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-disabled="true"
          title="Configuration — coming soon"
          className="focus-ring cursor-not-allowed rounded-md p-2 text-fg-3 transition-colors hover:bg-brand/10"
        >
          <Settings className="size-4" aria-hidden="true" />
          <span className="sr-only">Configuration</span>
        </button>
        <button
          type="button"
          aria-disabled="true"
          title="Export — coming soon"
          className="focus-ring cursor-not-allowed rounded-md p-2 text-fg-3 transition-colors hover:bg-brand/10"
        >
          <Download className="size-4" aria-hidden="true" />
          <span className="sr-only">Export conversation</span>
        </button>
      </div>
    </header>
  );
}
