"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cardHoverVariants } from "@/lib/animation-utils"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: ReactNode
  title?: string
  description?: string
  footer?: ReactNode
  className?: string
  interactive?: boolean
  onClick?: () => void
}

export function AnimatedCard({
  children,
  title,
  description,
  footer,
  className,
  interactive = false,
  onClick,
}: AnimatedCardProps) {
  const CardComponent = interactive ? motion.div : Card
  const cardProps = interactive
    ? {
        whileHover: "hover",
        whileTap: "tap",
        variants: cardHoverVariants,
        transition: { type: "spring", stiffness: 300 },
        onClick,
        className: cn("cursor-pointer", className),
      }
    : { className }

  return (
    <CardComponent {...cardProps}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardComponent>
  )
}
