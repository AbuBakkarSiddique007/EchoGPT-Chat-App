import { ArrowUp, Paperclip, SlidersHorizontal } from "lucide-react";

export function ComposerPlaceholder() {
  return (
    <div className="w-full rounded-2xl border border-brand/45 bg-composer/80 shadow-[0_0_28px_-10px_var(--echo-brand-glow)] backdrop-blur-sm">
      <div className="flex items-end gap-2 p-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2 px-1 py-2">
          <span className="text-[15px] leading-6 text-fg-dim">Message EchoGPT…</span>
        </div>

        <button
          type="button"
          aria-disabled="true"
          title="Send — available once a conversation is connected"
          className="focus-ring grid size-9 shrink-0 cursor-not-allowed place-items-center rounded-full bg-brand text-white opacity-45"
        >
          <ArrowUp className="size-4" aria-hidden="true" />
          <span className="sr-only">Send message</span>
        </button>
      </div>

      <div className="flex items-center gap-1 border-t border-line px-2.5 py-2">
        <button
          type="button"
          aria-disabled="true"
          title="Attachments — coming soon"
          className="focus-ring cursor-not-allowed rounded-md p-1.5 text-fg-2 opacity-60 transition-colors hover:bg-brand/10"
        >
          <Paperclip className="size-4" aria-hidden="true" />
          <span className="sr-only">Attach a file</span>
        </button>
        <button
          type="button"
          aria-disabled="true"
          title="Model options — coming soon"
          className="focus-ring cursor-not-allowed rounded-md p-1.5 text-fg-2 opacity-60 transition-colors hover:bg-brand/10"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          <span className="sr-only">Model options</span>
        </button>
        <span className="ml-auto pr-1 text-[11px] text-fg-dim">Enter to send</span>
      </div>
    </div>
  );
}
