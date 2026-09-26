import { Code, Compass, Lightbulb, PenLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Starter = {
  label: string;
  icon: LucideIcon;
};

const STARTERS: Starter[] = [
  { label: "Explain a tricky concept", icon: Lightbulb },
  { label: "Draft a product brief", icon: PenLine },
  { label: "Compare the top models", icon: Compass },
  { label: "Debug this stack trace", icon: Code },
];

export function PromptStarters() {
  return (
    <ul className="-mx-4 flex w-full max-w-full gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
      {STARTERS.map(({ label, icon: Icon }) => (
        <li key={label} className="shrink-0">
          <button
            type="button"
            aria-disabled="true"
            title={`${label} — coming soon`}
            className="focus-ring flex cursor-not-allowed items-center gap-1.5 rounded-md border border-line bg-surface-2/60 px-3 py-1.5 text-[13px] text-fg-2 opacity-70 transition-colors sm:hover:border-brand/40"
          >
            <Icon className="size-3.5 shrink-0 text-fg-3" aria-hidden="true" />
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
}
