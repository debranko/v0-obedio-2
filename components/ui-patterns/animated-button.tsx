"use client"

import { type ButtonHTMLAttributes, forwardRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { buttonHoverVariants } from "@/lib/animation-utils"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={buttonHoverVariants}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Button
          className={cn("transition-all duration-200", className)}
          variant={variant}
          size={size}
          asChild={asChild}
          ref={ref}
          {...props}
        />
      </motion.div>
    )
  },
)
AnimatedButton.displayName = "AnimatedButton"
