"use client"

import { useState } from "react"
import { SectionCard } from "@/components/ui-patterns/section-card"
import { DataTable } from "@/components/ui-patterns/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Battery, BatteryLow, Signal, WifiOff, UserPlus, Plus, Crown } from "lucide-react"
import { AssignButtonModal } from "@/components/locations/assign-button-modal"
import { AssignGuestModal } from "@/components/locations/assign-guest-modal"
import { cn } from "@/lib/utils"

interface RoomAssignmentListTabProps {
  rooms: any[]
  availableButtons: any[]
  guests: any[]
  onAddButtonToRoom: (roomId: string, buttonId: string) => void
  onRemoveButtonFromRoom: (roomId: string, buttonId: string) => void
  onGuestAssignment: (roomId: string, guestId: string | null) => void
  onAddGuest: (guest: any) => any
}

export function RoomAssignmentListTab({
  rooms,
  availableButtons,
  guests,
  onAddButtonToRoom,
  onRemoveButtonFromRoom,
  onGuestAssignment,
  onAddGuest,
}: RoomAssignmentListTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [isAssignButtonModalOpen, setIsAssignButtonModalOpen] = useState(false)
  const [isAssignGuestModalOpen, setIsAssignGuestModalOpen] = useState(false)

  // Filter rooms based on search term
  const filteredRooms = rooms.filter((room) => {
    return (
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.guest?.name && room.guest.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      room.buttons.some((btn: any) => btn.id.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  // Open assign button modal
  const openAssignButtonModal = (room: any) => {
    setSelectedRoom(room)
    setIsAssignButtonModalOpen(true)
  }

  // Open assign guest modal
  const openAssignGuestModal = (room: any) => {
    setSelectedRoom(room)
    setIsAssignGuestModalOpen(true)
  }

  // Table columns
  const columns = [
    {
      key: "name",
      header: "Room Name",
      cell: (room: any) => <div className="font-medium">{room.name}</div>,
    },
    {
      key: "buttons",
      header: "Assigned Buttons",
      cell: (room: any) => (
        <div className="space-y-1">
          {room.buttons.length === 0 ? (
            <span className="text-muted-foreground text-sm">No buttons assigned</span>
          ) : (
            room.buttons.map((button: any) => (
              <div key={button.id} className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    button.status === "online" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
                  )}
                >
                  {button.status === "online" ? (
                    <Signal className="h-3 w-3 mr-1" />
                  ) : (
                    <WifiOff className="h-3 w-3 mr-1" />
                  )}
                  {button.id}
                </Badge>
                <div className="flex items-center">
                  {button.battery < 20 ? (
                    <BatteryLow className="h-3 w-3 mr-1 text-red-500" />
                  ) : (
                    <Battery className="h-3 w-3 mr-1 text-green-500" />
                  )}
                  <span className={cn("text-xs font-medium", button.battery < 20 ? "text-red-500" : "text-green-500")}>
                    {button.battery}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ),
    },
    {
      key: "guest",
      header: "Assigned Guest",
      cell: (room: any) => (
        <div>
          {room.guest ? (
            <div className="flex items-center gap-2">
              <div className="font-medium">{room.guest.name}</div>
              {room.guest.vip && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700">
                  <Crown className="h-3 w-3 mr-1" />
                  VIP
                </Badge>
              )}
              <Badge
                variant={room.guest.checkedIn ? "outline" : "secondary"}
                className={room.guest.checkedIn ? "bg-green-50 text-green-700" : ""}
              >
                {room.guest.checkedIn ? "Checked In" : "Not Checked In"}
              </Badge>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">No guest assigned</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (room: any) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => openAssignButtonModal(room)}>
            <Plus className="h-3 w-3 mr-1" />
            Assign Button
          </Button>
          <Button variant="outline" size="sm" onClick={() => openAssignGuestModal(room)}>
            <UserPlus className="h-3 w-3 mr-1" />
            Assign Guest
          </Button>
        </div>
      ),
    },
  ]

  return (
    <SectionCard title="Room Assignment List" description="Manage room assignments in a table view">
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms, guests, or buttons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <DataTable columns={columns} data={filteredRooms} emptyMessage="No rooms found" />
      </div>

      {selectedRoom && (
        <>
          <AssignButtonModal
            room={selectedRoom}
            isOpen={isAssignButtonModalOpen}
            onClose={() => setIsAssignButtonModalOpen(false)}
            availableButtons={availableButtons}
            onAddButton={onAddButtonToRoom}
            onRemoveButton={onRemoveButtonFromRoom}
          />

          <AssignGuestModal
            room={selectedRoom}
            isOpen={isAssignGuestModalOpen}
            onClose={() => setIsAssignGuestModalOpen(false)}
            guests={guests}
            onGuestAssignment={onGuestAssignment}
            onAddGuest={onAddGuest}
          />
        </>
      )}
    </SectionCard>
  )
}
