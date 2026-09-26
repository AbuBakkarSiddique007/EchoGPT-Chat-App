"use client";

import { Menu, Plus } from "lucide-react";

import { SidebarContent } from "@/components/layout/DesktopSidebar";
import { useChatStore } from "@/components/providers/ChatProvider";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export function MobileSidebar() {
    const { startNewChat } = useChatStore();

    return (
        <div className="flex shrink-0 items-center gap-1 border-b border-line bg-sidebar/80 px-2 pt-safe pb-2 lg:hidden">
            <Sheet>
                <SheetTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Open EchoGPT navigation"
                            className="text-fg-2 hover:bg-brand/10 hover:text-fg"
                        />
                    }
                >
                    <Menu className="size-5" aria-hidden="true" />
                </SheetTrigger>
                <SheetContent
                    side="left"
                    showCloseButton
                    className="w-[min(88vw,320px)] gap-0 border-line bg-sidebar p-0 text-fg"
                >
                    <SheetTitle className="sr-only">EchoGPT navigation</SheetTitle>
                    <SheetDescription className="sr-only">
                        Navigate EchoGPT sections and conversation tools.
                    </SheetDescription>
                    <SidebarContent className="flex-1" />
                </SheetContent>
            </Sheet>

            <span className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight text-fg">
                EchoGPT
            </span>

            <Button
                variant="ghost"
                size="icon"
                onClick={startNewChat}
                aria-label="New chat"
                className="text-fg-2 hover:bg-brand/10 hover:text-fg"
            >
                <Plus className="size-5" aria-hidden="true" />
            </Button>
        </div>
    );
}