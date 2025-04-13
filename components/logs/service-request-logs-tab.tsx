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
import { ArrowDown, ArrowUp, CalendarIcon, CheckCircle, Filter, Search, X, AlertTriangle, XCircle } from "lucide-react"
import { fadeIn } from "@/lib/animation-utils"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for service request logs
const serviceRequestLogsData = [
  {
    id: "req-001",
    timestamp: "2023-06-15T10:23:00",
    room: "Master Cabin",
    serviceType: "stewardess",
    assignedCrew: "Emma Wilson",
    responseTime: 3,
    status: "resolved",
  },
  {
    id: "req-002",
    timestamp: "2023-06-15T11:45:00",
    room: "VIP Suite 1",
    serviceType: "beverage",
    assignedCrew: "James Miller",
    responseTime: 5,
    status: "resolved",
  },
  {
    id: "req-003",
    timestamp: "2023-06-15T14:12:00",
    room: "Guest Cabin 1",
    serviceType: "butler",
    assignedCrew: "Robert Johnson",
    responseTime: 4,
    status: "resolved",
  },
  {
    id: "req-004",
    timestamp: "2023-06-15T15:30:00",
    room: "Salon",
    serviceType: "room_service",
    assignedCrew: "Sarah Davis",
    responseTime: 7,
    status: "resolved",
  },
  {
    id: "req-005",
    timestamp: "2023-06-16T09:45:00",
    room: "Master Cabin",
    serviceType: "housekeeping",
    assignedCrew: "Lisa Brown",
    responseTime: 10,
    status: "resolved",
  },
  {
    id: "req-006",
    timestamp: "2023-06-16T11:20:00",
    room: "VIP Suite 2",
    serviceType: "stewardess",
    assignedCrew: "Emma Wilson",
    responseTime: 15,
    status: "escalated",
  },
  {
    id: "req-007",
    timestamp: "2023-06-16T13:05:00",
    room: "Guest Cabin 2",
    serviceType: "beverage",
    assignedCrew: null,
    responseTime: null,
    status: "missed",
  },
  {
    id: "req-008",
    timestamp: "2023-06-16T14:30:00",
    room: "Dining Room",
    serviceType: "butler",
    assignedCrew: "Robert Johnson",
    responseTime: 2,
    status: "resolved",
  },
  {
    id: "req-009",
    timestamp: "2023-06-16T16:15:00",
    room: "VIP Suite 1",
    serviceType: "room_service",
    assignedCrew: "Sarah Davis",
    responseTime: 8,
    status: "resolved",
  },
  {
    id: "req-010",
    timestamp: "2023-06-16T18:00:00",
    room: "Guest Cabin 3",
    serviceType: "housekeeping",
    assignedCrew: null,
    responseTime: null,
    status: "missed",
  },
]

// Available service types for filtering
const serviceTypes = ["All Types", "stewardess", "butler", "beverage", "room_service", "housekeeping"]

// Available rooms for filtering
const rooms = [
  "All Rooms",
  "Master Cabin",
  "VIP Suite 1",
  "VIP Suite 2",
  "Guest Cabin 1",
  "Guest Cabin 2",
  "Guest Cabin 3",
  "Salon",
  "Dining Room",
]

// Available crew members for filtering
const crewMembers = ["All Crew", "Emma Wilson", "James Miller", "Robert Johnson", "Sarah Davis", "Lisa Brown"]

// Available statuses for filtering
const statuses = ["All Statuses", "resolved", "escalated", "missed"]

