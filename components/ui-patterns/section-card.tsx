"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { themeConfig } from "@/lib/theme-config"

interface SectionCardProps {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  delay?: number
}

export function SectionCard({ title, description, children, footer, delay = 0 }: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      <Card className={themeConfig.components.card.container}>
        <CardHeader className={themeConfig.components.card.header}>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className={themeConfig.components.card.content}>{children}</CardContent>
        {footer && <CardFooter className={themeConfig.components.card.footer}>{footer}</CardFooter>}
      </Card>
    </motion.div>
  )
}
