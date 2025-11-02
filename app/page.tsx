"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import type { ChatSession, Message } from "@/types"
import { generateChatId, generateMessageId, getChatTitle } from "@/lib/chat-utils"
import { loadSessions, saveSessions, saveSession, deleteSession, clearAllSessions } from "@/lib/storage-utils"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatMessage } from "@/components/chat-message"
import { PromptInput } from "@/components/prompt-input"
import { CommandMenu } from "@/components/command-menu"
import { StickyQuestionHeader } from "@/components/sticky-question-header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

const mockSuggestions = [
  "Explain React hooks",
  "How to build a Next.js app",
  "Best practices for TypeScript",
  "CSS Grid vs Flexbox",
  "What is a closure in JavaScript",
]

const mockResponses = [
  `# React Hooks: A Comprehensive Guide

React Hooks are functions that let you "hook into" React state and lifecycle features. They enable you to use state and other React features in functional components, eliminating the need for class components in most cases.

## Most Common Hooks

### useState
The \`useState\` hook lets you add state to functional components:

\`\`\`jsx
const [count, setCount] = useState(0);

useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

### useEffect
Performs side effects in functional components:

\`\`\`jsx
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('Timer executed');
  }, 1000);
  
  return () => clearTimeout(timer);
}, []);
\`\`\`

### useContext
Access context values without nesting:

\`\`\`jsx
const theme = useContext(ThemeContext);
\`\`\`

## Rules of Hooks

1. Only call hooks at the top level of your component
2. Only call hooks from React function components or custom hooks
3. Never call hooks conditionally

## Custom Hooks

You can extract component logic into reusable functions:

\`\`\`jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setData(data));
  }, [url]);
  
  return data;
}
\`\`\`

Hooks have revolutionized how we write React components, making code more reusable and easier to understand.`,

  `# Building a Next.js Application: Complete Tutorial

Next.js is a powerful React framework that provides everything you need to build fast, production-ready applications.

## Getting Started

Start with the official scaffolding tool:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## File-Based Routing

Next.js uses the App Router with file-based routing. Create files in the \`app\` directory:

\`\`\`
app/
  page.tsx          # /
  about/page.tsx    # /about
  blog/[id]/page.tsx # /blog/:id
\`\`\`

## Server and Client Components

By default, all components are Server Components:

\`\`\`jsx
// Server Component (default)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component (needs 'use client')
'use client'
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

## API Routes

Create API endpoints in the \`app/api\` directory:

\`\`\`typescript
// app/api/users/route.ts
export async function GET() {
  return Response.json({ users: [] });
}

export async function POST(req: Request) {
  const data = await req.json();
  return Response.json({ success: true, data });
}
\`\`\`

## Deployment

Deploy instantly to Vercel with zero configuration. Next.js automatically optimizes your app for production.

This framework combines the best practices for modern web development with an amazing developer experience.`,

  `# TypeScript Best Practices: Writing Scalable Code

TypeScript adds static typing to JavaScript, helping you catch errors early and write more maintainable code.

## Enable Strict Mode

Always enable strict mode in your \`tsconfig.json\`:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
\`\`\`

## Avoid \`any\`

Never use \`any\` unless absolutely necessary:

\`\`\`typescript
// Bad
function process(data: any) {
  return data.value;
}

// Good
interface Data {
  value: string;
}

function process(data: Data) {
  return data.value;
}
\`\`\`

## Type Inference

Let TypeScript infer types when obvious:

\`\`\`typescript
// TypeScript knows this is a string
const name = "Alice";

// Explicit when needed
const count: number = 42;
\`\`\`

## Discriminated Unions

Use discriminated unions for type-safe handling:

\`\`\`typescript
type Result = 
  | { status: 'success'; data: unknown }
  | { status: 'error'; error: string };

function handle(result: Result) {
  if (result.status === 'success') {
    console.log(result.data);
  } else {
    console.log(result.error);
  }
}
\`\`\`

## Type Guards

Write reusable type guard functions:

\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

if (isString(value)) {
  console.log(value.toUpperCase());
}
\`\`\`

Mastering these practices will make your TypeScript code more robust and maintainable.`,

  `# CSS Grid vs Flexbox: When to Use Each

Both CSS Grid and Flexbox are powerful layout tools. Understanding when to use each is crucial for modern web development.

## Flexbox: One-Dimensional Layouts

Flexbox excels at laying out items in a single direction (row or column):

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.item {
  flex: 1;
}
\`\`\`

Use Flexbox for:
- Navigation menus
- Tool bars
- Component spacing
- Alignment of elements

## Grid: Two-Dimensional Layouts

Grid is perfect for complex two-dimensional layouts:

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}

.header {
  grid-column: 1 / -1;
}

.sidebar {
  grid-column: 1;
  grid-row: 2;
}
\`\`\`

Use Grid for:
- Page layouts
- Dashboard designs
- Complex multi-column layouts
- Photo galleries

## Combining Both

Often, the best approach combines both:

\`\`\`css
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
}

.header {
  grid-column: 1 / -1;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
\`\`\`

Understanding both tools empowers you to create flexible, responsive layouts efficiently.`,
]

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const currentSession = sessions.find((s) => s.id === currentSessionId)
  const currentMessages = currentSession?.messages || []

  // Load sessions from storage on mount
  useEffect(() => {
    const loaded = loadSessions()
    setSessions(loaded)
    if (loaded.length > 0) {
      setCurrentSessionId(loaded[0].id)
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentMessages])

  const handleNewChat = useCallback(() => {
    const newSession: ChatSession = {
      id: generateChatId(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setIsSidebarOpen(false)
    saveSessions([newSession, ...sessions])
  }, [sessions])

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId)
    setIsSidebarOpen(false)
  }

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    if (currentSessionId === sessionId) {
      const remaining = sessions.filter((s) => s.id !== sessionId)
      setCurrentSessionId(remaining.length > 0 ? remaining[0].id : null)
    }
    deleteSession(sessionId)
  }

  const handleClearAll = () => {
    setSessions([])
    setCurrentSessionId(null)
    clearAllSessions()
  }

  const handleSubmitPrompt = useCallback(
    async (prompt: string) => {
      if (!currentSession) return

      setIsLoading(true)

      const userMessage: Message = {
        id: generateMessageId(),
        content: prompt,
        role: "user",
        timestamp: Date.now(),
      }

      const updatedSession = {
        ...currentSession,
        messages: [...currentSession.messages, userMessage],
        updatedAt: Date.now(),
      }

      setSessions((prev) => prev.map((s) => (s.id === currentSessionId ? updatedSession : s)))
      saveSession(updatedSession)

      // Simulate streaming response with delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const responseContent = mockResponses[Math.floor(Math.random() * mockResponses.length)]
      let displayedContent = ""

      // Stream the response character by character
      let sessionWithResponse
      for (let i = 0; i < responseContent.length; i++) {
        displayedContent += responseContent[i]

        const assistantMessage: Message = {
          id: userMessage.id + "-response",
          content: displayedContent,
          role: "assistant",
          timestamp: Date.now(),
          isStreaming: i < responseContent.length - 1,
        }

        sessionWithResponse = {
          ...updatedSession,
          messages: [...updatedSession.messages.slice(0, -1), userMessage, assistantMessage],
          updatedAt: Date.now(),
        }

        setSessions((prev) => prev.map((s) => (s.id === currentSessionId ? sessionWithResponse : s)))

        // Update title based on first message
        if (currentSession.title === "New Chat" && currentSession.messages.length === 0) {
          sessionWithResponse.title = getChatTitle([userMessage])
          setSessions((prev) => prev.map((s) => (s.id === currentSessionId ? sessionWithResponse : s)))
        }

        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      if (sessionWithResponse) {
        saveSession(sessionWithResponse)
      }
      setIsLoading(false)
    },
    [currentSession, currentSessionId, sessions],
  )

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 100
    setShowStickyHeader(!isNearBottom)
  }

  if (!currentSession && sessions.length === 0) {
    return (
      <div className="flex h-screen bg-background flex-col md:flex-row">
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId || undefined}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onClearAll={handleClearAll}
          onSettings={() => { }}
          isOpen={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
        />
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-0">
          <CommandMenu onNewChat={handleNewChat} onClearHistory={handleClearAll} onSettings={() => { }} />
          <div className="text-center space-y-4 max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold">Start a New Conversation</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Ask me anything. I'll provide detailed answers with code examples and explanations.
            </p>
            <button
              onClick={handleNewChat}
              className="mt-8 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              New Chat
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background flex-col md:flex-row">
      <div
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <div
        className={`fixed left-0 top-0 h-screen z-40 md:static md:z-auto transition-transform md:transition-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId || undefined}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onClearAll={handleClearAll}
          onSettings={() => { }}
          isOpen={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
        />
      </div>

      <main className="flex-1 flex flex-col min-h-screen md:min-h-0">
        <StickyQuestionHeader
          question={currentMessages.find((m) => m.role === "user")?.content}
          isVisible={showStickyHeader}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <ScrollArea ref={messagesContainerRef} className="flex-1 overflow-y-auto" onScroll={handleScroll}>
          <div className="max-w-4xl mx-auto w-full p-4 md:p-6 space-y-4 md:space-y-6">
            {currentMessages.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center space-y-3">
                  <div className="text-5xl font-bold text-muted-foreground/20">✨</div>
                  <p className="text-muted-foreground text-sm md:text-base">Start by asking a question above</p>
                </div>
              </div>
            ) : (
              <>
                {currentMessages.map((message, index) => (
                  <div key={message.id} className="group">
                    <ChatMessage
                      message={message}
                      onRegenerate={
                        message.role === "assistant"
                          ? () => handleSubmitPrompt(currentMessages[index - 1]?.content || "")
                          : undefined
                      }
                    />
                  </div>
                ))}
                {isLoading && (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border bg-card p-4 md:p-6 shrink-0">
          <div className="max-w-4xl mx-auto">
            <PromptInput onSubmit={handleSubmitPrompt} isLoading={isLoading} suggestions={mockSuggestions} />
          </div>
        </div>
      </main>

      <CommandMenu onNewChat={handleNewChat} onClearHistory={handleClearAll} onSettings={() => { }} />
    </div>
  )
}
