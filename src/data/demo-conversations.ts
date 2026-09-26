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
          "Here is a first pass. I structured it around the model lineup, then seat pricing, then the annual discount.",
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
    messages: [],
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
