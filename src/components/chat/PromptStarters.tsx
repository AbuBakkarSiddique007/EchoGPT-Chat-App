"use client";

import { Code, Compass, Lightbulb, PenLine, type LucideIcon } from "lucide-react";

import { useChatStore } from "@/components/providers/ChatProvider";

type Starter = {
  label: string;
  prompt: string;
  icon: LucideIcon;
};

const STARTERS: Starter[] = [
  {
    label: "Explain a tricky concept",
    prompt: "Explain how retrieval-augmented generation works, and when it fails.",
    icon: Lightbulb,
  },
  {
    label: "Draft a product brief",
    prompt: "Draft a one-page product brief for an AI meeting-notes app.",
    icon: PenLine,
  },
  {
    label: "Compare the top models",
    prompt: "Compare leading models on reasoning quality, context length, and cost.",
    icon: Compass,
  },
  {
    label: "Debug this stack trace",
    prompt: "Help me debug this stack trace and suggest the smallest safe fix.",
    icon: Code,
  },
];

export function PromptStarters() {
  const { fillDraft } = useChatStore();

  return (
    <ul
      aria-label="Prompt starters"
      className="-mx-4 flex w-full max-w-full snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:snap-none sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
    >
      {STARTERS.map(({ label, prompt, icon: Icon }) => (
        <li key={label} className="shrink-0 snap-start">
          <button
            type="button"
            onClick={() => fillDraft(prompt)}
            title={prompt}
            className="focus-ring flex items-center gap-1.5 rounded-full border border-line bg-surface-2/60 px-3 py-1.5 text-[13px] text-fg-2 transition-colors hover:border-brand/40 hover:bg-brand/10 hover:text-fg"
          >
            <Icon className="size-3.5 shrink-0 text-fg-3" aria-hidden="true" />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
