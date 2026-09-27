import { AppFrame } from "@/components/layout/AppFrame";
import { ChatTopbar } from "@/components/layout/ChatTopbar";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { ConversationStage } from "@/components/chat/ConversationStage";
import { ChatProvider } from "@/components/providers/ChatProvider";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <ChatProvider>
      <AppFrame>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <DesktopSidebar />

          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <MobileSidebar />
            <ChatTopbar />

            <ConversationStage />
          </main>
        </div>
      </AppFrame>
    </ChatProvider>
  );
}
