"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Download, Filter, Play, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useNotificationSettings } from "@/components/audio-notification-system"
import {
  type ServiceRequest,
  addNewServiceRequest,
  markRequestAsSeen,
  useNewServiceRequests,
} from "@/components/service-request-notification"
import { toast } from "@/components/ui/use-toast"

// Mock data for service requests
const requestsData = [
  {
    id: 1,
    timestamp: "2023-06-15T10:23:00",
    room: "Master Cabin",
    service: "Call for Stewardess",
    message: "Could I get some fresh towels please?",
    hasVoice: true,
    assignedCrew: "Emma Wilson",
    status: "resolved",
    responseTime: "2 min",
  },
  {
    id: 2,
    timestamp: "2023-06-15T11:45:00",
    room: "VIP Suite 1",
    service: "Beverage Request",
    message: "Would like to order champagne for 4 people",
    hasVoice: true,
    assignedCrew: "James Miller",
    status: "resolved",
    responseTime: "5 min",
  },
  {
    id: 3,
    timestamp: "2023-06-15T14:12:00",
    room: "Guest Cabin 1",
    service: "Call for Butler",
    message: null,
    hasVoice: true,
    assignedCrew: "Sophia Clark",
    status: "active",
    responseTime: null,
  },
  {
    id: 4,
    timestamp: "2023-06-15T15:30:00",
    room: "Salon",
    service: "Room Service",
    message: "Need assistance with the TV",
    hasVoice: false,
    assignedCrew: null,
    status: "active",
    responseTime: null,
  },
  {
    id: 5,
    timestamp: "2023-06-15T09:15:00",
    room: "Dining Room",
    service: "Table Service",
    message: "Ready for breakfast service",
    hasVoice: false,
    assignedCrew: "James Miller",
    status: "resolved",
    responseTime: "3 min",
  },
  {
    id: 6,
    timestamp: "2023-06-14T20:45:00",
    room: "Guest Cabin 2",
    service: "Call for Stewardess",
    message: "Need extra blankets",
    hasVoice: false,
    assignedCrew: "Emma Wilson",
    status: "resolved",
    responseTime: "4 min",
  },
  {
    id: 7,
    timestamp: "2023-06-14T18:30:00",
    room: "Sun Deck",
    service: "Beverage Request",
    message: "Would like some cocktails by the pool",
    hasVoice: true,
    assignedCrew: "James Miller",
    status: "resolved",
    responseTime: "6 min",
  },
  {
    id: 8,
    timestamp: "2023-06-15T13:10:00",
    room: "Guest Cabin 3",
    service: "Call for Butler",
    message: "Need help with luggage",
    hasVoice: false,
    assignedCrew: null,
    status: "unanswered",
    responseTime: "15+ min",
  },
]

// Available rooms for filtering
const availableRooms = [
  "All Rooms",
  "Master Cabin",
  "VIP Suite 1",
  "Guest Cabin 1",
  "Guest Cabin 2",
  "Guest Cabin 3",
  "Salon",
  "Dining Room",
  "Sun Deck",
]

