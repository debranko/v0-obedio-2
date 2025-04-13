"use client"

import type { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tabVariants, tabTransition } from "@/lib/animation-utils"

interface TabItem {
  value: string
  label: ReactNode
  content: ReactNode
}

interface AnimatedTabsProps {
  defaultValue: string
  items: TabItem[]
  onChange?: (value: string) => void
  className?: string
  tabsListClassName?: string
}

export function AnimatedTabs({ defaultValue, items, onChange, className, tabsListClassName }: AnimatedTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className={className} onValueChange={onChange}>
      <TabsList className={tabsListClassName}>
        {items.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <AnimatePresence mode="wait">
        {items.map((item) => (
          <TabsContent key={item.value} value={item.value} className="mt-0">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabVariants}
              transition={tabTransition}
            >
              {item.content}
            </motion.div>
          </TabsContent>
        ))}
      </AnimatePresence>
    </Tabs>
  )
}
