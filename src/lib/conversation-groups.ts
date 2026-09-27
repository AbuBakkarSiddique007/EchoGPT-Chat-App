import type {
  Conversation,
  ConversationGroup,
  ConversationGroupKey,
} from "@/types/chat";

const GROUP_ORDER: ConversationGroupKey[] = ["Today", "Yesterday", "Older"];

const DAY = 24 * 60 * 60 * 1000;

function startOfDay(reference: Date): number {
  const copy = new Date(reference);
  copy.setHours(0, 0, 0, 0);
  return copy.getTime();
}

function groupFor(updatedAt: string, todayStart: number, yesterdayStart: number): ConversationGroupKey {
  const time = new Date(updatedAt).getTime();

  if (Number.isNaN(time)) return "Older";
  if (time >= todayStart) return "Today";
  if (time >= yesterdayStart) return "Yesterday";
  return "Older";
}

export function groupConversations(
  conversations: Conversation[],
  now: Date = new Date(),
): ConversationGroup[] {
  const todayStart = startOfDay(now);
  const yesterdayStart = todayStart - DAY;

  const buckets = new Map<ConversationGroupKey, Conversation[]>(
    GROUP_ORDER.map((key) => [key, []]),
  );

  for (const conversation of conversations) {
    const key = groupFor(conversation.updatedAt, todayStart, yesterdayStart);
    buckets.get(key)?.push(conversation);
  }

  return GROUP_ORDER.flatMap((key) => {
    const items = buckets.get(key) ?? [];
    if (items.length === 0) return [];

    items.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    return [{ key, conversations: items }];
  });
}
