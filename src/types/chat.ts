
export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "complete" | "streaming" | "error";

export type ChatStatus = "idle" | "sending" | "streaming" | "error";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  status?: MessageStatus;
  model?: string;
};

export type Conversation = {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
};

export type ConversationGroupKey = "Today" | "Yesterday" | "Older";

export type ConversationGroup = {
  key: ConversationGroupKey;
  conversations: Conversation[];
};

export type DraftMap = Record<string, string>;
