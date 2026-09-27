"use client";

import {
  ArrowUpRight,
  Briefcase,
  Check,
  ChevronDown,
  Clapperboard,
  CreditCard,
  FileText,
  GitCompare,
  ImageIcon,
  LifeBuoy,
  ListTodo,
  Mail,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
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
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { ConversationList } from "@/components/conversations/ConversationList";
import { useChatStore } from "@/components/providers/ChatProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getCollapsedSnapshot,
  getServerCollapsedSnapshot,
  setSidebarCollapsed,
  subscribeCollapsed,
} from "@/lib/sidebar-pref";
import { THEME_OPTIONS } from "@/lib/theme";
import { cn } from "@/lib/utils";

function useSidebarCollapsed(): boolean {
  return useSyncExternalStore(
    subscribeCollapsed,
    getCollapsedSnapshot,
    getServerCollapsedSnapshot,
  );
}

type NavItem = {
  label: string;
  compact?: string;
  icon: LucideIcon;
  badge?: "Pro";
};

const ENGAGEMENT: NavItem[] = [
  { label: "Image Studio", compact: "Images", icon: ImageIcon, badge: "Pro" },
  { label: "Video Studio", compact: "Videos", icon: Clapperboard, badge: "Pro" },
  { label: "Compare", icon: GitCompare },
  { label: "Connectors", icon: Plug },
  { label: "Store", icon: Store },
  { label: "AI Tasks", compact: "Tasks", icon: ListTodo },
  { label: "AI Job Analysis", compact: "Job Analysis", icon: Briefcase },
  { label: "AI SOP Builder", compact: "SOP Builder", icon: FileText },
];

const ENGAGEMENT_PRIMARY_COUNT = 3;

const SUPPORT: NavItem[] = [
  { label: "Support", icon: LifeBuoy },
  { label: "Newsletter", icon: Mail },
  { label: "Subscriptions", icon: CreditCard },
  { label: "API Platform", compact: "API", icon: Terminal },
  { label: "Discord", icon: MessageCircle },
];

