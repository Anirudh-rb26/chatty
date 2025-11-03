"use client"

import { useEffect, useState } from "react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { RotateCcw, Settings, Plus } from "lucide-react"

interface CommandMenuProps {
    onNewChat: () => void
    onClearHistory: () => void
    onSettings: () => void
}

export function CommandMenu({ onNewChat, onClearHistory, onSettings }: CommandMenuProps) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command..." />
            <CommandList>
                <CommandEmpty>No commands found.</CommandEmpty>
                <CommandGroup heading="Actions">
                    <CommandItem
                        className="data-[selected=true]:bg-foreground data-[selected=true]:text-black"
                        onSelect={() => {
                            onNewChat()
                            setOpen(false)
                        }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Chat
                    </CommandItem>
                    <CommandItem
                        className="data-[selected=true]:bg-foreground data-[selected=true]:text-black"
                        onSelect={() => {
                            onClearHistory()
                            setOpen(false)
                        }}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Clear History
                    </CommandItem>
                    <CommandItem
                        className="data-[selected=true]:bg-foreground data-[selected=true]:text-black"
                        onSelect={() => {
                            onSettings()
                            setOpen(false)
                        }}
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}