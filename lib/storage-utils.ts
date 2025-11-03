import { ChatSession } from "@/types";

const STORAGE_KEY = "chat_sessions";

export const loadSessions = (): ChatSession[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveSessions = (sessions: ChatSession[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    console.error("Failed to save sessions");
  }
};

export const saveSession = (session: ChatSession): void => {
  const sessions = loadSessions();
  const index = sessions.findIndex((s) => s.id === session.id);
  if (index !== -1) {
    sessions[index] = session;
  } else {
    sessions.push(session);
  }
  saveSessions(sessions);
};

export const deleteSession = (sessionId: string): void => {
  const sessions = loadSessions().filter((s) => s.id !== sessionId);
  saveSessions(sessions);
};

export const clearAllSessions = (): void => {
  saveSessions([]);
};
