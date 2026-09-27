import type { Conversation } from "@/types/chat";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function ago(offset: number): string {
  return new Date(Date.now() - offset).toISOString();
}

export const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-pricing-brief",
    title: "Draft a pricing brief for the Pro tier",
    updatedAt: ago(18 * MINUTE),
    messages: [
      {
        id: "msg-pricing-1",
        role: "user",
        content:
          "Draft a short pricing brief for the EchoGPT Pro tier. Keep it to one page and lead with the model lineup.",
        createdAt: ago(20 * MINUTE),
        status: "complete",
      },
      {
        id: "msg-pricing-2",
        role: "assistant",
        content:
          "Here is a first pass, structured around the model lineup, then seat pricing, then the annual discount.\n\n**Model lineup.** Pro unlocks the full catalogue rather than a single pinned model, so the headline is breadth rather than a single benchmark. The strongest argument is that a user can move a hard prompt to a reasoning model without switching products.\n\n**Seat pricing.** A flat per-seat price tested better than metered tokens for the teams we spoke with, because it removes the surprise invoice entirely. Usage caps stay visible but generous.\n\n**Annual discount.** Two months free is the clearest framing and it is easy to say out loud. Avoid stacking it with a first-year upgrade credit; the arithmetic gets confusing and sales calls stall on it.\n\n**Objection to expect.** Teams will ask what happens when they hit the cap. Answer plainly: the conversation stays intact and the next message waits. Do not imply the cap resets mid-thread.\n\nOne thing I would flag before this goes further: the brief assumes a single monthly cap, and the usage meter in the product currently shows a different number. Worth reconciling those before this is customer-facing.",
        createdAt: ago(19 * MINUTE),
        status: "complete",
        model: "echogpt-pro",
      },
    ],
  },
  {
    id: "conv-onboarding-emails",
    title: "Rewrite the onboarding email sequence",
    updatedAt: ago(2 * HOUR),
    messages: [
      {
        id: "msg-onboarding-1",
        role: "user",
        content: "Rewrite the three onboarding emails so the second one lands the Pro upgrade.",
        createdAt: ago(2 * HOUR + 10 * MINUTE),
        status: "complete",
      },
    ],
  },
  {
    id: "conv-sql-window",
    title: "Explain the rolling window in this SQL query",
    updatedAt: ago(5 * HOUR),
    messages: [
      {
        id: "msg-sql-1",
        role: "user",
        content: "Why does this return duplicate rows per account for the last three days?",
        createdAt: ago(5 * HOUR + 8 * MINUTE),
        status: "complete",
      },
      {
        id: "msg-sql-2",
        role: "assistant",
        content:
          "The window has no frame clause, so every event row in the partition sums every event that came before it. That is a running total, not a rolling one.\n\n```sql\nSELECT\n  account_id,\n  event_date,\n  SUM(amount) OVER (\n    PARTITION BY account_id\n    ORDER BY event_date\n  ) AS running_total\nFROM events\nWHERE event_date >= CURRENT_DATE - INTERVAL '3 days';\n```\n\nAdding a frame makes it a true rolling window:\n\n```sql\nSUM(amount) OVER (\n  PARTITION BY account_id\n  ORDER BY event_date\n  RANGE BETWEEN INTERVAL '1 day' PRECEDING AND CURRENT ROW\n) AS rolling_total\n```\n\nThe duplicate-per-day appearance comes from several events sharing an `event_date`. `RANGE` treats peers as one group, which usually matches what people expect here. If you need each row counted separately, switch to `ROWS` and accept that same-day rows will see different partial totals.",
        createdAt: ago(5 * HOUR),
        status: "complete",
        model: "echogpt-pro",
      },
    ],
  },
  {
    id: "conv-api-migration",
    title: "Plan the v1 to v2 API migration",
    updatedAt: ago(26 * HOUR),
    messages: [
      {
        id: "msg-api-1",
        role: "user",
        content: "We need a staged plan for the v1 to v2 API migration with no downtime.",
        createdAt: ago(27 * HOUR),
        status: "complete",
      },
      {
        id: "msg-api-2",
        role: "assistant",
        content: "Six stages, dual-write behind a flag, then a two-week deprecation window.",
        createdAt: ago(26 * HOUR),
        status: "complete",
        model: "echogpt-pro",
      },
    ],
  },
  {
    id: "conv-postmortem",
    title: "Summarize the Friday postmortem",
    updatedAt: ago(30 * HOUR),
    messages: [],
  },
  {
    id: "conv-brand-voice",
    title: "Tighten the brand voice guidelines",
    updatedAt: ago(6 * DAY),
    messages: [],
  },
  {
    id: "conv-roadmap-deck",
    title: "Outline the Q3 roadmap deck",
    updatedAt: ago(12 * DAY),
    messages: [],
  },
];
