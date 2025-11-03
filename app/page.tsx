/* eslint-disable react-hooks/exhaustive-deps */
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
import { StickyQuestionHeader } from "@/components/sticky-header"
import { mockResponses } from "@/mock-responses/chat-responses"
import { mockSuggestions } from "@/mock-responses/mock-suggestions"


export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const lastQuestionRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)
  const currentSession = sessions.find((s) => s.id === currentSessionId)
  const currentMessages = currentSession?.messages || []


  useEffect(() => {
    const loaded = loadSessions()
    setSessions(loaded)
    if (loaded.length > 0) {
      setCurrentSessionId(loaded[0].id)
    }
  }, [])

  // Smart scroll: only auto-scroll if user is near the bottom
  useEffect(() => {
    if (!messagesContainerRef.current || !shouldAutoScrollRef.current) return

    const container = messagesContainerRef.current
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
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
    shouldAutoScrollRef.current = true
  }, [sessions])

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId)
    setIsSidebarOpen(false)
    shouldAutoScrollRef.current = true
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
      shouldAutoScrollRef.current = true

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

  const handleRegenerate = useCallback(
    async (messageId: string) => {
      if (!currentSession) return

      // Find the index of the assistant message to regenerate
      const messageIndex = currentSession.messages.findIndex((m) => m.id === messageId)
      if (messageIndex === -1) return

      // Find the user message that came before this assistant message
      const userMessage = currentSession.messages[messageIndex - 1]
      if (!userMessage || userMessage.role !== "user") return

      // Remove the assistant message and all messages after it
      const updatedMessages = currentSession.messages.slice(0, messageIndex)

      const updatedSession = {
        ...currentSession,
        messages: updatedMessages,
        updatedAt: Date.now(),
      }

      // Update state and storage
      setSessions((prev) => prev.map((s) => (s.id === currentSessionId ? updatedSession : s)))
      saveSession(updatedSession)

      // Now generate a new response
      setIsLoading(true)
      shouldAutoScrollRef.current = true

      // Simulate streaming response with delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const responseContent = mockResponses[Math.floor(Math.random() * mockResponses.length)]
      let displayedContent = ""
      const newMessageId = generateMessageId()

      // Stream the response character by character
      let sessionWithResponse = updatedSession
      for (let i = 0; i < responseContent.length; i++) {
        displayedContent += responseContent[i]

        const assistantMessage: Message = {
          id: newMessageId,
          content: displayedContent,
          role: "assistant",
          timestamp: Date.now(),
          isStreaming: i < responseContent.length - 1,
        }

        // Check if message already exists and update it, otherwise add it
        const existingMessageIndex = sessionWithResponse.messages.findIndex(m => m.id === newMessageId)

        if (existingMessageIndex !== -1) {
          sessionWithResponse = {
            ...sessionWithResponse,
            messages: [
              ...sessionWithResponse.messages.slice(0, existingMessageIndex),
              assistantMessage,
              ...sessionWithResponse.messages.slice(existingMessageIndex + 1)
            ],
            updatedAt: Date.now(),
          }
        } else {
          sessionWithResponse = {
            ...sessionWithResponse,
            messages: [...sessionWithResponse.messages, assistantMessage],
            updatedAt: Date.now(),
          }
        }

        setSessions((prev) => prev.map((s) => (s.id === currentSessionId ? sessionWithResponse : s)))

        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      saveSession(sessionWithResponse)
      setIsLoading(false)
    },
    [currentSession, currentSessionId],
  )

  const [lastHiddenQuestion, setLastHiddenQuestion] = useState<string>("")

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!messagesContainerRef.current) return

    const containerElement = messagesContainerRef.current
    const containerRect = containerElement.getBoundingClientRect()

    // Check if user is near the bottom (within 150px)
    const isNearBottom = containerElement.scrollHeight - containerElement.scrollTop - containerElement.clientHeight < 150
    shouldAutoScrollRef.current = isNearBottom

    // Find all user message elements
    const userMessages = containerElement.querySelectorAll('.group')
    let lastHidden: string | null = null

    // Check each user message
    userMessages.forEach((element) => {
      const rect = element.getBoundingClientRect()
      // If the message is above the viewport, it's hidden
      if (rect.bottom < containerRect.top) {
        const messageContent = element.querySelector('[role="user"]')?.textContent
        if (messageContent) {
          lastHidden = messageContent
        }
      }
    })

    if (lastHidden) {
      setLastHiddenQuestion(lastHidden)
      setShowStickyHeader(true)
    } else {
      setShowStickyHeader(false)
    }
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
              Ask me anything. I&apos;ll provide detailed answers with code examples and explanations.
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

      <main className="flex-1 flex flex-col min-h-screen md:min-h-0 bg-transparent relative">
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto pb-24"
          onScroll={handleScroll}
        >
          <StickyQuestionHeader
            question={lastHiddenQuestion}
            isVisible={showStickyHeader}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />
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
                {currentMessages.map((message, index) => {
                  const isLastUserMessage = message.role === "user" &&
                    index === currentMessages.map(m => m.role).lastIndexOf("user")

                  return (
                    <div
                      key={message.id}
                      className="group"
                      ref={isLastUserMessage ? lastQuestionRef : null}
                    >
                      <div role={message.role}>
                        <ChatMessage
                          message={message}
                          isLoading={isLoading}
                          onRegenerate={
                            message.role === "assistant"
                              ? () => handleRegenerate(message.id)
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto bg-secondary rounded-xl p-5">
            <PromptInput onSubmit={handleSubmitPrompt} isLoading={isLoading} suggestions={mockSuggestions} />
          </div>
        </div>
      </main>

      <CommandMenu onNewChat={handleNewChat} onClearHistory={handleClearAll} onSettings={() => { }} />
    </div>
  )
}