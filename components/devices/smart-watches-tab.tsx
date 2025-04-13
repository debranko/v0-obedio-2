"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Battery, BatteryCharging, BatteryLow, ChevronDown, ChevronUp, Cog, SortAsc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SmartWatchConfigModal } from "./smart-watch-config-modal"
import { ExpandableRowContent } from "./expandable-row-content"

// Mock data for Smart Watches
const smartWatchesData = [
  {
    id: "WCH-001",
    crewMember: {
      name: "Emma Wilson",
      role: "Chief Stewardess",
      avatar: "/placeholder.svg?key=ro8m9",
      onDuty: true,
    },
    battery: 45,
    signal: 95,
    status: "online",
    lastSeen: "1 min ago",
    lastSeenTimestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    charging: false,
    room: "Staff Area",
    shakeToCallEnabled: true,
    settings: {
      language: "english",
      timeFormat: "24h",
      brightness: 70,
      autoLock: true,
      lockDelay: 10,
      lowBatteryAlert: true,
      firmwareVersion: "2.3.1",
      batteryAlerts: true,
      dutyAlerts: true,
      dutyReminderTime: "15min",
      dutyReminderMethod: "vibration",
      gpsTracking: true,
      vibrationIntensity: "medium",
      theme: "light",
      primaryColor: "blue",
    },
  },
  {
    id: "WCH-002",
    crewMember: {
      name: "James Miller",
      role: "Butler",
      avatar: "/placeholder.svg?key=nfv1w",
      onDuty: true,
    },
    battery: 68,
    signal: 90,
    status: "online",
    lastSeen: "3 min ago",
    lastSeenTimestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    charging: false,
    room: "Main Deck",
    shakeToCallEnabled: false,
    settings: {
      language: "english",
      timeFormat: "12h",
      brightness: 65,
      autoLock: true,
      lockDelay: 5,
      lowBatteryAlert: true,
      firmwareVersion: "2.3.1",
      batteryAlerts: true,
      dutyAlerts: true,
      dutyReminderTime: "30min",
      dutyReminderMethod: "visual",
      gpsTracking: true,
      vibrationIntensity: "high",
      theme: "dark",
      primaryColor: "purple",
    },
  },
  {
    id: "WCH-003",
    crewMember: {
      name: "Sophia Clark",
      role: "Stewardess",
      avatar: "/placeholder.svg?key=u87m0",
      onDuty: false,
    },
    battery: 22,
    signal: 0,
    status: "offline",
    lastSeen: "2 hours ago",
    lastSeenTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    charging: true,
    room: "Staff Quarters",
    shakeToCallEnabled: true,
    settings: {
      language: "french",
      timeFormat: "24h",
      brightness: 50,
      autoLock: false,
      lockDelay: 15,
      lowBatteryAlert: false,
      firmwareVersion: "2.3.0",
      batteryAlerts: false,
      dutyAlerts: true,
      dutyReminderTime: "1h",
      dutyReminderMethod: "both",
      gpsTracking: false,
      vibrationIntensity: "low",
      theme: "light",
      primaryColor: "teal",
    },
  },
  {
    id: "WCH-004",
    crewMember: {
      name: "Michael Brown",
      role: "Chef",
      avatar: "/placeholder.svg?key=7yt5r",
      onDuty: true,
    },
    battery: 87,
    signal: 92,
    status: "online",
    lastSeen: "5 min ago",
    lastSeenTimestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    charging: false,
    room: "Kitchen",
    shakeToCallEnabled: true,
    settings: {
      language: "english",
      timeFormat: "12h",
      brightness: 80,
      autoLock: true,
      lockDelay: 20,
      lowBatteryAlert: true,
      firmwareVersion: "2.3.1",
      batteryAlerts: true,
      dutyAlerts: true,
      dutyReminderTime: "15min",
      dutyReminderMethod: "both",
      gpsTracking: true,
      vibrationIntensity: "medium",
      theme: "dark",
      primaryColor: "blue",
    },
  },
  {
    id: "WCH-005",
    crewMember: {
      name: "Olivia Davis",
      role: "Stewardess",
      avatar: "/placeholder.svg?key=p9o2i",
      onDuty: false,
    },
    battery: 34,
    signal: 88,
    status: "online",
    lastSeen: "10 min ago",
    lastSeenTimestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    charging: false,
    room: "Upper Deck",
    shakeToCallEnabled: false,
    settings: {
      language: "italian",
      timeFormat: "24h",
      brightness: 60,
      autoLock: true,
      lockDelay: 10,
      lowBatteryAlert: true,
      firmwareVersion: "2.3.1",
      batteryAlerts: true,
      dutyAlerts: false,
      dutyReminderTime: "30min",
      dutyReminderMethod: "vibration",
      gpsTracking: true,
      vibrationIntensity: "low",
      theme: "light",
      primaryColor: "green",
    },
  },
]

// Available crew members for assignment
const availableCrewMembers = [
  {
    id: 1,
    name: "Emma Wilson",
    role: "Chief Stewardess",
    avatar: "/placeholder.svg?key=ro8m9",
    onDuty: true,
  },
  {
    id: 2,
    name: "James Miller",
    role: "Butler",
    avatar: "/placeholder.svg?key=nfv1w",
    onDuty: true,
  },
  {
    id: 3,
    name: "Sophia Clark",
    role: "Stewardess",
    avatar: "/placeholder.svg?key=u87m0",
    onDuty: false,
  },
  {
    id: 4,
    name: "Michael Brown",
    role: "Chef",
    avatar: "/placeholder.svg?key=7yt5r",
    onDuty: true,
  },
  {
    id: 5,
    name: "Olivia Davis",
    role: "Stewardess",
    avatar: "/placeholder.svg?key=p9o2i",
    onDuty: false,
  },
  {
    id: 6,
    name: "William Thompson",
    role: "Deckhand",
    avatar: "/placeholder.svg?key=l3k4j",
    onDuty: false,
  },
  {
    id: 7,
    name: "Daniel Roberts",
    role: "Captain",
    avatar: "/placeholder.svg?key=m5n6b",
    onDuty: true,
  },
]

