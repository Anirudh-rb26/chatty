"use client"
import { motion } from "framer-motion"

interface StickyQuestionHeaderProps {
    question?: string
    isVisible: boolean
    onToggleSidebar?: () => void
}

export function StickyQuestionHeader({ question, isVisible }: StickyQuestionHeaderProps) {
    if (!isVisible || !question) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="sticky top-0 px-4 md:px-6 py-3 z-10"
        >
            {/* Solid to blur gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background from-0% via-background/95 via-50% to-transparent to-100% backdrop-blur-xl -z-10" />

            <p className="text-xs md:text-sm text-muted-foreground line-clamp-1 flex-1 relative z-10">{question}</p>
        </motion.div>
    )
}