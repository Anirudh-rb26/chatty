/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type { Message } from "@/types"
import { Button } from "@/components/ui/button"
import { Copy, RotateCcw, Edit2, Check } from "lucide-react"
import { useCallback, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Skeleton } from "./ui/skeleton"

interface ChatMessageProps {
    message: Message;
    onEdit?: (id: string, content: string) => void;
    onRegenerate?: () => void;
    isLoading?: boolean;
}

// Code block component with copy button
function CodeBlock({ inline, className, children, ...props }: any) {
    const [copied, setCopied] = useState(false)
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : ''
    const code = String(children).replace(/\n$/, '')

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        toast.success("Code copied")
        setTimeout(() => setCopied(false), 2000)
    }

    if (!inline && language) {
        return (
            <div className="relative group my-4 z-0">
                <div className="absolute right-2 top-2 z-10">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-8 px-2 bg-gray-700 hover:bg-gray-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-1" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                            </>
                        )}
                    </Button>
                </div>
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    className="rounded-lg !mt-0"
                    customStyle={{
                        margin: 0,
                        padding: '1rem',
                        fontSize: '0.875rem',
                    }}
                    {...props}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        )
    }

    return (
        <code className="bg-gray-700 text-gray-100 px-1.5 py-0.5 rounded text-sm" {...props}>
            {children}
        </code>
    )
}

export function ChatMessage({ message, onEdit, onRegenerate, isLoading }: ChatMessageProps) {
    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(message.content)
        setIsCopied(true)
        toast.success("Message copied")
        setTimeout(() => setIsCopied(false), 2000)
    }, [message.content])

    const handleRegenerate = useCallback(() => {
        if (onRegenerate) {
            onRegenerate()
            toast.success("Regenerating response...")
        }
    }, [onRegenerate])

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-2 md:gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`flex-1 max-w-xs md:max-w-2xl ${message.role === "user"
                    ? "bg-secondary text-white rounded-lg px-3 md:px-4 py-2 md:py-3"
                    : "flex gap-2 md:gap-3"
                    }`}
            >
                {message.role === "assistant" && (
                    <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 text-xs md:text-sm font-semibold">
                        AI
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    {message.role === "user" ? (
                        <div>
                            <p className="text-xs md:text-sm wrap-break-words">{message.content}</p>
                        </div>
                    ) : (
                        <div className="bg-secondary px-3 md:px-4 py-2 md:py-3 rounded-lg prose prose-invert max-w-none">
                            <ReactMarkdown
                                components={{
                                    code: CodeBlock
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                            {isLoading && (
                                <div className="space-y-3 mt-4">
                                    <Skeleton className="h-4 w-3/4 bg-primary" />
                                    <Skeleton className="h-4 w-1/2 bg-primary" />
                                </div>
                            )}
                        </div>
                    )}
                    {message.role === "assistant" && (
                        <motion.div
                            className="flex gap-1 md:gap-2 mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="h-6 md:h-7 px-1 md:px-2 text-xs"
                                    title="Copy message"
                                >
                                    {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </Button>
                            </motion.div>
                            {onRegenerate && (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRegenerate}
                                        className="h-6 md:h-7 px-1 md:px-2 text-xs"
                                        title="Regenerate response"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                    {message.role === "user" && onEdit && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(message.id, message.content)}
                                className="h-6 md:h-7 px-1 md:px-2 text-xs mt-2"
                                title="Edit message"
                            >
                                <Edit2 className="w-3 h-3" />
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}