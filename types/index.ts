export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
  isStreaming?: boolean;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

export type Artifact = {
  id: string;
  type: "code" | "markdown" | "preview";
  content: string;
  language?: string;
  isExpanded: boolean;
};
