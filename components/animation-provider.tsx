"use client"

import type { ReactNode } from "react"
import { AnimatePresence } from "framer-motion"

interface AnimationProviderProps {
  children: ReactNode
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>
}
