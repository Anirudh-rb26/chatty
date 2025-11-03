interface Artifact {
  id: string;
  type: string;
  language: string;
  content: string;
  isExpanded: boolean;
}

interface Message {
  role: string;
  content: string;
}

export const generateChatId = () => `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const generateMessageId = () =>
  `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const extractArtifacts = (content: string): Artifact[] => {
  const artifacts: Artifact[] = [];
  const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const markdownRegex = /\n(#{1,6} .+)/g;

  let match;
  while ((match = codeRegex.exec(content)) !== null) {
    artifacts.push({
      id: generateMessageId(),
      type: "code",
      language: match[1] || "text",
      content: match[2].trim(),
      isExpanded: false,
    });
  }

  return artifacts;
};

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString();
};

export const getChatTitle = (messages: Message[]): string => {
  const firstUserMessage = messages.find((m) => m.role === "user");
  if (!firstUserMessage) return "New Chat";
  return (
    firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "")
  );
};
