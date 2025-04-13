"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Cpu, Plug, Signal, Wifi } from "lucide-react"
import { StatusBadge } from "@/components/ui-patterns/status-badge"
import { themeConfig } from "@/lib/theme-config"

// Mock data for Repeaters
const repeatersData = [
  {
    id: "RPT-001",
    location: "Main Deck",
    status: "online",
    connectedDevices: 12,
    powerSource: "AC",
    signal: 98,
    lastSeen: "1 min ago",
    uptime: "3 days, 4 hrs",
    ipAddress: "192.168.1.101",
    connectionMethod: "Wi-Fi",
    macAddress: "00:1A:2B:3C:4D:5E",
    firmwareVersion: "2.3.1",
    model: "LoRa Repeater Pro",
    batteryLevel: 100,
    estimatedRuntime: "8 hours",
    signalHistory: [95, 96, 98, 97, 98, 99, 98, 97, 96, 98, 99, 98],
    connectedDevicesList: [
      { id: "BTN-001", type: "Smart Button", signal: 92 },
      { id: "BTN-003", type: "Smart Button", signal: 88 },
      { id: "BTN-007", type: "Smart Button", signal: 95 },
      { id: "WCH-002", type: "Smart Watch", signal: 90 },
    ],
  },
  {
    id: "RPT-002",
    location: "Lower Deck",
    status: "online",
    connectedDevices: 8,
    powerSource: "UPS",
    signal: 92,
    lastSeen: "2 min ago",
    uptime: "5 days, 2 hrs",
    ipAddress: "192.168.1.102",
    connectionMethod: "Ethernet",
    macAddress: "00:2B:3C:4D:5E:6F",
    firmwareVersion: "2.3.1",
    model: "LoRa Repeater Pro",
    batteryLevel: 85,
    estimatedRuntime: "6 hours",
    signalHistory: [90, 91, 92, 93, 92, 91, 92, 93, 94, 92, 91, 92],
    connectedDevicesList: [
      { id: "BTN-002", type: "Smart Button", signal: 85 },
      { id: "BTN-005", type: "Smart Button", signal: 87 },
      { id: "WCH-001", type: "Smart Watch", signal: 82 },
    ],
  },
  {
    id: "RPT-003",
    location: "Upper Deck",
    status: "online",
    connectedDevices: 5,
    powerSource: "POE",
    signal: 85,
    lastSeen: "5 min ago",
    uptime: "2 days, 8 hrs",
    ipAddress: "192.168.1.103",
    connectionMethod: "Ethernet",
    macAddress: "00:3C:4D:5E:6F:7G",
    firmwareVersion: "2.3.0",
    model: "LoRa Repeater Standard",
    batteryLevel: 100,
    estimatedRuntime: "8 hours",
    signalHistory: [82, 83, 84, 85, 86, 85, 84, 83, 84, 85, 86, 85],
    connectedDevicesList: [
      { id: "BTN-004", type: "Smart Button", signal: 78 },
      { id: "BTN-006", type: "Smart Button", signal: 80 },
    ],
  },
  {
    id: "RPT-004",
    location: "Engine Room",
    status: "offline",
    connectedDevices: 0,
    powerSource: "UPS",
    signal: 0,
    lastSeen: "2 hours ago",
    uptime: "0",
    ipAddress: "192.168.1.104",
    connectionMethod: "Wi-Fi",
    macAddress: "00:4D:5E:6F:7G:8H",
    firmwareVersion: "2.3.0",
    model: "LoRa Repeater Standard",
    batteryLevel: 42,
    estimatedRuntime: "3 hours",
    signalHistory: [75, 72, 68, 65, 60, 55, 45, 30, 15, 0, 0, 0],
    connectedDevicesList: [],
  },
  {
    id: "RPT-005",
    location: "Guest Cabin Area",
    status: "online",
    connectedDevices: 7,
    powerSource: "AC",
    signal: 94,
    lastSeen: "1 min ago",
    uptime: "7 days, 12 hrs",
    ipAddress: "192.168.1.105",
    connectionMethod: "Wi-Fi",
    macAddress: "00:5E:6F:7G:8H:9I",
    firmwareVersion: "2.3.1",
    model: "LoRa Repeater Pro",
    batteryLevel: 100,
    estimatedRuntime: "8 hours",
    signalHistory: [93, 94, 95, 94, 93, 94, 95, 96, 95, 94, 93, 94],
    connectedDevicesList: [
      { id: "BTN-008", type: "Smart Button", signal: 90 },
      { id: "BTN-009", type: "Smart Button", signal: 92 },
      { id: "BTN-010", type: "Smart Button", signal: 88 },
      { id: "WCH-003", type: "Smart Watch", signal: 86 },
    ],
  },
]

interface RepeatersTableProps {
  searchTerm: string
  sortBy: string
  onViewDetails: (repeater: any) => void
}

export function RepeatersTable({ searchTerm, sortBy, onViewDetails }: RepeatersTableProps) {
  const [repeaters] = useState(repeatersData)

  // Filter repeaters based on search term
  const filteredRepeaters = repeaters.filter((repeater) => {
    return (
      repeater.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repeater.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Sort repeaters based on selected sort option
  const sortedRepeaters = [...filteredRepeaters].sort((a, b) => {
    switch (sortBy) {
      case "location":
        return a.location.localeCompare(b.location)
      case "devices":
        return b.connectedDevices - a.connectedDevices
      case "signal":
        return b.signal - a.signal
      default:
        return 0
    }
  })

  return (
    <div className={themeConfig.components.table.container}>
      <Table>
        <TableHeader className={themeConfig.components.table.header}>
          <TableRow>
            <TableHead>Repeater ID</TableHead>
            <TableHead>Room / Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Connected Devices</TableHead>
            <TableHead>Power Source</TableHead>
            <TableHead>Connection</TableHead>
            <TableHead>Signal Strength</TableHead>
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
            sortedRepeaters.map((repeater, index) => (
              <motion.tr
                key={repeater.id}
                className={themeConfig.components.table.row}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Wifi className="h-4 w-4 text-primary" />
                    <span>{repeater.id}</span>
                  </div>
                </TableCell>
                <TableCell>{repeater.location}</TableCell>
                <TableCell>
                  <StatusBadge
                    status={repeater.status as "online" | "offline"}
                    icon={repeater.status === "online" ? <Signal className="h-3 w-3" /> : undefined}
                  />
                </TableCell>
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
                      <Progress
                        value={repeater.signal}
                        className={repeater.status === "offline" ? "h-2 bg-red-100" : "h-2"}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => onViewDetails(repeater)}>
                    <Activity className="mr-2 h-4 w-4" />
                    Diagnose
                  </Button>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
