"use client"

import type { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { themeConfig } from "@/lib/theme-config"

interface ModalContainerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  onSave?: () => void
  saveLabel?: string
  cancelLabel?: string
  icon?: ReactNode
  size?: "sm" | "md" | "lg" | "xl"
}

export function ModalContainer({
  isOpen,
  onClose,
  title,
  children,
  onSave,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  icon,
  size = "md",
}: ModalContainerProps) {
  const sizeClasses = {
    sm: "sm:max-w-[500px]",
    md: "sm:max-w-[600px]",
    lg: "sm:max-w-[700px]",
    xl: "sm:max-w-[900px]",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`p-0 overflow-hidden ${sizeClasses[size]}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="p-6"
          >
            <DialogHeader className="mb-6">
              <DialogTitle className="flex items-center gap-2 text-xl">
                {icon && <span className="text-primary">{icon}</span>}
                {title}
              </DialogTitle>
            </DialogHeader>

            <div className={themeConfig.spacing.container}>{children}</div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>
                {cancelLabel}
              </Button>
              {onSave && <Button onClick={onSave}>{saveLabel}</Button>}
            </DialogFooter>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
