import { AppFrame } from "@/components/layout/AppFrame";
import { ChatTopbar } from "@/components/layout/ChatTopbar";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { CapabilityCards } from "@/components/chat/CapabilityCards";
import { ComposerPlaceholder } from "@/components/chat/ComposerPlaceholder";
import { EmptyChatState } from "@/components/chat/EmptyChatState";
import { PromptStarters } from "@/components/chat/PromptStarters";

export default function Home() {
  return (
    <AppFrame>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <DesktopSidebar />

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <MobileSidebar />
          <ChatTopbar />

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
            <div className="mx-auto flex w-full max-w-[800px] flex-1 flex-col items-center justify-center gap-5 px-4 py-8 sm:gap-6 sm:px-6 lg:py-10">
              <EmptyChatState />
              <PromptStarters />
              <ComposerPlaceholder />
            </div>

            <CapabilityCards />
          </div>
        </main>
      </div>
    </AppFrame>
  );
}
