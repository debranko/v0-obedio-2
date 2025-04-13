"use client"

import React, { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Battery, BatteryLow, Bluetooth, ChevronDown, ChevronUp, Cog, Signal, SortAsc, WifiOff } from "lucide-react"
import { SmartButtonConfigModal } from "./smart-button-config-modal"
import { ExpandableRowContent } from "./expandable-row-content"

// Mock data for Smart Buttons
const smartButtonsData = [
  {
    id: "BTN-001",
    room: "Master Cabin",
    battery: 85,
    signal: 92,
    status: "online",
    lastSeen: "2 min ago",
    ledBrightness: 70,
    ledEnabled: true,
    microphoneEnabled: true,
    microphoneGain: 80,
    microphonePattern: "cardioid",
    speakerVolume: 70,
    provisioned: "2023-05-15T10:30:00Z",
    actions: {
      singlePress: "Call Stewardess",
      doublePress: "Beverage Request",
      touch: "Room Service",
      doubleTouch: "Housekeeping",
      longPress: "Emergency",
    },
  },
  {
    id: "BTN-002",
    room: "VIP Suite 1",
    battery: 72,
    signal: 88,
    status: "online",
    lastSeen: "5 min ago",
    ledBrightness: 60,
    ledEnabled: true,
    microphoneEnabled: true,
    microphoneGain: 70,
    microphonePattern: "omnidirectional",
    speakerVolume: 65,
    provisioned: "2023-06-20T14:15:00Z",
    actions: {
      singlePress: "Call Butler",
      doublePress: "Room Service",
      touch: "Beverage Request",
      doubleTouch: "Technical Support",
      longPress: "Emergency",
    },
  },
  {
    id: "BTN-003",
    room: "Guest Cabin 1",
    battery: 15,
    signal: 76,
    status: "online",
    lastSeen: "10 min ago",
    ledBrightness: 80,
    ledEnabled: true,
    microphoneEnabled: false,
    microphoneGain: 50,
    microphonePattern: "omnidirectional",
    speakerVolume: 60,
    provisioned: "2023-07-05T09:45:00Z",
    actions: {
      singlePress: "Call Stewardess",
      doublePress: "Beverage Request",
      touch: "Room Service",
      doubleTouch: "Housekeeping",
      longPress: "Emergency",
    },
  },
  {
    id: "BTN-004",
    room: "Guest Cabin 2",
    battery: 45,
    signal: 0,
    status: "offline",
    lastSeen: "2 hours ago",
    ledBrightness: 70,
    ledEnabled: true,
    microphoneEnabled: true,
    microphoneGain: 60,
    microphonePattern: "bidirectional",
    speakerVolume: 70,
    provisioned: "2023-04-10T16:20:00Z",
    actions: {
      singlePress: "Call Stewardess",
      doublePress: "Beverage Request",
      touch: "Room Service",
      doubleTouch: "Housekeeping",
      longPress: "Emergency",
    },
  },
  {
    id: "BTN-005",
    room: "Salon",
    battery: 92,
    signal: 95,
    status: "online",
    lastSeen: "1 min ago",
    ledBrightness: 90,
    ledEnabled: true,
    microphoneEnabled: true,
    microphoneGain: 75,
    microphonePattern: "cardioid",
    speakerVolume: 80,
    provisioned: "2023-08-01T11:10:00Z",
    actions: {
      singlePress: "Call Butler",
      doublePress: "Beverage Request",
      touch: "Room Service",
      doubleTouch: "Housekeeping",
      longPress: "Emergency",
    },
  },
]

interface SmartButtonsTabProps {
  searchTerm: string
  userRole?: "admin" | "chief-stewardess" | "stewardess"
  activeFilter?: string | null
  activeSort?: string | null
}

