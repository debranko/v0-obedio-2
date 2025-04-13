"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "./page-header"
import { themeConfig } from "@/lib/theme-config"
import { pageVariants, pageTransition } from "@/lib/animation-utils"

interface PageLayoutProps {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  icon?: ReactNode
}

export function PageLayout({ title, description, action, children, icon }: PageLayoutProps) {
  return (
    <motion.div
      className={themeConfig.spacing.section}
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      transition={pageTransition}
    >
      {title && <PageHeader title={title} description={description} action={action} icon={icon} />}
      <div className={themeConfig.spacing.section}>{children}</div>
    </motion.div>
  )
}
