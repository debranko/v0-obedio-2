"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

interface ResponsiveSidebarProps {
  navItems: NavItem[]
  logo?: React.ReactNode
  title?: string
}

export function ResponsiveSidebar({ navItems, logo, title = "Obedio Admin" }: ResponsiveSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return (
    <motion.div
      className={cn("relative flex flex-col h-screen border-r bg-white", isCollapsed ? "w-[70px]" : "w-[240px]")}
      animate={{ width: isCollapsed ? 70 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => !isMobile && isCollapsed && setIsCollapsed(false)}
      onMouseLeave={() => !isMobile && !isCollapsed && setIsCollapsed(true)}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b">
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              {logo}
              <span className="font-semibold text-xl">{title}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-auto">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent",
              pathname === item.href ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground",
            )}
          >
            <div className="mr-3 flex-shrink-0">{item.icon}</div>
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
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}
      </nav>
    </motion.div>
  )
}
