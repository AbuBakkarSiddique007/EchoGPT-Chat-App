"use client";

import { Fragment, type ReactNode } from "react";
import { Sparkles, UserRound } from "lucide-react";

import { MessageActions } from "@/components/chat/MessageActions";
import {
  formatMessageDate,
  formatMessageTime,
  splitContentBlocks,
  tokenizeInline,
} from "@/lib/chat-formatting";
import type { Message } from "@/types/chat";

function renderInline(text: string): ReactNode[] {
  return tokenizeInline(text).map((token, index) => {
    if (token.type === "bold") {
      return (
        <strong key={index} className="font-semibold text-fg">
          {token.value}
        </strong>
      );
    }
    if (token.type === "inlineCode") {
      return (
        <code
          key={index}
          className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[0.85em] text-brand-text"
        >
          {token.value}
        </code>
      );
    }
    return <Fragment key={index}>{token.value}</Fragment>;
  });
}

function MessageBody({ content }: { content: string }) {
  const blocks = splitContentBlocks(content);

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, index) =>
        block.type === "code" ? (
          <pre
            key={index}
            className="max-w-full overflow-x-auto rounded-lg border border-line bg-surface-2/80 p-3 font-mono text-[12.5px] leading-relaxed whitespace-pre text-fg-2"
          >
            <code>{block.value}</code>
          </pre>
        ) : (
          <p key={index} className="text-[14.5px] leading-relaxed whitespace-pre-wrap text-fg-2">
            {renderInline(block.value)}
          </p>
        ),
      )}
    </div>
  );
}

function Meta({ createdAt, model }: { createdAt: string; model?: string }) {
  return (
    <span className="flex shrink-0 items-center gap-1.5 text-[10.5px] text-fg-dim">
      <time dateTime={createdAt} suppressHydrationWarning className="tabular-nums">
        {formatMessageDate(createdAt)} {formatMessageTime(createdAt)}
      </time>
      {model ? <span className="truncate opacity-80">{model}</span> : null}
    </span>
  );
}

function UserMessage({ message }: { message: Message }) {
  return (
    <article
      aria-label="Your message"
      className="flex justify-end gap-2.5 pl-10 sm:pl-24"
    >
      <div className="flex min-w-0 max-w-[min(100%,560px)] flex-col items-end gap-1">
        <div className="rounded-2xl rounded-br-md border border-brand/30 bg-brand/12 px-3.5 py-2.5">
          <MessageBody content={message.content} />
        </div>
        <Meta createdAt={message.createdAt} />
      </div>

      <span
        className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2"
        aria-hidden="true"
      >
        <UserRound className="size-3.5 text-fg-2" />
      </span>
    </article>
  );
}

function AssistantMessage({ message }: { message: Message }) {
  return (
    <article aria-label="EchoGPT response" className="flex gap-2.5 pr-6 sm:pr-16">
      <span
        className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2"
        aria-hidden="true"
      >
        <Sparkles className="size-3.5 text-brand-text" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="rounded-2xl rounded-tl-md border border-line bg-surface-2/50 px-3.5 py-2.5">
          <MessageBody content={message.content} />
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Meta createdAt={message.createdAt} model={message.model} />
          <MessageActions message={message} />
        </div>
      </div>
    </article>
  );
}

export function MessageItem({ message }: { message: Message }) {
  if (message.role === "system") {
    return (
      <div className="mx-auto w-full max-w-[800px] px-4 sm:px-6">
        <p className="rounded-lg border border-line bg-surface-2/40 px-3 py-2 text-[12.5px] text-fg-dim">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div data-role={message.role} className="mx-auto w-full max-w-[800px] px-4 sm:px-6">
      {message.role === "user" ? (
        <UserMessage message={message} />
      ) : (
        <AssistantMessage message={message} />
      )}
    </div>
  );
}
