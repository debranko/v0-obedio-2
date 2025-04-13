"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  UserCog,
  Smartphone,
  MapPin,
  Bell,
  FileText,
  LifeBuoy,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNewServiceRequests } from "@/components/service-request-notification"
import { useNotificationSettings } from "@/components/audio-notification-system"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const newRequests = useNewServiceRequests()
  const { settings } = useNotificationSettings()

  // Count of new service requests
  const newRequestsCount = newRequests.length

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Guests",
      href: "/guests",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Crew",
      href: "/crew",
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      title: "Devices",
      href: "/devices",
      icon: <Smartphone className="h-5 w-5" />,
    },
    {
      title: "Locations",
      href: "/locations",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      title: "Service Requests",
      href: "/service-requests",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Logs",
      href: "/logs",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Support",
      href: "/support",
      icon: <LifeBuoy className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <motion.div
      className={cn("relative flex flex-col h-screen border-r bg-background", isCollapsed ? "w-[70px]" : "w-[240px]")}
      animate={{ width: isCollapsed ? 70 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => isCollapsed && setIsCollapsed(false)}
      onMouseLeave={() => !isCollapsed && setIsCollapsed(true)}
    >
      <div className="flex items-center justify-between p-4 h-16">
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-semibold text-xl"
            >
              Obedio Admin
            </motion.div>
          )}
        </AnimatePresence>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-auto">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent",
              pathname === item.href ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground",
            )}
          >
            <div className="mr-3 flex-shrink-0 relative">
              {item.icon}
              {item.href === "/service-requests" && newRequestsCount > 0 && settings.sidebarBadge && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
                  {newRequestsCount}
                </Badge>
              )}
            </div>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="truncate"
                >
                  {item.title}
                  {item.href === "/service-requests" && newRequestsCount > 0 && settings.sidebarBadge && (
                    <Badge className="ml-2 bg-red-500 text-white">{newRequestsCount}</Badge>
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}
      </nav>
    </motion.div>
  )
}
