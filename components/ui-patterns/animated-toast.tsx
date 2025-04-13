"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { toastVariants, toastTransition } from "@/lib/animation-utils"

interface AnimatedToastProps {
  children: ReactNode
  className?: string
}

export function AnimatedToast({ children, className }: AnimatedToastProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={toastVariants}
      transition={toastTransition}
      className={className}
    >
      {children}
    </motion.div>
  )
}