export function ServiceRequestLogsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceTypeFilter, setServiceTypeFilter] = useState("All Types")
  const [roomFilter, setRoomFilter] = useState("All Rooms")
  const [crewFilter, setCrewFilter] = useState("All Crew")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Filter logs based on search, filters, and date
  const filteredLogs = serviceRequestLogsData.filter((log) => {
    const matchesSearch =
      log.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.assignedCrew && log.assignedCrew.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesServiceType = serviceTypeFilter === "All Types" || log.serviceType === serviceTypeFilter
    const matchesRoom = roomFilter === "All Rooms" || log.room === roomFilter
    const matchesCrew = crewFilter === "All Crew" || log.assignedCrew === crewFilter
    const matchesStatus = statusFilter === "All Statuses" || log.status === statusFilter

    const matchesDate = !date || new Date(log.timestamp).toDateString() === date.toDateString()

    return matchesSearch && matchesServiceType && matchesRoom && matchesCrew && matchesStatus && matchesDate
  })

  // Sort the filtered logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortColumn === "timestamp") {
      return sortDirection === "asc"
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }

    if (sortColumn === "responseTime") {
      // Handle null response times
      if (a.responseTime === null && b.responseTime === null) return 0
      if (a.responseTime === null) return sortDirection === "asc" ? -1 : 1
      if (b.responseTime === null) return sortDirection === "asc" ? 1 : -1

      return sortDirection === "asc" ? a.responseTime - b.responseTime : b.responseTime - a.responseTime
    }

    if (sortColumn === "status") {
      const statusOrder = { resolved: 0, escalated: 1, missed: 2 }
      return sortDirection === "asc"
        ? statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder]
        : statusOrder[b.status as keyof typeof statusOrder] - statusOrder[a.status as keyof typeof statusOrder]
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

  // Get service type display name
  const getServiceTypeDisplay = (serviceType: string) => {
    return serviceType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Get status badge with icon
  const getStatusBadge = (status: string) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              {status === "resolved" && (
                <StatusBadge status="success" text="Resolved" icon={<CheckCircle className="h-3.5 w-3.5 mr-1" />} />
              )}
              {status === "escalated" && (
                <StatusBadge status="warning" text="Escalated" icon={<AlertTriangle className="h-3.5 w-3.5 mr-1" />} />
              )}
              {status === "missed" && (
                <StatusBadge status="error" text="Missed" icon={<XCircle className="h-3.5 w-3.5 mr-1" />} />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Status is determined by crew response and resolution time.</p>
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

  // Define columns for the data table
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
      key: "room",
      header: (
        <button
          onClick={() => handleSort("room")}
          className={`flex items-center ${sortColumn === "room" ? "text-primary font-medium" : ""}`}
        >
          Room {renderSortIndicator("room")}
        </button>
      ),
    },
    {
      key: "serviceType",
      header: (
        <button
          onClick={() => handleSort("serviceType")}
          className={`flex items-center ${sortColumn === "serviceType" ? "text-primary font-medium" : ""}`}
        >
          Service Type {renderSortIndicator("serviceType")}
        </button>
      ),
      cell: (row: any) => <span>{getServiceTypeDisplay(row.serviceType)}</span>,
    },
    {
      key: "assignedCrew",
      header: (
        <button
          onClick={() => handleSort("assignedCrew")}
          className={`flex items-center ${sortColumn === "assignedCrew" ? "text-primary font-medium" : ""}`}
        >
          Assigned Crew {renderSortIndicator("assignedCrew")}
        </button>
      ),
      cell: (row: any) => (
        <span>{row.assignedCrew || <span className="text-muted-foreground">Not Assigned</span>}</span>
      ),
    },
    {
      key: "responseTime",
      header: (
        <button
          onClick={() => handleSort("responseTime")}
          className={`flex items-center ${sortColumn === "responseTime" ? "text-primary font-medium" : ""}`}
        >
          Response Time {renderSortIndicator("responseTime")}
        </button>
      ),
      cell: (row: any) => (
        <span>
          {row.responseTime !== null ? `${row.responseTime} min` : <span className="text-muted-foreground">N/A</span>}
        </span>
      ),
    },
    {
      key: "status",
      header: (
        <button
          onClick={() => handleSort("status")}
          className={`flex items-center ${sortColumn === "status" ? "text-primary font-medium" : ""}`}
        >
          Status {renderSortIndicator("status")}
        </button>
      ),
      cell: (row: any) => getStatusBadge(row.status),
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
            <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "All Types" ? type : getServiceTypeDisplay(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={roomFilter} onValueChange={setRoomFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room} value={room}>
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={crewFilter} onValueChange={setCrewFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Assigned Crew" />
              </SelectTrigger>
              <SelectContent>
                {crewMembers.map((crew) => (
                  <SelectItem key={crew} value={crew}>
                    {crew}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "All Statuses" ? status : status.charAt(0).toUpperCase() + status.slice(1)}
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
                setServiceTypeFilter("All Types")
                setRoomFilter("All Rooms")
                setCrewFilter("All Crew")
                setStatusFilter("All Statuses")
                setDate(undefined)
              }}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={sortedLogs}
            emptyMessage="No service request logs found matching your filters."
          />
        </div>
      </SectionCard>
    </motion.div>
  )
}
