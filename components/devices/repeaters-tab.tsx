"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, ChevronDown, ChevronUp, Cpu, Plug, Radio, Signal, SortAsc, Wifi } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExpandableRowContent } from "./expandable-row-content"

// Mock data for Repeaters
const repeatersData = [
  {
    id: "RPT-001",
    room: "Main Deck",
    connectedDevices: 12,
    powerSource: "AC",
    frequency: "868",
    signal: 98,
    status: "online",
    lastSeen: "1 min ago",
    battery: 100,
    connectionMethod: "Wi-Fi",
    ipAddress: "192.168.1.101",
  },
  {
    id: "RPT-002",
    room: "Lower Deck",
    connectedDevices: 8,
    powerSource: "UPS",
    frequency: "868",
    signal: 96,
    status: "online",
    lastSeen: "1 min ago",
    battery: 100,
    connectionMethod: "Ethernet",
    ipAddress: "192.168.1.102",
  },
  {
    id: "RPT-003",
    room: "Upper Deck",
    connectedDevices: 5,
    powerSource: "POE",
    frequency: "433",
    signal: 92,
    status: "online",
    lastSeen: "5 min ago",
    battery: 100,
    connectionMethod: "Ethernet",
    ipAddress: "192.168.1.103",
  },
  {
    id: "RPT-004",
    room: "Engine Room",
    connectedDevices: 3,
    powerSource: "UPS",
    frequency: "915",
    signal: 85,
    status: "online",
    lastSeen: "10 min ago",
    battery: 100,
    connectionMethod: "Wi-Fi",
    ipAddress: "192.168.1.104",
  },
]

interface RepeatersTabProps {
  searchTerm: string
  userRole?: "admin" | "chief-stewardess" | "stewardess"
}

export function RepeatersTab({ searchTerm, userRole = "admin" }: RepeatersTabProps) {
  const [repeaters, setRepeaters] = useState(repeatersData)
  const [sortBy, setSortBy] = useState("none")
  const [selectedRepeater, setSelectedRepeater] = useState<any>(null)
  const [isDiagnoseModalOpen, setIsDiagnoseModalOpen] = useState(false)
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)

  // Filter repeaters based on search term
  const filteredRepeaters = repeaters.filter((repeater) => {
    return (
      repeater.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repeater.room.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Sort repeaters based on selected sort option
  const sortedRepeaters = [...filteredRepeaters].sort((a, b) => {
    switch (sortBy) {
      case "connected":
        return b.connectedDevices - a.connectedDevices
      case "signal":
        return b.signal - a.signal
      case "room":
        return a.room.localeCompare(b.room)
      default:
        return 0
    }
  })

  // Handle repeater diagnosis
  const handleDiagnoseRepeater = (repeater: any) => {
    setSelectedRepeater(repeater)
    setIsDiagnoseModalOpen(true)
  }

  // Toggle row expansion
  const toggleRowExpansion = (repeaterId: string) => {
    setExpandedRowId(expandedRowId === repeaterId ? null : repeaterId)
  }

  // Update repeater from quick settings
  const handleUpdateRepeater = (updatedRepeater: any) => {
    setRepeaters(repeaters.map((repeater) => (repeater.id === updatedRepeater.id ? updatedRepeater : repeater)))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Repeaters</h2>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Default</SelectItem>
              <SelectItem value="connected">Connected Devices (High to Low)</SelectItem>
              <SelectItem value="signal">Signal (High to Low)</SelectItem>
              <SelectItem value="room">Room (A-Z)</SelectItem>
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
              <TableHead>Repeater ID</TableHead>
              <TableHead>Room / Location</TableHead>
              <TableHead>Connected Devices</TableHead>
              <TableHead>Power Source</TableHead>
              <TableHead>Connection</TableHead>
              <TableHead>Signal</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRepeaters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No repeaters found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              sortedRepeaters.map((repeater) => (
                <React.Fragment key={repeater.id}>
                  <TableRow
                    className={`cursor-pointer hover:bg-muted/50 ${expandedRowId === repeater.id ? "bg-muted/50" : ""}`}
                    onClick={() => toggleRowExpansion(repeater.id)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Wifi className="h-4 w-4 text-primary" />
                        <span>{repeater.id}</span>
                        {expandedRowId === repeater.id ? (
                          <ChevronUp className="h-4 w-4 ml-1 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{repeater.room}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                        <span>{repeater.connectedDevices} devices</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          repeater.powerSource === "UPS"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : repeater.powerSource === "POE"
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : "bg-green-50 text-green-700 border-green-200"
                        }
                      >
                        <Plug className="h-3 w-3 mr-1" />
                        {repeater.powerSource}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{repeater.frequency} MHz</span>
                        <div className="flex flex-col">
                          <span className="text-sm">{repeater.connectionMethod}</span>
                          <span className="text-xs text-muted-foreground">{repeater.ipAddress}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Signal className="h-4 w-4 text-muted-foreground" />
                        <div className="w-24">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{repeater.signal}%</span>
                          </div>
                          <Progress value={repeater.signal} className="h-2" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDiagnoseRepeater(repeater)
                        }}
                      >
                        <Activity className="mr-2 h-4 w-4" />
                        Diagnose
                      </Button>
                    </TableCell>
                  </TableRow>

                  {expandedRowId === repeater.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0 border-0">
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ExpandableRowContent
                              device={repeater}
                              deviceType="repeater"
                              userRole={userRole}
                              onConfigureDevice={handleDiagnoseRepeater}
                              onUpdateDevice={handleUpdateRepeater}
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

      {/* Diagnose Repeater Modal */}
      <Dialog open={isDiagnoseModalOpen} onOpenChange={setIsDiagnoseModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Wifi className="h-5 w-5 text-primary" />
                Repeater Diagnostics
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  {selectedRepeater?.id} • {selectedRepeater?.room}
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Signal Strength</h3>
                  <div className="flex items-center space-x-2">
                    <Signal className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-medium">{selectedRepeater?.signal}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Excellent signal strength. No issues detected.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Connected Devices</h3>
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-4 w-4 text-blue-600" />
                    <span className="text-lg font-medium">{selectedRepeater?.connectedDevices}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">All devices connected and functioning normally.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Power Source</h3>
                  <div className="flex items-center space-x-2">
                    <Plug className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-medium">{selectedRepeater?.powerSource}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedRepeater?.powerSource === "UPS"
                      ? "UPS backup power available. Battery at 100%."
                      : "Connected to AC power. No issues detected."}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Frequency</h3>
                  <div className="flex items-center space-x-2">
                    <Radio className="h-4 w-4 text-purple-600" />
                    <span className="text-lg font-medium">{selectedRepeater?.frequency} MHz</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Operating on optimal frequency. No interference detected.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Network Diagnostics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Packet Loss</span>
                    <span className="text-sm font-medium text-green-600">0.02%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Latency</span>
                    <span className="text-sm font-medium text-green-600">12ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-medium">14 days, 6 hours</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsDiagnoseModalOpen(false)}>Close</Button>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
