import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="app-atmosphere relative flex h-dvh max-h-dvh w-full flex-col overflow-hidden">
      <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative flex min-h-0 flex-1 overflow-hidden p-0">
        <div
          className={cn(
            "flex min-h-0 w-full flex-col overflow-hidden border border-line bg-surface/85 backdrop-blur-xl",
            "sm:rounded-2xl",
            "lg:rounded-[28px] lg:shadow-[var(--shadow-lg)]",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
