"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageLayout } from "@/components/ui-patterns/page-layout"
import { Button } from "@/components/ui/button"
import { Plus, MapPin } from "lucide-react"
import { InteractiveMapTab } from "@/components/locations/interactive-map-tab"
import { RoomAssignmentListTab } from "@/components/locations/room-assignment-list-tab"
import { AddRoomModal } from "@/components/locations/add-room-modal"
import { useToast } from "@/hooks/use-toast"

// Mock data for rooms
const initialRooms = [
  {
    id: "room-1",
    name: "Master Suite",
    type: "cabin",
    position: { x: 100, y: 100 },
    width: 200,
    height: 150,
    buttons: [
      { id: "BTN-001", name: "Master Suite Main", battery: 85, status: "online", lastSeen: "2 min ago" },
      { id: "BTN-002", name: "Master Suite Bathroom", battery: 72, status: "online", lastSeen: "5 min ago" },
    ],
    guest: { id: "guest-1", name: "Michael Reynolds", vip: true, checkedIn: true },
  },
  {
    id: "room-2",
    name: "VIP Suite",
    type: "cabin",
    position: { x: 350, y: 100 },
    width: 180,
    height: 150,
    buttons: [{ id: "BTN-003", name: "VIP Suite Main", battery: 65, status: "online", lastSeen: "10 min ago" }],
    guest: null,
  },
  {
    id: "room-3",
    name: "Main Salon",
    type: "common",
    position: { x: 100, y: 300 },
    width: 300,
    height: 200,
    buttons: [
      { id: "BTN-004", name: "Salon Entrance", battery: 90, status: "online", lastSeen: "1 min ago" },
      { id: "BTN-005", name: "Salon Bar", battery: 45, status: "online", lastSeen: "15 min ago" },
      { id: "BTN-006", name: "Salon Lounge", battery: 30, status: "offline", lastSeen: "2 hours ago" },
    ],
    guest: null,
  },
  {
    id: "room-4",
    name: "Dining Area",
    type: "common",
    position: { x: 450, y: 300 },
    width: 200,
    height: 200,
    buttons: [{ id: "BTN-007", name: "Dining Table", battery: 88, status: "online", lastSeen: "3 min ago" }],
    guest: null,
  },
  {
    id: "room-5",
    name: "Guest Cabin 1",
    type: "cabin",
    position: { x: 580, y: 100 },
    width: 150,
    height: 150,
    buttons: [{ id: "BTN-008", name: "Guest Cabin 1 Main", battery: 75, status: "online", lastSeen: "7 min ago" }],
    guest: { id: "guest-2", name: "Sarah Johnson", vip: false, checkedIn: true },
  },
  {
    id: "room-6",
    name: "Guest Cabin 2",
    type: "cabin",
    position: { x: 780, y: 100 },
    width: 150,
    height: 150,
    buttons: [{ id: "BTN-009", name: "Guest Cabin 2 Main", battery: 60, status: "online", lastSeen: "12 min ago" }],
    guest: { id: "guest-3", name: "Alexander Thompson", vip: true, checkedIn: false },
  },
]

// Mock data for available buttons (not assigned to any room)
const initialAvailableButtons = [
  { id: "BTN-010", name: "Unassigned Button 1", battery: 95, status: "online", lastSeen: "1 min ago" },
  { id: "BTN-011", name: "Unassigned Button 2", battery: 87, status: "online", lastSeen: "4 min ago" },
  { id: "BTN-012", name: "Unassigned Button 3", battery: 15, status: "offline", lastSeen: "3 hours ago" },
  { id: "BTN-013", name: "Unassigned Button 4", battery: 92, status: "online", lastSeen: "2 min ago" },
]

// Mock data for guests
const initialGuests = [
  { id: "guest-1", name: "Michael Reynolds", vip: true, checkedIn: true },
  { id: "guest-2", name: "Sarah Johnson", vip: false, checkedIn: true },
  { id: "guest-3", name: "Alexander Thompson", vip: true, checkedIn: false },
  { id: "guest-4", name: "Emily Davis", vip: false, checkedIn: true },
  { id: "guest-5", name: "Robert Wilson", vip: true, checkedIn: true },
  { id: "guest-6", name: "Jennifer Brown", vip: false, checkedIn: false },
]

