/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2, AtSign } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PromptInputProps {
    onSubmit: (prompt: string) => void
    isLoading: boolean
    suggestions?: string[]
}

// Mock people data for @ mentions
const MOCK_PEOPLE = [
    { id: "1", name: "Alice Johnson", displayName: "Alice Johnson", email: "alice@example.com" },
    { id: "2", name: "Bob Smith", displayName: "Bob Smith", email: "bob@example.com" },
    { id: "3", name: "Charlie Brown", displayName: "Charlie Brown", email: "charlie@example.com" },
    { id: "4", name: "Diana Prince", displayName: "Diana Prince", email: "diana@example.com" },
    { id: "5", name: "Emma Davis", displayName: "Emma Davis", email: "emma@example.com" },
    { id: "6", name: "Frank Miller", displayName: "Frank Miller", email: "frank@example.com" },
]

export function PromptInput({ onSubmit, isLoading, suggestions = [] }: PromptInputProps) {
    const [prompt, setPrompt] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [showMentions, setShowMentions] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const [mentionQuery, setMentionQuery] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const suggestionsRef = useRef<(HTMLDivElement | null)[]>([])

    const mentionResults = mentionQuery.trim()
        ? MOCK_PEOPLE.filter((p) => p.displayName.toLowerCase().includes(mentionQuery.toLowerCase()))
        : []

    // Determine what to show - suggestions or mentions
    const isMentionMode = prompt.includes("@") && showMentions
    const currentSuggestions: (string | typeof MOCK_PEOPLE[0])[] = isMentionMode
        ? mentionResults
        : suggestions.filter((s) => s.toLowerCase().includes(prompt.toLowerCase()))

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault()
            const newIndex = Math.min(highlightedIndex + 1, currentSuggestions.length - 1)
            setHighlightedIndex(newIndex)
            setTimeout(() => {
                suggestionsRef.current[newIndex]?.scrollIntoView({ block: "nearest" })
            }, 0)
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            const newIndex = Math.max(highlightedIndex - 1, -1)
            setHighlightedIndex(newIndex)
            if (newIndex >= 0) {
                setTimeout(() => {
                    suggestionsRef.current[newIndex]?.scrollIntoView({ block: "nearest" })
                }, 0)
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            if (highlightedIndex >= 0 && (showSuggestions || showMentions)) {
                selectSuggestion(currentSuggestions[highlightedIndex])
            } else {
                handleSubmit()
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false)
            setShowMentions(false)
            setHighlightedIndex(-1)
        }
    }

    const selectSuggestion = (item: string | typeof MOCK_PEOPLE[0]) => {
        if (isMentionMode && typeof item === "object") {
            // Replace @query with @name
            const lastAtIndex = prompt.lastIndexOf("@")
            const beforeAt = prompt.substring(0, lastAtIndex)
            setPrompt(`${beforeAt}@${item.displayName} `)
            setShowMentions(false)
        } else {
            setPrompt(typeof item === "string" ? item : item.displayName)
            setShowSuggestions(false)
            handleSubmit()
        }
        setHighlightedIndex(-1)
    }

    const handlePromptChange = (value: string) => {
        setPrompt(value)
        setHighlightedIndex(-1)

        const lastAtIndex = value.lastIndexOf("@")
        if (lastAtIndex !== -1) {
            const afterAt = value.substring(lastAtIndex + 1)
            if (!afterAt.includes(" ")) {
                setShowMentions(true)
                setShowSuggestions(false)
                setMentionQuery(afterAt)
                return
            }
        }

        setShowMentions(false)
        setShowSuggestions(!!value)
    }

    const handleSubmit = () => {
        if (prompt.trim()) {
            onSubmit(prompt)
            setPrompt("")
            setShowSuggestions(false)
            setShowMentions(false)
        }
    }

    const handleFocus = () => {
        if (prompt) {
            if (prompt.includes("@")) {
                setShowMentions(true)
            } else {
                setShowSuggestions(true)
            }
        }
    }

    return (
        <div className="w-full relative">
            {/* No people found message - appears above input */}
            <AnimatePresence>
                {showMentions && currentSuggestions.length === 0 && mentionQuery && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-0 right-0 mb-2 backdrop-blur-xl bg-card/80 rounded-lg shadow-lg z-50 p-3 text-xs text-muted-foreground"
                    >
                        No people found
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative flex gap-2">
                <Input
                    ref={inputRef}
                    value={prompt}
                    onChange={(e) => handlePromptChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder="Ask me anything... (@ to mention people)"
                    className="flex-1 text-sm md:text-base border border-primary/60"
                    disabled={isLoading}
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !prompt.trim()}
                        size="icon"
                        className="h-9 md:h-10 w-9 md:w-10 bg-primary"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </motion.div>
            </div>

            {/* Suggestions/mentions dropdown - appears above input */}
            <AnimatePresence>
                {(showSuggestions || showMentions) && currentSuggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-0 right-0 mb-2 backdrop-blur-xl bg-card/80 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                    >
                        {currentSuggestions.map((item, index) => {
                            const displayText =
                                typeof item === "object" ? item.displayName || item.name : item
                            const isHighlighted = index === highlightedIndex

                            const query = isMentionMode ? mentionQuery : prompt
                            const displayParts = displayText.split(new RegExp(`(${query})`, "gi"))

                            return (
                                <motion.div
                                    key={typeof item === "object" ? item.id : item}
                                    ref={(el) => {
                                        suggestionsRef.current[index] = el
                                    }}
                                    onClick={() => selectSuggestion(item)}
                                    initial={{ opacity: 0, x: -4 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -4 }}
                                    transition={{ duration: 0.1, delay: index * 0.02 }}
                                    whileHover={{ y: -2 }}
                                    className={`px-3 md:px-4 py-2 cursor-pointer text-xs md:text-sm flex items-center gap-2 transition-all duration-100 ${isHighlighted
                                        ? "bg-primary text-primary-foreground border-l-4 border-primary font-medium shadow-sm ring-1 ring-primary/50"
                                        : "hover:bg-secondary hover:text-white"
                                        }`}
                                >
                                    {isMentionMode && <AtSign className="w-3 h-3 shrink-0" />}
                                    <span className="wrap-break-words">
                                        {displayParts.map((part, i) =>
                                            part.toLowerCase() === query.toLowerCase() ? <strong key={i}>{part}</strong> : part,
                                        )}
                                    </span>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}