"use client";

import { Copy, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";

import type { Message } from "@/types/chat";

function ActionButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-disabled="true"
      title={`${label} — coming soon`}
      className="focus-ring flex size-6 cursor-not-allowed items-center justify-center rounded text-fg-3 transition-colors hover:bg-brand/10"
    >
      {children}
      <span className="sr-only">{label} — coming soon</span>
    </button>
  );
}

export function MessageActions({ message }: { message: Message }) {
  if (message.role === "user") return null;

  return (
    <span
      role="group"
      aria-label="Response actions"
      className="flex shrink-0 items-center gap-0.5"
    >
      <ActionButton label="Copy response">
        <Copy className="size-3" aria-hidden="true" />
      </ActionButton>
      <ActionButton label="Regenerate response">
        <RefreshCw className="size-3" aria-hidden="true" />
      </ActionButton>
      <ActionButton label="Mark response helpful">
        <ThumbsUp className="size-3" aria-hidden="true" />
      </ActionButton>
      <ActionButton label="Mark response not helpful">
        <ThumbsDown className="size-3" aria-hidden="true" />
      </ActionButton>
    </span>
  );
}
