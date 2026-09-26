import { ChevronDown, Download, Settings } from "lucide-react";


export function ChatTopbar() {
  return (
    <header className="flex shrink-0 items-center gap-2 border-b border-line px-3 py-2.5 sm:px-4">
      <button
        type="button"
        aria-disabled="true"
        title="Model selection — coming soon"
        className="focus-ring flex min-w-0 cursor-not-allowed items-center gap-1.5 rounded-md border border-line bg-surface-2/70 py-1.5 pl-2.5 pr-2 text-sm text-fg opacity-70 transition-colors"
      >
        <span className="truncate font-medium">GPT-5.6 Sol</span>
        <ChevronDown className="size-3.5 shrink-0 text-fg-3" aria-hidden="true" />
        <span className="hidden text-[10px] tracking-wide text-fg-dim sm:inline">Soon</span>
      </button>

      <span className="hidden shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] tracking-wide text-fg-dim md:inline">
        Static preview
      </span>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-disabled="true"
          title="Configuration — coming soon"
          className="focus-ring cursor-not-allowed rounded-md p-2 text-fg-2 opacity-60 transition-colors hover:bg-brand/10"
        >
          <Settings className="size-4" aria-hidden="true" />
          <span className="sr-only">Configuration</span>
        </button>
        <button
          type="button"
          aria-disabled="true"
          title="Export — coming soon"
          className="focus-ring cursor-not-allowed rounded-md p-2 text-fg-2 opacity-60 transition-colors hover:bg-brand/10"
        >
          <Download className="size-4" aria-hidden="true" />
          <span className="sr-only">Export conversation</span>
        </button>
      </div>
    </header>
  );
}
