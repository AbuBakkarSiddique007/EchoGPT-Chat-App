"use client";

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
  Settings,
  Store,
  SunMoon,
  Terminal,
  Crown,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { ConversationList } from "@/components/layout/ConversationList";
import { useChatStore } from "@/components/providers/ChatProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  compact?: string;
  icon: LucideIcon;
  badge?: "Pro";
  active?: boolean;
};

const ENGAGEMENT: NavItem[] = [
  { label: "Image Studio", compact: "Images", icon: ImageIcon, badge: "Pro" },
  { label: "Video Studio", compact: "Videos", icon: Clapperboard, badge: "Pro" },
  { label: "Compare", icon: GitCompare },
  { label: "Connectors", icon: Plug },
  { label: "History", icon: History, active: true },
  { label: "Store", icon: Store },
  { label: "AI Tasks", compact: "Tasks", icon: ListTodo },
  { label: "AI Job Analysis", compact: "Job Analysis", icon: Briefcase },
  { label: "AI SOP Builder", compact: "SOP Builder", icon: FileText },
];

const SUPPORT: NavItem[] = [
  { label: "Support", icon: LifeBuoy },
  { label: "Newsletter", icon: Mail },
  { label: "Subscriptions", icon: CreditCard },
  { label: "API Platform", compact: "API", icon: Terminal },
  { label: "Discord", icon: MessageCircle },
];

function NavLabel({ label, compact }: { label: string; compact?: string }) {
  if (!compact) return <span className="min-w-0 flex-1 truncate">{label}</span>;

  return (
    <span className="min-w-0 flex-1 truncate">
      <span className="sm:hidden">{compact}</span>
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}

function NavRow({ item }: { item: NavItem }) {
  const { label, compact, icon: Icon, badge, active } = item;

  if (!active) {
    return (
      <button
        type="button"
        aria-disabled="true"
        title={`${label} — coming soon`}
        className="focus-ring group flex w-full cursor-not-allowed items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-fg-2 opacity-60 transition-colors"
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <NavLabel label={label} compact={compact} />
        {badge ? (
          <span className="shrink-0 rounded-full border border-brand/40 bg-brand/10 px-1.5 py-px text-[10px] font-medium tracking-wide text-brand-text">
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
      <Icon className="size-4 shrink-0 text-brand-text" aria-hidden="true" />
      <NavLabel label={label} compact={compact} />
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

const USAGE_USED = 18;
const USAGE_LIMIT = 50;
const PRO_PITCH = "38+ frontier models, priority routing, and longer context.";

function UsageSummary() {
  const pct = Math.round((USAGE_USED / USAGE_LIMIT) * 100);

  return (
    <div className="mx-2 mb-1.5 flex items-center gap-2 rounded-lg border border-line bg-surface/40 px-2.5 py-2">
      <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.08em] text-fg-dim">
        Usage
      </span>
      <div
        role="img"
        aria-label={`${USAGE_USED} of ${USAGE_LIMIT} messages used this month`}
        className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-line"
      >
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
      <span className="shrink-0 text-[11px] tabular-nums text-fg-2">
        {USAGE_USED}/{USAGE_LIMIT}
      </span>
    </div>
  );
}

function ProCard() {
  return (
    <div
      className="mx-2 mb-1.5 flex items-center gap-2 rounded-lg border border-brand/30 bg-[linear-gradient(145deg,rgba(118,80,236,0.22),rgba(73,121,251,0.10))] px-2.5 py-2"
      title={PRO_PITCH}
    >
      <Crown className="size-3.5 shrink-0 text-brand-text" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-text">
        Unlock Pro
      </span>
      <button
        type="button"
        aria-disabled="true"
        title={`Upgrade — coming soon. ${PRO_PITCH}`}
        className="focus-ring flex shrink-0 cursor-not-allowed items-center gap-0.5 rounded-md bg-brand/40 px-2 py-1 text-[11px] font-medium text-fg opacity-70"
      >
        Upgrade
        <ArrowUpRight className="size-3" aria-hidden="true" />
        <span className="sr-only">— coming soon</span>
      </button>
      <span className="sr-only">{PRO_PITCH}</span>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="flex items-center gap-1 border-t border-line px-2 py-1.5">
      <button
        type="button"
        aria-disabled="true"
        title="Sign in — coming soon"
        className="focus-ring flex min-w-0 flex-1 cursor-not-allowed items-center gap-2 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-brand/5"
      >
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2"
          aria-hidden="true"
        >
          <UserRound className="size-3 text-fg-2" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-fg">
          Guest
        </span>
        <span className="sr-only">sign in to sync history — coming soon</span>
      </button>

      <button
        type="button"
        aria-disabled="true"
        title="Theme — coming soon"
        className="focus-ring flex size-7 shrink-0 cursor-not-allowed items-center justify-center rounded-md text-fg-2 transition-colors hover:bg-brand/5"
      >
        <SunMoon className="size-3.5" aria-hidden="true" />
        <span className="sr-only">Theme — coming soon</span>
      </button>
      <button
        type="button"
        aria-disabled="true"
        title="Settings — coming soon"
        className="focus-ring flex size-7 shrink-0 cursor-not-allowed items-center justify-center rounded-md text-fg-2 transition-colors hover:bg-brand/5"
      >
        <Settings className="size-3.5" aria-hidden="true" />
        <span className="sr-only">Settings — coming soon</span>
      </button>
    </div>
  );
}

export function SidebarContent({ className }: { className?: string }) {
  const { startNewChat } = useChatStore();

  return (
    <nav
      aria-label="EchoGPT sections"
      className={cn("flex min-h-0 min-w-0 flex-col bg-sidebar", className)}
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
          onClick={startNewChat}
          className="focus-ring flex w-full items-center gap-2 rounded-md bg-brand px-3 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_-4px_var(--echo-brand-glow)] transition-colors hover:bg-brand-hover"
        >
          <Plus className="size-4 shrink-0" aria-hidden="true" />
          New Chat
        </button>
      </div>

      <ScrollArea className="sidebar-scrollbar min-h-0 flex-1 pb-2">
        <NavGroup title="Engagement" items={ENGAGEMENT} />
        <ConversationList />
        <NavGroup title={"Help & Support"} items={SUPPORT} />
      </ScrollArea>

      <div className="pb-safe">
        <UsageSummary />
        <ProCard />
        <SidebarFooter />
      </div>
    </nav>
  );
}

export function DesktopSidebar() {
  return <SidebarContent className="hidden w-[280px] shrink-0 border-r border-line lg:flex xl:w-[320px]" />;
}