interface SmartWatchesTabProps {
  searchTerm: string
  userRole?: "admin" | "chief-stewardess" | "stewardess"
  activeFilter?: string | null
  activeSort?: string | null
}

export function SmartWatchesTab({ searchTerm, userRole = "admin", activeFilter, activeSort }: SmartWatchesTabProps) {
  const [watches, setWatches] = useState(smartWatchesData)
  const [sortBy, setSortBy] = useState("none")
  const [selectedWatch, setSelectedWatch] = useState<any>(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)

  // Apply active filter and sort from URL parameters
  useEffect(() => {
    if (activeFilter || activeSort) {
      let newSortBy = "none"

      if (activeSort === "last-seen") {
        newSortBy = "last-seen"
      }

      setSortBy(newSortBy)
    }
  }, [activeFilter, activeSort])

  // Filter watches based on search term and active filter
  const filteredWatches = watches.filter((watch) => {
    // First apply search term filter
    const matchesSearch =
      watch.crewMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      watch.crewMember.role.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    // Then apply active filter if present
    if (activeFilter === "active") {
      return watch.status === "online"
    } else if (activeFilter === "charging") {
      return watch.charging === true
    }

    return true
  })

  // Sort watches based on selected sort option
  const sortedWatches = [...filteredWatches].sort((a, b) => {
    switch (sortBy) {
      case "battery":
        return a.battery - b.battery
      case "name":
        return a.crewMember.name.localeCompare(b.crewMember.name)
      case "role":
        return a.crewMember.role.localeCompare(b.crewMember.role)
      case "last-seen":
        return new Date(a.lastSeenTimestamp).getTime() - new Date(b.lastSeenTimestamp).getTime()
      default:
        return 0
    }
  })

  // Handle watch configuration
  const handleConfigureWatch = (watch: any) => {
    setSelectedWatch(watch)
    setIsConfigModalOpen(true)
  }

  // Save watch configuration
  const handleSaveConfig = (updatedWatch: any) => {
    setWatches(watches.map((watch) => (watch.id === updatedWatch.id ? updatedWatch : watch)))
    setIsConfigModalOpen(false)
  }

  // Toggle row expansion
  const toggleRowExpansion = (watchId: string) => {
    setExpandedRowId(expandedRowId === watchId ? null : watchId)
  }

  // Update watch from quick settings
  const handleUpdateWatch = (updatedWatch: any) => {
    setWatches(watches.map((watch) => (watch.id === updatedWatch.id ? updatedWatch : watch)))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Smart Watches</h2>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Default</SelectItem>
              <SelectItem value="battery">Battery (Low to High)</SelectItem>
              <SelectItem value="name">Crew Name (A-Z)</SelectItem>
              <SelectItem value="role">Role (A-Z)</SelectItem>
              <SelectItem value="last-seen">Last Seen (Oldest First)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <SortAsc className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crew Member</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Battery</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedWatches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No smart watches found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              sortedWatches.map((watch, index) => (
                <React.Fragment key={watch.id}>
                  <TableRow
                    className={`cursor-pointer hover:bg-muted/50 ${expandedRowId === watch.id ? "bg-muted/50" : ""} ${
                      activeFilter === "charging" && watch.charging ? "bg-amber-50" : ""
                    }`}
                    onClick={() => toggleRowExpansion(watch.id)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={watch.crewMember.avatar || "/placeholder.svg"}
                            alt={watch.crewMember.name}
                          />
                          <AvatarFallback>
                            {watch.crewMember.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center">
                            {watch.crewMember.name}
                            {expandedRowId === watch.id ? (
                              <ChevronUp className="h-4 w-4 ml-1 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{watch.crewMember.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          watch.status === "online"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {watch.status === "online" ? "Online" : "Offline"}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">Last seen: {watch.lastSeen}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {watch.charging ? (
                          <BatteryCharging className="h-4 w-4 text-green-600" />
                        ) : watch.battery < 20 ? (
                          <BatteryLow className="h-4 w-4 text-destructive" />
                        ) : (
                          <Battery className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div className="w-24">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{watch.battery}%</span>
                            {watch.charging && <span className="text-green-600">Charging</span>}
                          </div>
                          <Progress
                            value={watch.battery}
                            className={
                              watch.charging ? "h-2 bg-green-100" : watch.battery < 20 ? "h-2 bg-destructive/20" : "h-2"
                            }
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleConfigureWatch(watch)
                        }}
                      >
                        <Cog className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                    </TableCell>
                  </TableRow>

                  {expandedRowId === watch.id && (
                    <TableRow>
                      <TableCell colSpan={4} className="p-0 border-0">
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ExpandableRowContent
                              device={watch}
                              deviceType="smart-watch"
                              userRole={userRole}
                              onConfigureDevice={handleConfigureWatch}
                              onUpdateDevice={handleUpdateWatch}
                            />
                          </motion.div>
                        </AnimatePresence>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedWatch && (
        <SmartWatchConfigModal
          watch={selectedWatch}
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          onSave={handleSaveConfig}
          availableCrewMembers={availableCrewMembers}
        />
      )}
    </div>
  )
}
