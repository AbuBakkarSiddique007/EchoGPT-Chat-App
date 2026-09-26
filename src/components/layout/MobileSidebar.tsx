"use client";

import { Menu } from "lucide-react";

import { SidebarContent } from "@/components/layout/DesktopSidebar";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export function MobileSidebar() {
    return (
        <div className="flex shrink-0 items-center border-b border-line bg-sidebar/80 px-3 py-2.5 lg:hidden">
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

            <span className="ml-2 text-sm font-semibold tracking-tight text-fg">EchoGPT</span>
        </div>
    );
}