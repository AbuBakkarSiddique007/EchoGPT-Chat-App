import type { Message } from "@/types/chat";

export type ChatRequest = {
  conversationId: string;
  history: Message[];
};

export type ChatCompletion = {
  content: string;
  model: string;
};

export interface ChatTransport {
  send(request: ChatRequest, signal?: AbortSignal): Promise<ChatCompletion>;
}

const MODEL = "echogpt-local-preview";

const REPLIES: { pattern: RegExp; content: string }[] = [
  {
    pattern: /\b(sql|query|select|join|window function|index)\b/i,
    content:
      "This is a **local preview response**, not a real model answer, so treat the shape as the point rather than the content.\n\nFor the query you described, the usual suspects are a missing window frame and same-day peers collapsing into one row:\n\n```sql\nSUM(amount) OVER (\n  PARTITION BY account_id\n  ORDER BY event_date\n  RANGE BETWEEN INTERVAL '1 day' PRECEDING AND CURRENT ROW\n) AS rolling_total\n```\n\nAdd the frame clause and the duplicate rows should collapse. If they do not, the next thing to check is whether `event_date` carries a time component.",
  },
  {
    pattern: /\b(brief|draft|pricing|proposal|one[- ]page)\b/i,
    content:
      "Local preview response. Here is the **shape** a brief like that usually takes:\n\n**Opening line.** State the decision the reader has to make, not the background.\n\n**Three supporting points.** One per paragraph, each with a concrete number or example.\n\n**Objection.** Name the strongest reason to say no and answer it in the same paragraph.\n\n**Ask.** Close with the specific next action and who owns it.\n\nThe part people usually get wrong is the opening line. It tends to restate the assignment instead of framing the decision.",
  },
  {
    pattern: /\b(debug|stack ?trace|error|exception|bug|fix)\b/i,
    content:
      "Local preview response, so this is a generic shape rather than a diagnosis.\n\nThe smallest safe fix usually comes from reading the **first** frame in the trace, not the last. The last frame is where it surfaced, not where it started.\n\n```ts\ntry {\n  await runStep();\n} catch (error) {\n  logger.error({ error, step: \"runStep\" }, \"step failed\");\n  throw error;\n}\n```\n\nWrapping the step that throws usually buys you the context you actually needed. Paste the real trace and I can be more specific.",
  },
];

const MAX_QUOTED = 160;

const FALLBACK = (prompt: string) => {
  const quoted =
    prompt.length > MAX_QUOTED ? `${prompt.slice(0, MAX_QUOTED).trimEnd()}…` : prompt;

  return `Local preview response. I received: **${quoted}**\n\nThis build has no model behind it yet, so the reply is a canned placeholder chosen from a small fixed set. The parts that are real are the surrounding behaviour: your message was appended, the draft cleared, the thread timestamped, and the scroll anchored to this reply.`;
};

function replyFor(prompt: string): string {
  for (const { pattern, content } of REPLIES) {
    if (pattern.test(prompt)) return content;
  }
  return FALLBACK(prompt);
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = setTimeout(resolve, ms);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

export function createLocalTransport(latencyMs = 400): ChatTransport {
  return {
    async send({ history }, signal) {
      const lastUser = [...history].reverse().find((message) => message.role === "user");
      const prompt = lastUser?.content ?? "";

      await delay(latencyMs, signal);

      return { content: replyFor(prompt), model: MODEL };
    },
  };
}