export function SmartButtonsTab({ searchTerm, userRole = "admin", activeFilter, activeSort }: SmartButtonsTabProps) {
  const [buttons, setButtons] = useState(smartButtonsData)
  const [sortBy, setSortBy] = useState("none")
  const [selectedButton, setSelectedButton] = useState<any>(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)

  // Apply active filter and sort from URL parameters
  useEffect(() => {
    if (activeFilter || activeSort) {
      let newSortBy = "none"

      if (activeSort === "provisioned") {
        newSortBy = "provisioned"
      }

      setSortBy(newSortBy)
    }
  }, [activeFilter, activeSort])

  // Filter buttons based on search term and active filter
  const filteredButtons = buttons.filter((button) => {
    // First apply search term filter
    const matchesSearch =
      button.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      button.room.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    // Then apply active filter if present
    if (activeFilter === "low-battery") {
      return button.battery < 30
    } else if (activeFilter === "online") {
      return button.status === "online" && button.signal > 0
    }

    return true
  })

  // Sort buttons based on selected sort option
  const sortedButtons = [...filteredButtons].sort((a, b) => {
    switch (sortBy) {
      case "battery":
        return a.battery - b.battery
      case "signal":
        return b.signal - a.signal
      case "room":
        return a.room.localeCompare(b.room)
      case "provisioned":
        return new Date(b.provisioned).getTime() - new Date(a.provisioned).getTime()
      default:
        return 0
    }
  })

  // Handle button configuration
  const handleConfigureButton = (button: any) => {
    setSelectedButton(button)
    setIsConfigModalOpen(true)
  }

  // Save button configuration
  const handleSaveConfig = (updatedButton: any) => {
    setButtons(buttons.map((button) => (button.id === updatedButton.id ? updatedButton : button)))
    setIsConfigModalOpen(false)
  }

  // Toggle row expansion
  const toggleRowExpansion = (buttonId: string) => {
    setExpandedRowId(expandedRowId === buttonId ? null : buttonId)
  }

  // Update button from quick settings
  const handleUpdateButton = (updatedButton: any) => {
    setButtons(buttons.map((button) => (button.id === updatedButton.id ? updatedButton : button)))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Smart Buttons</h2>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Default</SelectItem>
              <SelectItem value="battery">Battery (Low to High)</SelectItem>
              <SelectItem value="signal">Signal (High to Low)</SelectItem>
              <SelectItem value="room">Room (A-Z)</SelectItem>
              <SelectItem value="provisioned">Recently Provisioned</SelectItem>
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
              <TableHead>Device ID</TableHead>
              <TableHead>Room / Location</TableHead>
              <TableHead>Battery</TableHead>
              <TableHead>Signal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedButtons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No smart buttons found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              sortedButtons.map((button) => (
                <React.Fragment key={button.id}>
                  <TableRow
                    className={`cursor-pointer hover:bg-muted/50 ${expandedRowId === button.id ? "bg-muted/50" : ""} ${
                      activeFilter === "low-battery" && button.battery < 30 ? "bg-amber-50" : ""
                    }`}
                    onClick={() => toggleRowExpansion(button.id)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Bluetooth className="h-4 w-4 text-primary" />
                        <span>{button.id}</span>
                        {expandedRowId === button.id ? (
                          <ChevronUp className="h-4 w-4 ml-1 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{button.room}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {button.battery < 20 ? (
                          <BatteryLow className="h-4 w-4 text-destructive" />
                        ) : (
                          <Battery className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div className="w-24">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{button.battery}%</span>
                          </div>
                          <Progress
                            value={button.battery}
                            className={button.battery < 20 ? "h-2 bg-destructive/20" : "h-2"}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {button.signal > 0 ? (
                          <Signal className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-destructive" />
                        )}
                        <div className="w-24">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{button.signal}%</span>
                          </div>
                          <Progress value={button.signal} className="h-2" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          button.status === "online"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }
                      >
                        {button.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleConfigureButton(button)
                        }}
                      >
                        <Cog className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                    </TableCell>
                  </TableRow>

                  {expandedRowId === button.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-0 border-0">
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ExpandableRowContent
                              device={button}
                              deviceType="smart-button"
                              userRole={userRole}
                              onConfigureDevice={handleConfigureButton}
                              onUpdateDevice={handleUpdateButton}
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

      {selectedButton && (
        <SmartButtonConfigModal
          button={selectedButton}
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  )
}
