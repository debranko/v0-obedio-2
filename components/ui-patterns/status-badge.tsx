import type React from "react"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "info" | "default"
  text: string
  icon?: React.ReactNode
  className?: string
}

export function StatusBadge({ status, text, icon, className }: StatusBadgeProps) {
  const getStatusClasses = () => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        getStatusClasses(),
        className,
      )}
    >
      {icon}
      {text}
    </span>
  )
}
