"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import type { Notification } from "@/lib/notification-service"
import { getUserNotifications, markNotificationAsRead } from "@/lib/notification-service"

interface NotificationIndicatorProps {
  userId: number
}

export function NotificationIndicator({ userId }: NotificationIndicatorProps) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Fetch notifications when popover opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // In a real app, this would fetch from an API
      setNotifications(getUserNotifications(userId))
    }
    setOpen(isOpen)
  }

  // Mark notification as read
  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId)
    setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 font-medium">Notifications</div>
        <Separator />
        <ScrollArea className="h-[300px]">
          <div className="p-2">
            <AnimatePresence>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 mb-1 rounded-md cursor-pointer ${notification.read ? "bg-muted/50" : "bg-muted"}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm">{notification.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(notification.date), "HH:mm")}
                      </div>
                    </div>
                    <div className="text-sm mt-1">{notification.message}</div>
                    {!notification.read && (
                      <div className="flex items-center mt-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                        <span className="text-xs text-muted-foreground">New</span>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
                  <Bell className="h-10 w-10 mb-2 opacity-20" />
                  <p>No notifications</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
