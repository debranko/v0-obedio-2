"use client"

import { type ReactNode, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { expandableRowVariants, expandableRowTransition } from "@/lib/animation-utils"

interface AnimatedExpandableRowProps {
  header: ReactNode
  content: ReactNode
  isExpanded?: boolean
  onToggle?: (isExpanded: boolean) => void
  className?: string
  headerClassName?: string
  contentClassName?: string
}

export function AnimatedExpandableRow({
  header,
  content,
  isExpanded: controlledIsExpanded,
  onToggle,
  className,
  headerClassName,
  contentClassName,
}: AnimatedExpandableRowProps) {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false)

  const isExpanded = controlledIsExpanded !== undefined ? controlledIsExpanded : internalIsExpanded

  const handleToggle = () => {
    const newValue = !isExpanded
    if (onToggle) {
      onToggle(newValue)
    } else {
      setInternalIsExpanded(newValue)
    }
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <div
        className={cn(
          "flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors",
          isExpanded && "border-b",
          headerClassName,
        )}
        onClick={handleToggle}
      >
        {header}
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={expandableRowVariants}
            transition={expandableRowTransition}
            className={cn("p-4", contentClassName)}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
