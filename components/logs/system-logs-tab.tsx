"use client"

import { useState } from "react"
import { SectionCard } from "@/components/ui-patterns/section-card"
import { DataTable } from "@/components/ui-patterns/data-table"
import { StatusBadge } from "@/components/ui-patterns/status-badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { AlertTriangle, ArrowDown, ArrowUp, CalendarIcon, Filter, Info, Search, X, AlertCircle } from "lucide-react"
import { fadeIn } from "@/lib/animation-utils"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for system logs
const systemLogsData = [
  {
    id: "log-001",
    timestamp: "2023-06-15T10:23:00",
    eventType: "button_press",
    deviceId: "BTN-001",
    description: "Button pressed: Call for Stewardess",
    severity: "info",
  },
  {
    id: "log-002",
    timestamp: "2023-06-15T11:45:00",
    eventType: "button_press",
    deviceId: "BTN-002",
    description: "Button pressed: Beverage Request",
    severity: "info",
  },
  {
    id: "log-003",
    timestamp: "2023-06-15T12:30:00",
    eventType: "signal_weak",
    deviceId: "RPT-001",
    description: "Repeater signal strength dropped below 50%",
    severity: "warning",
  },
  {
    id: "log-004",
    timestamp: "2023-06-15T13:15:00",
    eventType: "battery_low",
    deviceId: "BTN-003",
    description: "Button battery level critical (15%)",
    severity: "warning",
  },
  {
    id: "log-005",
    timestamp: "2023-06-15T14:45:00",
    eventType: "connection_lost",
    deviceId: "WCH-003",
    description: "Smartwatch disconnected from network",
    severity: "error",
  },
  {
    id: "log-006",
    timestamp: "2023-06-15T16:20:00",
    eventType: "system_update",
    deviceId: "SYS-001",
    description: "System updated to version 2.3.1",
    severity: "info",
  },
  {
    id: "log-007",
    timestamp: "2023-06-16T09:10:00",
    eventType: "restart",
    deviceId: "SYS-001",
    description: "System restarted successfully",
    severity: "info",
  },
  {
    id: "log-008",
    timestamp: "2023-06-16T11:30:00",
    eventType: "error",
    deviceId: "RPT-002",
    description: "Repeater failed to connect to main system",
    severity: "error",
  },
  {
    id: "log-009",
    timestamp: "2023-06-16T14:15:00",
    eventType: "button_press",
    deviceId: "BTN-004",
    description: "Button pressed: Call for Butler",
    severity: "info",
  },
  {
    id: "log-010",
    timestamp: "2023-06-16T16:45:00",
    eventType: "battery_low",
    deviceId: "WCH-002",
    description: "Smartwatch battery level low (25%)",
    severity: "warning",
  },
]

// Available event types for filtering
const eventTypes = [
  "All Types",
  "button_press",
  "signal_weak",
  "battery_low",
  "connection_lost",
  "system_update",
  "restart",
  "error",
]

// Available devices for filtering
const devices = [
  "All Devices",
  "BTN-001",
  "BTN-002",
  "BTN-003",
  "BTN-004",
  "RPT-001",
  "RPT-002",
  "WCH-002",
  "WCH-003",
  "SYS-001",
]

