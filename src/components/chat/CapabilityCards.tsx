import { Code, Presentation, Wand2, type LucideIcon } from "lucide-react";

type Capability = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

const CAPABILITIES: Capability[] = [
  {
    title: "Image Generator",
    description: "Create and iterate on visuals from a prompt.",
    icon: Wand2,
    accent: "text-aurora-magenta",
  },
  {
    title: "AI Presentation",
    description: "Turn an outline into a structured deck.",
    icon: Presentation,
    accent: "text-azure",
  },
  {
    title: "Dev Assistant",
    description: "Explain errors and review a diff.",
    icon: Code,
    accent: "text-brand-text",
  },
];


export function CapabilityCards() {
  return (
    <section aria-label="More capabilities" className="mx-auto w-full max-w-[800px] px-4 pb-6 sm:px-6 lg:pb-8">
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {CAPABILITIES.map(({ title, description, icon: Icon, accent }) => (
          <li key={title}>
            <button
              type="button"
              aria-disabled="true"
              title={`${title} — coming soon`}
              className="focus-ring flex h-full w-full cursor-not-allowed flex-col gap-1.5 rounded-xl border border-line bg-surface-2/50 p-3.5 text-left transition-colors hover:border-brand/35"
            >
              <span className="flex items-center gap-2">
                <Icon className={`size-4 shrink-0 ${accent}`} aria-hidden="true" />
                <span className="text-sm font-medium text-fg">{title}</span>
                <span className="ml-auto shrink-0 rounded-full border border-line px-1.5 py-px text-[10px] tracking-wide text-fg-dim">
                  Soon
                </span>
              </span>
              <span className="text-xs leading-relaxed text-fg-3">{description}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
