"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { themeConfig } from "@/lib/theme-config"

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <motion.div
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className={themeConfig.typography.title}>{title}</h1>
        {description && <p className={`${themeConfig.typography.small} text-muted-foreground mt-1`}>{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  )
}
