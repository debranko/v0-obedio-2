"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Mock data for guests
const guestData = [
  {
    id: 1,
    name: "Alexander Thompson",
    room: "Master Cabin",
    status: "Checked-In",
    isVip: true,
    notes: "Prefers Champagne upon arrival. Allergic to shellfish.",
    assignedCrew: "Emma Wilson",
  },
  {
    id: 2,
    name: "Victoria Reynolds",
    room: "VIP Suite 1",
    status: "Checked-In",
    isVip: true,
    notes: "Early riser, requests breakfast at 7 AM.",
    assignedCrew: "James Miller",
  },
  {
    id: 3,
    name: "Michael Richardson",
    room: "Guest Cabin 1",
    status: "Checked-In",
    isVip: false,
    notes: "Enjoys water sports. Scheduled for jet ski at 2 PM.",
    assignedCrew: "Sophia Clark",
  },
  {
    id: 4,
    name: "Elizabeth Harrington",
    room: "Guest Cabin 2",
    status: "Checked-In",
    isVip: false,
    notes: "Prefers still water, not sparkling.",
    assignedCrew: "Emma Wilson",
  },
  {
    id: 5,
    name: "Jonathan Williams",
    room: "Guest Cabin 3",
    status: "Checked-Out",
    isVip: false,
    notes: "Returning next month.",
    assignedCrew: "James Miller",
  },
]

// Available rooms for selection
const availableRooms = [
  "Master Cabin",
  "VIP Suite 1",
  "VIP Suite 2",
  "Guest Cabin 1",
  "Guest Cabin 2",
  "Guest Cabin 3",
  "Guest Cabin 4",
]

export default function GuestsPage() {
  const [guests, setGuests] = useState(guestData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roomFilter, setRoomFilter] = useState("all")
  const [vipFilter, setVipFilter] = useState(false)
  const [expandedGuest, setExpandedGuest] = useState<number | null>(null)
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false)
  const [newGuest, setNewGuest] = useState({
    name: "",
    room: "",
    isVip: false,
    notes: "",
  })

  // Filter guests based on search and filters
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.room.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || guest.status === statusFilter
    const matchesRoom = roomFilter === "all" || guest.room === roomFilter
    const matchesVip = !vipFilter || guest.isVip

    return matchesSearch && matchesStatus && matchesRoom && matchesVip
  })

  // Toggle expanded guest details
  const toggleExpandGuest = (id: number) => {
    setExpandedGuest(expandedGuest === id ? null : id)
  }

  // Handle adding a new guest
  const handleAddGuest = () => {
    if (newGuest.name && newGuest.room) {
      const newId = Math.max(...guests.map((g) => g.id)) + 1
      setGuests([
        ...guests,
        {
          id: newId,
          name: newGuest.name,
          room: newGuest.room,
          status: "Checked-In",
          isVip: newGuest.isVip,
          notes: newGuest.notes,
          assignedCrew: "Emma Wilson", // Default assignment
        },
      ])
      setNewGuest({ name: "", room: "", isVip: false, notes: "" })
      setIsAddGuestOpen(false)
    }
  }

  // Handle checking out a guest
  const handleCheckOut = (id: number) => {
    setGuests(guests.map((guest) => (guest.id === id ? { ...guest, status: "Checked-Out" } : guest)))
    setExpandedGuest(null)
  }

  // Handle deleting a guest
  const handleDeleteGuest = (id: number) => {
    setGuests(guests.filter((guest) => guest.id !== id))
    setExpandedGuest(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Guests</h1>
        <Dialog open={isAddGuestOpen} onOpenChange={setIsAddGuestOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Guest</DialogTitle>
              <DialogDescription>Enter the details of the new guest.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room" className="text-right">
                  Room
                </Label>
                <Select value={newGuest.room} onValueChange={(value) => setNewGuest({ ...newGuest, room: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vip" className="text-right">
                  VIP Status
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="vip"
                    checked={newGuest.isVip}
                    onCheckedChange={(checked) => setNewGuest({ ...newGuest, isVip: checked as boolean })}
                  />
                  <label
                    htmlFor="vip"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mark as VIP
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={newGuest.notes}
                  onChange={(e) => setNewGuest({ ...newGuest, notes: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddGuestOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGuest}>Add Guest</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Guest Management</CardTitle>
          <CardDescription>View and manage all guests on the property.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-[250px]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Checked-In">Checked-In</SelectItem>
                  <SelectItem value="Checked-Out">Checked-Out</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roomFilter} onValueChange={setRoomFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rooms</SelectItem>
                  {availableRooms.map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vip-filter"
                  checked={vipFilter}
                  onCheckedChange={(checked) => setVipFilter(checked as boolean)}
                />
                <label htmlFor="vip-filter" className="text-sm font-medium leading-none">
                  VIP Only
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No guests found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGuests.map((guest) => (
                    <>
                      <TableRow key={guest.id} className="cursor-pointer" onClick={() => toggleExpandGuest(guest.id)}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`/abstract-geometric-shapes.png?key=2n5bs&height=32&width=32&query=${guest.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}`}
                              />
                              <AvatarFallback>
                                {guest.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              {guest.name}
                              {guest.isVip && (
                                <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">VIP</Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{guest.room}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              guest.status === "Checked-In"
                                ? "bg-green-50 text-green-700"
                                : "bg-slate-100 text-slate-700"
                            }
                          >
                            {guest.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Guest
                              </DropdownMenuItem>
                              {guest.status === "Checked-In" && (
                                <DropdownMenuItem onClick={() => handleCheckOut(guest.id)}>
                                  <LogOut className="mr-2 h-4 w-4" />
                                  Check-Out Guest
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteGuest(guest.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Guest
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <AnimatePresence key={`animate-${guest.id}`}>
                        {expandedGuest === guest.id && (
                          <TableRow key={`expanded-${guest.id}`}>
                            <TableCell colSpan={4} className="p-0">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 bg-muted/50">
                                  <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">Profile Notes</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {guest.notes || "No notes available."}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">Assigned Crew</h4>
                                      <p className="text-sm text-muted-foreground">{guest.assignedCrew}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">Room</h4>
                                      <p className="text-sm text-muted-foreground">{guest.room}</p>
                                      {guest.status === "Checked-In" && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="mt-2"
                                          onClick={() => handleCheckOut(guest.id)}
                                        >
                                          <LogOut className="mr-2 h-4 w-4" />
                                          Check-Out
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </TableCell>
                          </TableRow>
                        )}
                      </AnimatePresence>
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