export function SystemLogsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState("All Types")
  const [deviceFilter, setDeviceFilter] = useState("All Devices")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Filter logs based on search, filters, and date
  const filteredLogs = systemLogsData.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.deviceId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEventType = eventTypeFilter === "All Types" || log.eventType === eventTypeFilter
    const matchesDevice = deviceFilter === "All Devices" || log.deviceId === deviceFilter

    const matchesDate = !date || new Date(log.timestamp).toDateString() === date.toDateString()

    return matchesSearch && matchesEventType && matchesDevice && matchesDate
  })

  // Sort the filtered logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortColumn === "timestamp") {
      return sortDirection === "asc"
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }

    if (sortColumn === "severity") {
      const severityOrder = { info: 0, warning: 1, error: 2 }
      return sortDirection === "asc"
        ? severityOrder[a.severity as keyof typeof severityOrder] -
            severityOrder[b.severity as keyof typeof severityOrder]
        : severityOrder[b.severity as keyof typeof severityOrder] -
            severityOrder[a.severity as keyof typeof severityOrder]
    }

    // Default string comparison for other columns
    const aValue = a[sortColumn as keyof typeof a] || ""
    const bValue = b[sortColumn as keyof typeof b] || ""

    return sortDirection === "asc"
      ? aValue.toString().localeCompare(bValue.toString())
      : bValue.toString().localeCompare(aValue.toString())
  })

  // Handle column header click for sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new column and default to ascending
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return format(date, "MMM d, yyyy h:mm:ss a")
  }

  // Get event type display name
  const getEventTypeDisplay = (eventType: string) => {
    return eventType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Get severity badge with icon
  const getSeverityBadge = (severity: string) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              {severity === "error" && (
                <StatusBadge status="error" text="Error" icon={<AlertCircle className="h-3.5 w-3.5 mr-1" />} />
              )}
              {severity === "warning" && (
                <StatusBadge status="warning" text="Warning" icon={<AlertTriangle className="h-3.5 w-3.5 mr-1" />} />
              )}
              {severity === "info" && (
                <StatusBadge status="info" text="Info" icon={<Info className="h-3.5 w-3.5 mr-1" />} />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Severity level is based on the system's internal rule engine.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Render sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null

    return sortDirection === "asc" ? (
      <ArrowUp className="inline h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="inline h-4 w-4 ml-1" />
    )
  }

  // Define columns for the data table with new order
  const columns = [
    {
      key: "timestamp",
      header: (
        <button
          onClick={() => handleSort("timestamp")}
          className={`flex items-center ${sortColumn === "timestamp" ? "text-primary font-medium" : ""}`}
        >
          Timestamp {renderSortIndicator("timestamp")}
        </button>
      ),
      cell: (row: any) => <span className="whitespace-nowrap">{formatTimestamp(row.timestamp)}</span>,
    },
    {
      key: "deviceId",
      header: (
        <button
          onClick={() => handleSort("deviceId")}
          className={`flex items-center ${sortColumn === "deviceId" ? "text-primary font-medium" : ""}`}
        >
          Device ID {renderSortIndicator("deviceId")}
        </button>
      ),
    },
    {
      key: "eventType",
      header: (
        <button
          onClick={() => handleSort("eventType")}
          className={`flex items-center ${sortColumn === "eventType" ? "text-primary font-medium" : ""}`}
        >
          Event Type {renderSortIndicator("eventType")}
        </button>
      ),
      cell: (row: any) => <span>{getEventTypeDisplay(row.eventType)}</span>,
    },
    {
      key: "description",
      header: (
        <button
          onClick={() => handleSort("description")}
          className={`flex items-center ${sortColumn === "description" ? "text-primary font-medium" : ""}`}
        >
          Description {renderSortIndicator("description")}
        </button>
      ),
    },
    {
      key: "severity",
      header: (
        <button
          onClick={() => handleSort("severity")}
          className={`flex items-center ${sortColumn === "severity" ? "text-primary font-medium" : ""}`}
        >
          Severity {renderSortIndicator("severity")}
        </button>
      ),
      cell: (row: any) => getSeverityBadge(row.severity),
    },
  ]

  return (
    <motion.div {...fadeIn}>
      <SectionCard>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-[250px]"
            />
            {searchTerm && (
              <Button variant="ghost" size="icon" onClick={() => setSearchTerm("")} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "All Types" ? type : getEventTypeDisplay(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={deviceFilter} onValueChange={setDeviceFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Device ID" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((device) => (
                  <SelectItem key={device} value={device}>
                    {device}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMM d, yyyy") : "Select Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date)
                    setIsCalendarOpen(false)
                  }}
                  initialFocus
                />
                {date && (
                  <div className="p-2 border-t">
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => setDate(undefined)}>
                      Clear
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => {
                setSearchTerm("")
                setEventTypeFilter("All Types")
                setDeviceFilter("All Devices")
                setDate(undefined)
              }}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <DataTable columns={columns} data={sortedLogs} emptyMessage="No system logs found matching your filters." />
        </div>
      </SectionCard>
    </motion.div>
  )
}