export default function LocationsPage() {
  const [activeTab, setActiveTab] = useState("interactive-map")
  const [rooms, setRooms] = useState(initialRooms)
  const [availableButtons, setAvailableButtons] = useState(initialAvailableButtons)
  const [guests, setGuests] = useState(initialGuests)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false)
  const { toast } = useToast()

  // Handle room click
  const handleRoomClick = (room: any) => {
    setSelectedRoom(room)
  }

  // Handle button assignment
  const handleButtonAssignment = (buttonId: string, roomId: string | null, previousRoomId: string | null) => {
    // Find the button
    let button
    const updatedRooms = [...rooms]
    let updatedAvailableButtons = [...availableButtons]

    // If the button was in a room
    if (previousRoomId) {
      const previousRoom = updatedRooms.find((room) => room.id === previousRoomId)
      if (previousRoom) {
        button = previousRoom.buttons.find((btn) => btn.id === buttonId)
        // Remove button from previous room
        previousRoom.buttons = previousRoom.buttons.filter((btn) => btn.id !== buttonId)
      }
    } else {
      // Button was in available buttons
      button = updatedAvailableButtons.find((btn) => btn.id === buttonId)
      // Remove button from available buttons
      updatedAvailableButtons = updatedAvailableButtons.filter((btn) => btn.id !== buttonId)
    }

    if (!button) return

    // If assigning to a room
    if (roomId) {
      const targetRoom = updatedRooms.find((room) => room.id === roomId)
      if (targetRoom) {
        // Add button to target room
        targetRoom.buttons.push(button)
      }
    } else {
      // Add button to available buttons
      updatedAvailableButtons.push(button)
    }

    setRooms(updatedRooms)
    setAvailableButtons(updatedAvailableButtons)

    // Show success toast
    toast({
      title: "Button Reassigned",
      description: `${button.id} has been ${roomId ? `assigned to ${rooms.find((r) => r.id === roomId)?.name}` : "unassigned"}`,
    })
  }

  // Handle adding a button to a room
  const handleAddButtonToRoom = (roomId: string, buttonId: string) => {
    const button = availableButtons.find((btn) => btn.id === buttonId)
    if (!button) return

    // Remove button from available buttons
    setAvailableButtons(availableButtons.filter((btn) => btn.id !== buttonId))

    // Add button to room
    setRooms(
      rooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            buttons: [...room.buttons, button],
          }
        }
        return room
      }),
    )

    // Show success toast
    toast({
      title: "Button Added",
      description: `${button.id} has been added to ${rooms.find((r) => r.id === roomId)?.name}`,
    })
  }

  // Handle removing a button from a room
  const handleRemoveButtonFromRoom = (roomId: string, buttonId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    if (!room) return

    const button = room.buttons.find((btn) => btn.id === buttonId)
    if (!button) return

    // Remove button from room
    setRooms(
      rooms.map((r) => {
        if (r.id === roomId) {
          return {
            ...r,
            buttons: r.buttons.filter((btn) => btn.id !== buttonId),
          }
        }
        return r
      }),
    )

    // Add button to available buttons
    setAvailableButtons([...availableButtons, button])

    // Show success toast
    toast({
      title: "Button Removed",
      description: `${button.id} has been removed from ${room.name}`,
    })
  }

  // Handle guest assignment
  const handleGuestAssignment = (roomId: string, guestId: string | null) => {
    // If removing a guest
    if (!guestId) {
      setRooms(
        rooms.map((room) => {
          if (room.id === roomId) {
            return {
              ...room,
              guest: null,
            }
          }
          return room
        }),
      )
      return
    }

    // Find the guest
    const guest = guests.find((g) => g.id === guestId)
    if (!guest) return

    // Check if guest is already assigned to another room
    const guestCurrentRoom = rooms.find((room) => room.guest?.id === guestId)

    // Update rooms
    setRooms(
      rooms.map((room) => {
        // Remove guest from current room
        if (room.id === guestCurrentRoom?.id) {
          return {
            ...room,
            guest: null,
          }
        }
        // Assign guest to new room
        if (room.id === roomId) {
          return {
            ...room,
            guest,
          }
        }
        return room
      }),
    )

    // Show success toast
    toast({
      title: "Guest Assigned",
      description: `${guest.name} has been assigned to ${rooms.find((r) => r.id === roomId)?.name}`,
    })
  }

  // Handle adding a new guest
  const handleAddGuest = (newGuest: any) => {
    setGuests([...guests, newGuest])

    // Show success toast
    toast({
      title: "Guest Added",
      description: `${newGuest.name} has been added to the guest list`,
    })

    return newGuest
  }

  // Handle adding a new room
  const handleAddRoom = (newRoom: any) => {
    setRooms([...rooms, newRoom])
    setIsAddRoomModalOpen(false)

    // Show success toast
    toast({
      title: "Room Added",
      description: `${newRoom.name} has been added to the floor plan`,
    })
  }

  return (
    <PageLayout
      title="Locations"
      description="Manage room locations, button assignments, and guest assignments"
      action={
        <Button onClick={() => setIsAddRoomModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Room
        </Button>
      }
    >
      <Tabs defaultValue="interactive-map" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interactive-map" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            Interactive Map
          </TabsTrigger>
          <TabsTrigger value="room-assignment-list">Room Assignment List</TabsTrigger>
        </TabsList>

        <TabsContent value="interactive-map" className="mt-6">
          <InteractiveMapTab
            rooms={rooms}
            availableButtons={availableButtons}
            guests={guests}
            onRoomClick={handleRoomClick}
            onButtonAssignment={handleButtonAssignment}
            onAddButtonToRoom={handleAddButtonToRoom}
            onRemoveButtonFromRoom={handleRemoveButtonFromRoom}
            onGuestAssignment={handleGuestAssignment}
            onAddGuest={handleAddGuest}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
          />
        </TabsContent>

        <TabsContent value="room-assignment-list" className="mt-6">
          <RoomAssignmentListTab
            rooms={rooms}
            availableButtons={availableButtons}
            guests={guests}
            onAddButtonToRoom={handleAddButtonToRoom}
            onRemoveButtonFromRoom={handleRemoveButtonFromRoom}
            onGuestAssignment={handleGuestAssignment}
            onAddGuest={handleAddGuest}
          />
        </TabsContent>
      </Tabs>

      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onAddRoom={handleAddRoom}
        existingRooms={rooms}
      />
    </PageLayout>
  )
}