// Available services for filtering
const availableServices = [
  "All Services",
  "Call for Stewardess",
  "Call for Butler",
  "Beverage Request",
  "Room Service",
  "Table Service",
]

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>(requestsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [roomFilter, setRoomFilter] = useState("All Rooms")
  const [serviceFilter, setServiceFilter] = useState("All Services")
  const [statusFilter, setStatusFilter] = useState("all")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const { settings } = useNotificationSettings()
  const newRequestsList = useNewServiceRequests()

  // Simulate new service requests coming in
  useEffect(() => {
    const simulateNewRequest = () => {
      // Random room
      const rooms = [
        "Master Cabin",
        "VIP Suite 1",
        "Guest Cabin 1",
        "Guest Cabin 2",
        "Guest Cabin 3",
        "Salon",
        "Dining Room",
        "Sun Deck",
      ]
      const room = rooms[Math.floor(Math.random() * rooms.length)]

      // Random service
      const services = ["Call for Stewardess", "Call for Butler", "Beverage Request", "Room Service", "Table Service"]
      const service = services[Math.floor(Math.random() * services.length)]

      // Random message
      const messages = [
        "Could I get some fresh towels please?",
        "Need assistance with the TV",
        "Would like to order champagne",
        "Need extra blankets",
        "Ready for breakfast service",
        "Need help with luggage",
        null,
      ]
      const message = messages[Math.floor(Math.random() * messages.length)]

      // Create new request
      const newRequest: ServiceRequest = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        room,
        service,
        message,
        hasVoice: Math.random() > 0.5,
        assignedCrew: null,
        status: "active",
        responseTime: null,
      }

      // Add to global state
      const addedRequest = addNewServiceRequest(newRequest)

      // Update local state
      setRequests((prev) => [...prev, addedRequest])
    }

    // For demo purposes, simulate a new request every 30 seconds
    // In a real app, this would come from a websocket or server-sent event
    const interval = setInterval(simulateNewRequest, 30000)

    return () => clearInterval(interval)
  }, [])

  // Mark requests as seen when viewing the active tab
  useEffect(() => {
    if (statusFilter === "active") {
      requests
        .filter((req) => req.status === "active" && req.isNew)
        .forEach((req) => {
          markRequestAsSeen(req.id)
          // Update local state
          setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, isNew: false } : r)))
        })
    }
  }, [statusFilter, requests])

  // Filter requests based on search, filters, and date
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.message && request.message.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRoom = roomFilter === "All Rooms" || request.room === roomFilter
    const matchesService = serviceFilter === "All Services" || request.service === serviceFilter
    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    const matchesDate = !date || new Date(request.timestamp).toDateString() === date.toDateString()

    return matchesSearch && matchesRoom && matchesService && matchesStatus && matchesDate
  })

  // Get requests by status
  const activeRequests = filteredRequests.filter((req) => req.status === "active")
  const resolvedRequests = filteredRequests.filter((req) => req.status === "resolved")
  const unansweredRequests = filteredRequests.filter((req) => req.status === "unanswered")

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return format(date, "MMM d, yyyy h:mm a")
  }

  // Handle accepting a request
  const handleAcceptRequest = (requestId: number) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              isNew: false,
              assignedCrew: "Emma Wilson", // In a real app, this would be the current user
            }
          : req,
      ),
    )

    // Mark as seen in global state
    markRequestAsSeen(requestId)

    toast({
      title: "Request Accepted",
      description: "You have been assigned to this service request.",
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Service Requests</h1>

      <Tabs defaultValue="active" onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active
            {activeRequests.length > 0 && (
              <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
                {activeRequests.length}
                {activeRequests.some((req) => req.isNew) && <span className="ml-1 text-red-500">*</span>}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved
            {resolvedRequests.length > 0 && (
              <Badge className="ml-2 bg-green-100 text-green-700 hover:bg-green-100">{resolvedRequests.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unanswered">
            Unanswered
            {unansweredRequests.length > 0 && (
              <Badge className="ml-2 bg-amber-100 text-amber-700 hover:bg-amber-100">{unansweredRequests.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {["active", "resolved", "unanswered"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>
                  {status === "active" && "Active Requests"}
                  {status === "resolved" && "Resolved Requests"}
                  {status === "unanswered" && "Unanswered Requests"}
                </CardTitle>
                <CardDescription>
                  {status === "active" && "View and manage all active service requests."}
                  {status === "resolved" && "History of completed service requests."}
                  {status === "unanswered" && "Requests that have exceeded response time threshold."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
                  <div className="flex items-center space-x-2 w-full md:w-auto">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full md:w-[250px]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select value={roomFilter} onValueChange={setRoomFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Room" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms.map((room) => (
                          <SelectItem key={room} value={room}>
                            {room}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={serviceFilter} onValueChange={setServiceFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Service" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableServices.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[130px] justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {date ? format(date, "MMM d, yyyy") : "Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
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

                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Assigned Crew</TableHead>
                        {status !== "active" && <TableHead>Response Time</TableHead>}
                        {status === "active" && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.filter((req) => req.status === status).length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={status !== "active" ? 6 : 6}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No {status} requests found matching your filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRequests
                          .filter((req) => req.status === status)
                          .map((request) => (
                            <TableRow
                              key={request.id}
                              className={cn(
                                request.isNew && settings.glowAnimation && "relative",
                                request.isNew && settings.glowAnimation && "ring-2 ring-accent/60 rounded-md",
                              )}
                            >
                              {request.isNew && settings.pulseEffect && (
                                <motion.div
                                  className="absolute inset-0 rounded-md bg-accent/10"
                                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                />
                              )}
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">{formatTimestamp(request.timestamp)}</span>
                                  {request.isNew && (
                                    <Badge variant="outline" className="mt-1 bg-red-50 text-red-600 border-red-200">
                                      New
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{request.room}</TableCell>
                              <TableCell>{request.service}</TableCell>
                              <TableCell>
                                {request.message ? (
                                  <div className="flex items-center">
                                    <span className="truncate max-w-[200px]">{request.message}</span>
                                    {request.hasVoice && (
                                      <Button variant="ghost" size="icon" className="ml-2 h-6 w-6">
                                        <Play className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">No message</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {request.assignedCrew ? (
                                  <div className="flex items-center space-x-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage
                                        src={`/abstract-geometric-shapes.png?height=24&width=24&query=${request.assignedCrew
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}`}
                                        alt={request.assignedCrew}
                                      />
                                      <AvatarFallback>
                                        {request.assignedCrew
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{request.assignedCrew}</span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">Unassigned</span>
                                )}
                              </TableCell>
                              {status !== "active" && (
                                <TableCell>
                                  <div className="flex items-center">
                                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                                    <span
                                      className={
                                        request.responseTime && request.responseTime.includes("+")
                                          ? "text-amber-600 font-medium"
                                          : ""
                                      }
                                    >
                                      {request.responseTime || "N/A"}
                                    </span>
                                  </div>
                                </TableCell>
                              )}
                              {status === "active" && (
                                <TableCell>
                                  {!request.assignedCrew && (
                                    <Button size="sm" variant="outline" onClick={() => handleAcceptRequest(request.id)}>
                                      Accept
                                    </Button>
                                  )}
                                </TableCell>
                              )}
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
