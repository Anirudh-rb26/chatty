"use client"

import type { ChatSession } from "@/types"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Settings, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"

interface ChatSidebarProps {
    sessions: ChatSession[]
    currentSessionId?: string
    onSelectSession: (sessionId: string) => void
    onNewChat: () => void
    onDeleteSession: (sessionId: string) => void
    onClearAll: () => void
    onSettings: () => void
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

export function ChatSidebar({
    sessions,
    currentSessionId,
    onSelectSession,
    onNewChat,
    onDeleteSession,
    onClearAll,
    onSettings,
    isOpen,
    onOpenChange,
}: ChatSidebarProps) {
    return (
        <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold hidden md:block">Chat History</h2>
                <Button onClick={() => onOpenChange?.(false)} variant="ghost" size="icon" className="md:hidden">
                    <X className="w-4 h-4" />
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={onNewChat} className="gap-2 flex-1 md:flex-initial ml-2 md:ml-0">
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New</span>
                    </Button>
                </motion.div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {sessions.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">No chats yet</div>
                    ) : (
                        sessions.map((session, index) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                whileHover={{ x: 4 }}
                                className={`group px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${currentSessionId === session.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary hover:text-white"
                                    }`}
                                onClick={() => onSelectSession(session.id)}
                            >
                                <div className="flex items-center justify-between gap-2 ">
                                    <span className="truncate flex-1 text-xs sm:text-sm">{session.title}</span>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onDeleteSession(session.id)
                                            }}
                                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-border space-y-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full gap-2 text-xs bg-transparent hover:bg-foreground hover:text-white" onClick={onClearAll}>
                        Clear History
                    </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full gap-2 text-xs bg-transparent hover:bg-foreground hover:text-white" onClick={onSettings}>
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Settings</span>
                    </Button>
                </motion.div>
            </div>
        </aside>
    )
}
