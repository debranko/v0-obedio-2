"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ClearLogsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  logType: "system" | "service"
}

export function ClearLogsModal({ open, onOpenChange, logType }: ClearLogsModalProps) {
  const [isClearing, setIsClearing] = useState(false)
  const { toast } = useToast()

  const handleClearLogs = async () => {
    setIsClearing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsClearing(false)
    onOpenChange(false)

    toast({
      title: "Logs cleared",
      description: `All ${logType} logs have been successfully cleared.`,
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Clear {logType === "system" ? "System" : "Service Request"} Logs</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to clear all {logType === "system" ? "system" : "service request"} logs? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClearLogs} disabled={isClearing}>
            {isClearing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Clearing...
              </>
            ) : (
              "Clear Logs"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