function NavLabel({ label, compact }: { label: string; compact?: string }) {
  if (!compact) return <span className="sidebar-label min-w-0 flex-1 truncate">{label}</span>;

  return (
    <span className="sidebar-label min-w-0 flex-1 truncate">
      <span className="sm:hidden">{compact}</span>
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}

function NavRow({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const { label, compact, icon: Icon, badge } = item;
  const status = badge === "Pro" ? "Pro — coming soon" : "coming soon";

  return (
    <button
      type="button"
      aria-disabled="true"
      title={`${label} — ${status}`}
      className={cn(
        "sidebar-icon-row focus-ring group flex w-full cursor-not-allowed items-center gap-2.5 rounded-md py-2 text-left text-sm text-fg-3 transition-colors hover:bg-brand/5",
        collapsed ? "justify-center" : "px-2.5",
      )}
    >
      <span className="relative flex size-4 shrink-0 items-center justify-center">
        <Icon className="size-4" aria-hidden="true" />
        {badge === "Pro" ? (
          <span
            className="sidebar-rail-only absolute -top-1 -right-1 size-1.5 rounded-full bg-brand-text ring-2 ring-sidebar"
            aria-hidden="true"
          />
        ) : null}
      </span>
      <NavLabel label={label} compact={compact} />
      {badge ? (
        <span className="sidebar-collapse-hide shrink-0 rounded-full border border-brand/40 bg-brand/10 px-1.5 py-px text-[10px] font-medium tracking-wide text-brand-text">
          {badge}
        </span>
      ) : (
        <span className="sidebar-collapse-hide shrink-0 text-[10px] tracking-wide text-fg-dim">
          Soon
        </span>
      )}
    </button>
  );
}

function NavGroup({
  title,
  items,
  collapsed,
  primaryCount,
}: {
  title: string;
  items: NavItem[];
  collapsed: boolean;
  primaryCount?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = items.length - (primaryCount ?? items.length);
  const overflowed = hiddenCount > 0;
  const visible = overflowed && !expanded ? items.slice(0, primaryCount) : items;

  return (
    <div className="px-2">
      <h2 className="sidebar-label px-2.5 pb-1.5 pt-3 text-[11px] font-medium uppercase tracking-[0.08em] text-fg-dim">
        {title}
      </h2>
      <div
        className="sidebar-rail-only mx-auto my-2.5 h-px w-5 bg-line"
        aria-hidden="true"
      />
      <ul className="flex flex-col gap-0.5">
        {visible.map((item) => (
          <li key={item.label}>
            <NavRow item={item} collapsed={collapsed} />
          </li>
        ))}
      </ul>
      {overflowed ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="focus-ring sidebar-icon-row mt-0.5 flex w-full cursor-pointer items-center gap-2.5 rounded-md py-1.5 text-left text-[12px] font-medium text-fg-3 transition-colors hover:bg-brand/5 hover:text-fg"
          title={expanded ? `Show fewer ${title} options` : `Show all ${title} options`}
        >
          <ChevronDown
            className={cn(
              "size-3.5 shrink-0 transition-transform duration-200",
              expanded && "rotate-180",
            )}
            aria-hidden="true"
          />
          <span className="sidebar-label min-w-0 flex-1 truncate">
            {expanded ? "Show less" : `More (${hiddenCount})`}
          </span>
          <span className="sr-only">
            {expanded
              ? `Collapse the remaining ${title} options`
              : `Show ${hiddenCount} more ${title} options`}
          </span>
        </button>
      ) : null}
    </div>
  );
}

const USAGE_USED = 18;
const USAGE_LIMIT = 50;
const PRO_PITCH = "38+ frontier models, priority routing, and longer context.";

function UsageSummary() {
  const pct = Math.round((USAGE_USED / USAGE_LIMIT) * 100);

  return (
    <div className="sidebar-collapse-hide mx-2 mb-1.5 flex items-center gap-2 rounded-lg border border-line bg-surface/40 px-2.5 py-2">
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

function ProCard({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        "mx-2 mb-1.5 flex items-center gap-2 rounded-lg border border-brand/30 bg-[linear-gradient(145deg,rgba(118,80,236,0.22),rgba(73,121,251,0.10))] px-2.5 py-2",
        collapsed && "justify-center px-0",
      )}
      title={PRO_PITCH}
    >
      <Crown className="size-3.5 shrink-0 text-brand-text" aria-hidden="true" />
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-text",
          collapsed && "sidebar-label",
        )}
      >
        Unlock Pro
      </span>
      <button
        type="button"
        aria-disabled="true"
        title={`Upgrade — coming soon. ${PRO_PITCH}`}
        className="sidebar-collapse-hide focus-ring flex shrink-0 cursor-not-allowed items-center gap-0.5 rounded-md bg-brand/40 px-2 py-1 text-[11px] font-medium text-fg-2"
      >
        Upgrade
        <ArrowUpRight className="size-3" aria-hidden="true" />
        <span className="sr-only">— coming soon</span>
      </button>
      <span className="sr-only">{PRO_PITCH}</span>
    </div>
  );
}

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  const { preference, resolved, setPreference } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      className={cn(
        "flex items-center gap-1 border-t border-line px-2 py-1.5",
        collapsed && "flex-col gap-1 py-2",
      )}
    >
      <button
        type="button"
        aria-disabled="true"
        title="Sign in — coming soon"
        className={cn(
          "focus-ring flex min-w-0 cursor-not-allowed items-center gap-2 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-brand/5",
          collapsed ? "justify-center" : "flex-1",
        )}
      >
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2"
          aria-hidden="true"
        >
          <UserRound className="size-3 text-fg-2" />
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-[12px] font-medium text-fg",
            collapsed && "sidebar-label",
          )}
        >
          Guest
        </span>
        <span className="sr-only">sign in to sync history — coming soon</span>
      </button>

      <div ref={containerRef} className="relative shrink-0">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-haspopup="menu"
          title="Theme"
          className="focus-ring flex size-7 items-center justify-center rounded-md text-fg-2 transition-colors hover:bg-brand/5"
        >
          <SunMoon className="size-3.5" aria-hidden="true" />
          <span className="sr-only">Theme, currently {resolved}</span>
        </button>

        {open ? (
          <div
            role="menu"
            aria-label="Theme"
            className={cn(
              "absolute z-30 w-40 rounded-lg border border-line bg-surface-elev/95 p-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.8)] backdrop-blur",
              collapsed ? "bottom-0 left-full ml-2" : "right-0 bottom-full mb-1",
            )}
          >
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                role="menuitemradio"
                aria-checked={preference === option.id}
                onClick={() => {
                  setPreference(option.id);
                  setOpen(false);
                }}
                className="focus-ring flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12.5px] text-fg-2 transition-colors hover:bg-brand/10 aria-checked:text-fg aria-checked:font-medium"
              >
                <Check
                  className={cn(
                    "size-3.5 shrink-0 text-brand-text",
                    preference === option.id ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden="true"
                />
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

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

export function SidebarContent({
  className,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: {
  className?: string;
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const { startNewChat } = useChatStore();

  return (
    <nav
      aria-label="EchoGPT sections"
      className={cn("flex min-h-0 min-w-0 flex-col bg-sidebar", className)}
    >
      <div
        className={cn(
          "flex px-4 py-4",
          collapsed ? "flex-col items-center gap-1.5 px-2 py-3" : "items-center gap-2.5",
        )}
      >
        <BrandLogo className="size-8 shrink-0" />
        <div
          className={cn(
            "flex min-w-0 flex-col",
            collapsed && "sidebar-label",
          )}
        >
          <span className="text-[15px] font-semibold leading-tight tracking-tight text-fg">
            EchoGPT
          </span>
          <span className="truncate text-[11px] leading-tight text-fg-3">
            38+ models, one chat
          </span>
        </div>
        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-expanded={!collapsed}
            aria-controls="echo-sidebar-nav"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "focus-ring flex size-7 shrink-0 items-center justify-center rounded-md text-fg-3 transition-colors hover:bg-brand/10 hover:text-fg",
              collapsed ? "mt-0.5" : "ml-auto",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-3.5" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="size-3.5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </button>
        ) : null}
      </div>

      <div className={cn("px-2 pb-1", collapsed && "flex justify-center px-0")}>
        <button
          id="new-chat-button"
          type="button"
          onClick={() => {
            startNewChat();
            onNavigate?.();
          }}
          title="New Chat"
          className={cn(
            "focus-ring flex items-center gap-2 rounded-md bg-brand text-sm font-semibold text-white shadow-[0_0_20px_-4px_var(--echo-brand-glow)] transition-colors hover:bg-brand-hover",
            collapsed ? "size-9 justify-center p-0" : "w-full px-3 py-2.5",
          )}
        >
          <Plus className="size-4 shrink-0" aria-hidden="true" />
          {collapsed ? <span className="sr-only">New Chat</span> : "New Chat"}
        </button>
      </div>

      <ScrollArea className="sidebar-scrollbar min-h-0 flex-1 pb-2">
        <div id="echo-sidebar-nav">
          <NavGroup
            title="Engagement"
            items={ENGAGEMENT}
            collapsed={collapsed}
            primaryCount={ENGAGEMENT_PRIMARY_COUNT}
          />
          <ConversationList onNavigate={onNavigate} />
          <NavGroup title="Help & Support" items={SUPPORT} collapsed={collapsed} />
        </div>
      </ScrollArea>

      <div className="pb-safe">
        <UsageSummary />
        <ProCard collapsed={collapsed} />
        <SidebarFooter collapsed={collapsed} />
      </div>
    </nav>
  );
}

export function DesktopSidebar() {
  const collapsed = useSidebarCollapsed();

  const toggleCollapse = useCallback(() => {
    setSidebarCollapsed(!collapsed);
  }, [collapsed]);

  return (
    <SidebarContent
      className="sidebar-shell hidden w-[280px] shrink-0 border-r border-line lg:flex xl:w-[320px]"
      collapsed={collapsed}
      onToggleCollapse={toggleCollapse}
    />
  );
}
