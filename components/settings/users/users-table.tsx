"use client"

import React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, UserCog } from "lucide-react"
import { UserExpandableRow } from "./user-expandable-row"
import { expandableRowVariants, expandableRowTransition } from "@/lib/animation-utils"

// Mock data for users/crew members
const mockUsers = [
  {
    id: "user-1",
    name: "Emma Thompson",
    role: "Admin",
    email: "emma@obedio.com",
    status: "active",
    devices: ["Smart Watch #103"],
    location: "Bridge Deck",
    lastLogin: "Today, 10:23 AM",
    dateAdded: "Jan 15, 2023",
    permissions: {
      dashboard: { view: true, modify: true, assign: true },
      devices: { view: true, modify: true, assign: true },
      guests: { view: true, modify: true, assign: true },
      logs: { view: true, modify: true, assign: true },
      settings: { view: true, modify: true, assign: true },
    },
    sessions: [
      { device: "iPhone 13", ip: "192.168.1.45", time: "Current session" },
      { device: "MacBook Pro", ip: "192.168.1.23", time: "2 hours ago" },
    ],
  },
  {
    id: "user-2",
    name: "Sophia Martinez",
    role: "Chief Stewardess",
    email: "sophia@obedio.com",
    status: "active",
    devices: ["Smart Watch #104", "Smart Button #201"],
    location: "Main Deck",
    lastLogin: "Yesterday, 18:45 PM",
    dateAdded: "Mar 3, 2023",
    permissions: {
      dashboard: { view: true, modify: true, assign: false },
      devices: { view: true, modify: true, assign: false },
      guests: { view: true, modify: true, assign: true },
      logs: { view: true, modify: false, assign: false },
      settings: { view: false, modify: false, assign: false },
    },
    sessions: [{ device: "iPad Pro", ip: "192.168.1.67", time: "5 hours ago" }],
  },
  {
    id: "user-3",
    name: "James Wilson",
    role: "Steward",
    email: "james@obedio.com",
    status: "active",
    devices: ["Smart Watch #105"],
    location: "Lower Deck",
    lastLogin: "Today, 08:12 AM",
    dateAdded: "Apr 17, 2023",
    permissions: {
      dashboard: { view: true, modify: false, assign: false },
      devices: { view: true, modify: false, assign: false },
      guests: { view: true, modify: true, assign: false },
      logs: { view: false, modify: false, assign: false },
      settings: { view: false, modify: false, assign: false },
    },
    sessions: [{ device: "Android Phone", ip: "192.168.1.89", time: "Current session" }],
  },
  {
    id: "user-4",
    name: "Olivia Chen",
    role: "Junior Stewardess",
    email: "olivia@obedio.com",
    status: "inactive",
    devices: [],
    location: "Guest Deck",
    lastLogin: "3 days ago",
    dateAdded: "Jun 5, 2023",
    permissions: {
      dashboard: { view: true, modify: false, assign: false },
      devices: { view: true, modify: false, assign: false },
      guests: { view: true, modify: false, assign: false },
      logs: { view: false, modify: false, assign: false },
      settings: { view: false, modify: false, assign: false },
    },
    sessions: [],
  },
]

interface UsersTableProps {
  onEditPermissions: (user: any) => void
}

export function UsersTable({ onEditPermissions }: UsersTableProps) {
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)

  const toggleExpand = (userId: string) => {
    setExpandedUserId(expandedUserId === userId ? null : userId)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "Chief Stewardess":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Steward":
      case "Stewardess":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Junior Stewardess":
      case "Junior Steward":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 hover:bg-green-200"
      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email / Login</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockUsers.map((user) => (
            <React.Fragment key={user.id}>
              <TableRow
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleExpand(user.id)}
              >
                <TableCell className="font-medium flex items-center gap-2">
                  {expandedUserId === user.id ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  {user.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                    {user.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditPermissions(user)
                    }}
                  >
                    <UserCog className="h-4 w-4 mr-2" />
                    Manage Access
                  </Button>
                </TableCell>
              </TableRow>

              <AnimatePresence>
                {expandedUserId === user.id && (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={expandableRowVariants}
                        transition={expandableRowTransition}
                      >
                        <UserExpandableRow user={user} onEditPermissions={() => onEditPermissions(user)} />
                      </motion.div>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
