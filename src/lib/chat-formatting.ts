export type InlineToken =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "inlineCode"; value: string };

export type ContentBlock = { type: "text"; value: string } | { type: "code"; value: string };

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return timeFormatter.format(date);
}

/** Short calendar label, so older messages are not read as today's. */
export function formatMessageDate(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) return "Today";

  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

export function splitContentBlocks(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const pattern = /```[a-zA-Z0-9]*\n?([\s\S]*?)```/g;

  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    if (match.index > cursor) {
      blocks.push({ type: "text", value: content.slice(cursor, match.index) });
    }
    blocks.push({ type: "code", value: match[1].replace(/\n$/, "") });
    cursor = match.index + match[0].length;
  }

  if (cursor < content.length) {
    blocks.push({ type: "text", value: content.slice(cursor) });
  }

  return blocks.length > 0 ? blocks : [{ type: "text", value: content }];
}

export function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const pattern = /\*\*([^*]+)\*\*|`([^`]+)`/g;

  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      tokens.push({ type: "text", value: text.slice(cursor, match.index) });
    }
    if (match[1] !== undefined) {
      tokens.push({ type: "bold", value: match[1] });
    } else if (match[2] !== undefined) {
      tokens.push({ type: "inlineCode", value: match[2] });
    }
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    tokens.push({ type: "text", value: text.slice(cursor) });
  }

  return tokens.length > 0 ? tokens : [{ type: "text", value: text }];
}
