"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ArrowUp, ChevronDown, Paperclip, SlidersHorizontal, Square } from "lucide-react";

import { useChatStore } from "@/components/providers/ChatProvider";
import { COMPOSER_FOCUS_EVENT } from "@/lib/composer-events";
import { cn } from "@/lib/utils";

const MIN_HEIGHT_PX = 44;
const MAX_HEIGHT_PX = 240;
const MODELS = ["GPT-5.6 Sol", "GPT-5.6 Terra", "GPT-5.6 Mini"];

export function Composer({ onSend }: { onSend?: (text: string) => void }) {
  const { selectedId, draft, setDraft, statusFor } = useChatStore();
  const status = statusFor(selectedId);
  const isStreaming = status === "sending" || status === "streaming";

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);

  const trimmed = draft.trim();
  const canSend = trimmed.length > 0 && onSend !== undefined;

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const measured = el.scrollHeight;
    el.style.height = `${Math.min(Math.max(measured, MIN_HEIGHT_PX), MAX_HEIGHT_PX)}px`;
    el.style.overflowY = measured > MAX_HEIGHT_PX ? "auto" : "hidden";
  }, [draft]);

  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    textareaRef.current?.focus();
  }, [selectedId]);

  useEffect(() => {
    const handler = () => textareaRef.current?.focus();
    window.addEventListener(COMPOSER_FOCUS_EVENT, handler);
    return () => window.removeEventListener(COMPOSER_FOCUS_EVENT, handler);
  }, []);

  const submit = useCallback(() => {
    if (!canSend || !onSend) return;
    onSend(trimmed);
  }, [canSend, onSend, trimmed]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      if (modelMenuOpen) {
        event.preventDefault();
        setModelMenuOpen(false);
      }
      return;
    }

    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      if (!canSend) return;
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="w-full rounded-2xl border border-brand/45 bg-composer/80 shadow-[0_0_28px_-10px_var(--echo-brand-glow)] backdrop-blur-sm transition-colors focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--echo-brand-glow)]"
    >
      <label htmlFor="composer-input" className="sr-only">
        Message EchoGPT
      </label>
      <span aria-live="polite" className="sr-only">
        {canSend ? "Message ready to send." : "Send unavailable."}
      </span>
      <textarea
        id="composer-input"
        ref={textareaRef}
        rows={1}
        value={draft}
        onChange={(event) => setDraft(selectedId, event.target.value)}
        onKeyDown={handleKeyDown}
        enterKeyHint="send"
        aria-describedby="composer-hint"
        placeholder="Message EchoGPT…"
        className="block max-h-[240px] w-full resize-none bg-transparent px-3.5 pt-3 pb-1 text-[15px] leading-6 text-fg outline-none placeholder:text-fg-dim"
      />

      <div className="flex items-center gap-1 px-2.5 pt-1 pb-2">
        <button
          type="button"
          aria-disabled="true"
          title="Attachments — coming soon"
          className="focus-ring cursor-not-allowed rounded-md p-1.5 text-fg-3 transition-colors hover:bg-brand/10"
        >
          <Paperclip className="size-4" aria-hidden="true" />
          <span className="sr-only">Attach a file</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setModelMenuOpen((open) => !open)}
            aria-expanded={modelMenuOpen}
            aria-haspopup="menu"
            className="focus-ring flex items-center gap-1 rounded-md px-1.5 py-1 text-[12px] text-fg-2 transition-colors hover:bg-brand/10"
          >
            <span className="font-medium">GPT-5.6 Sol</span>
            <ChevronDown className="size-3 shrink-0 text-fg-3" aria-hidden="true" />
            <span className="sr-only">Select a model</span>
          </button>

          {modelMenuOpen ? (
            <>
              <button
                type="button"
                tabIndex={-1}
                aria-label="Close model menu"
                onClick={() => setModelMenuOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div
                role="menu"
                aria-label="Model"
                className="absolute bottom-full left-0 z-20 mb-1 w-56 rounded-lg border border-line bg-surface-2/95 p-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.8)] backdrop-blur"
              >
                {MODELS.map((model) => (
                  <div
                    key={model}
                    role="menuitem"
                    aria-disabled="true"
                    title="Model switching — coming soon"
                    className="cursor-not-allowed rounded-md px-2.5 py-1.5 text-[12.5px] text-fg-3"
                  >
                    {model}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <button
          type="button"
          aria-disabled="true"
          title="Prompt options — coming soon"
          className="focus-ring cursor-not-allowed rounded-md p-1.5 text-fg-3 transition-colors hover:bg-brand/10"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          <span className="sr-only">Prompt options</span>
        </button>

        <span
          id="composer-hint"
          className="ml-auto hidden truncate pr-1 text-[11px] text-fg-dim sm:block"
        >
          Enter to send, Shift+Enter for a new line
        </span>

        {isStreaming ? (
          <button
            type="button"
            aria-disabled="true"
            title="Stop generating — streaming connects in a later part"
            className="focus-ring grid size-9 shrink-0 cursor-not-allowed place-items-center rounded-full border border-line bg-surface-2 text-fg-3"
          >
            <Square className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Stop generating</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            aria-disabled={!canSend}
            title={
              onSend === undefined
                ? "Send — connects once a conversation transport exists"
                : "Send message"
            }
            className={cn(
              "focus-ring grid size-9 shrink-0 place-items-center rounded-full transition-opacity",
              canSend
                ? "bg-brand text-white"
                : "cursor-not-allowed bg-brand text-white opacity-45",
            )}
          >
            <ArrowUp className="size-4" aria-hidden="true" />
            <span className="sr-only">Send message</span>
          </button>
        )}
      </div>
    </form>
  );
}
