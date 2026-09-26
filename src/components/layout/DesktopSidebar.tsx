import {
  ArrowUpRight,
  Briefcase,
  Clapperboard,
  CreditCard,
  FileText,
  GitCompare,
  History,
  ImageIcon,
  LifeBuoy,
  ListTodo,
  Mail,
  MessageCircle,
  Plus,
  Plug,
  Store,
  Terminal,
  Crown,
  type LucideIcon,
} from "lucide-react";

import { BrandLogo } from "@/components/brand/BrandLogo";

type NavItem = {
  label: string;
  icon: LucideIcon;
  badge?: "Pro";
  active?: boolean;
};

const ENGAGEMENT: NavItem[] = [
  { label: "Image Studio", icon: ImageIcon, badge: "Pro" },
  { label: "Video Studio", icon: Clapperboard, badge: "Pro" },
  { label: "Compare", icon: GitCompare },
  { label: "Connectors", icon: Plug },
  { label: "History", icon: History, active: true },
  { label: "Store", icon: Store },
  { label: "AI Tasks", icon: ListTodo },
  { label: "AI Job Analysis", icon: Briefcase },
  { label: "AI SOP Builder", icon: FileText },
];

const SUPPORT: NavItem[] = [
  { label: "Support", icon: LifeBuoy },
  { label: "Newsletter", icon: Mail },
  { label: "Subscriptions", icon: CreditCard },
  { label: "API Platform", icon: Terminal },
  { label: "Discord", icon: MessageCircle },
];

function NavRow({ item }: { item: NavItem }) {
  const { label, icon: Icon, badge, active } = item;


  if (!active) {
    return (
      <button
        type="button"
        aria-disabled="true"
        title={`${label} — coming soon`}
        className="focus-ring group flex w-full cursor-not-allowed items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-fg-2 opacity-60 transition-colors"
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {badge ? (
          <span className="shrink-0 rounded-full border border-brand/40 bg-brand/10 px-1.5 py-px text-[10px] font-medium tracking-wide text-accent">
            {badge}
          </span>
        ) : (
          <span className="shrink-0 text-[10px] tracking-wide text-fg-dim">Soon</span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-current="page"
      className="focus-ring flex w-full items-center gap-2.5 rounded-md bg-brand/15 px-2.5 py-2 text-left text-sm font-medium text-fg ring-1 ring-inset ring-brand/35 transition-colors hover:bg-brand/20"
    >
      <Icon className="size-4 shrink-0 text-accent" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="sr-only">(current workspace)</span>
    </button>
  );
}

function NavGroup({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div className="px-2">
      <h2 className="px-2.5 pb-1.5 pt-3 text-[11px] font-medium uppercase tracking-[0.08em] text-fg-dim">
        {title}
      </h2>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item.label}>
            <NavRow item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProCard() {
  return (
    <div className="mx-2 mb-2 rounded-xl border border-brand/30 bg-[linear-gradient(145deg,rgba(118,80,236,0.22),rgba(73,121,251,0.10))] p-3">
      <div className="flex items-center gap-1.5 text-accent">
        <Crown className="size-3.5" aria-hidden="true" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em]">Unlock Pro</span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-fg-2">
        38+ frontier models, priority routing, and longer context.
      </p>
      <button
        type="button"
        aria-disabled="true"
        className="focus-ring mt-2.5 flex w-full cursor-not-allowed items-center justify-center gap-1 rounded-md bg-brand/40 py-1.5 text-xs font-medium text-fg opacity-70"
      >
        Upgrade
        <ArrowUpRight className="size-3" aria-hidden="true" />
        <span className="sr-only">— coming soon</span>
      </button>
    </div>
  );
}


export function DesktopSidebar() {
  return (
    <nav
      aria-label="EchoGPT sections"
      className="hidden min-h-0 w-[280px] shrink-0 flex-col border-r border-line bg-sidebar lg:flex xl:w-[320px]"
    >
      <div className="flex items-center gap-2.5 px-4 py-4">
        <BrandLogo className="size-8" />
        <div className="flex min-w-0 flex-col">
          <span className="text-[15px] font-semibold leading-tight tracking-tight text-fg">
            EchoGPT
          </span>
          <span className="truncate text-[11px] leading-tight text-fg-3">38+ models, one chat</span>
        </div>
      </div>

      <div className="px-2 pb-1">
        <button
          type="button"
          className="focus-ring flex w-full items-center gap-2 rounded-md bg-brand px-3 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_-4px_var(--echo-brand-glow)] transition-colors hover:bg-brand-hover"
        >
          <Plus className="size-4 shrink-0" aria-hidden="true" />
          New Chat
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        <NavGroup title="Engagement" items={ENGAGEMENT} />
        <NavGroup title={"Help & Support"} items={SUPPORT} />
      </div>

      <ProCard />
    </nav>
  );
}
