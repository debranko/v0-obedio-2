"use client"

import { useState } from "react"
import { ModalContainer } from "@/components/ui-patterns/modal-container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Crown } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FormSection } from "@/components/ui-patterns/form-section"
import { cn } from "@/lib/utils"

interface AssignGuestModalProps {
  room: any
  isOpen: boolean
  onClose: () => void
  guests: any[]
  onGuestAssignment: (roomId: string, guestId: string | null) => void
  onAddGuest: (guest: any) => any
}

export function AssignGuestModal({
  room,
  isOpen,
  onClose,
  guests,
  onGuestAssignment,
  onAddGuest,
}: AssignGuestModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null)
  const [isAddingNewGuest, setIsAddingNewGuest] = useState(false)
  const [newGuestName, setNewGuestName] = useState("")
  const [newGuestVip, setNewGuestVip] = useState(false)

  // Filter guests based on search term
  const filteredGuests = guests.filter((guest) => {
    return guest.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Handle assign guest
  const handleAssignGuest = () => {
    if (selectedGuest) {
      onGuestAssignment(room.id, selectedGuest)
      onClose()
    }
  }

  // Handle remove guest
  const handleRemoveGuest = () => {
    onGuestAssignment(room.id, null)
  }

  // Handle add new guest
  const handleAddNewGuest = () => {
    if (newGuestName) {
      const newGuest = {
        id: `guest-${Date.now()}`,
        name: newGuestName,
        vip: newGuestVip,
        checkedIn: true,
      }

      const addedGuest = onAddGuest(newGuest)

      // Assign the new guest to the room
      onGuestAssignment(room.id, addedGuest.id)

      // Reset form and close modal
      setNewGuestName("")
      setNewGuestVip(false)
      setIsAddingNewGuest(false)
      onClose()
    }
  }

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title={`Assign Guest to ${room.name}`} size="lg">
      <div className="space-y-6">
        <FormSection title="Current Guest" description="Guest currently assigned to this room">
          {room.guest ? (
            <div className="bg-white rounded-xl p-4 border shadow-sm mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-lg flex items-center gap-2">
                    {room.guest.name}
                    {room.guest.vip && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">
                        <Crown className="h-3 w-3 mr-1" />
                        VIP
                      </Badge>
                    )}
                  </div>
                  <Badge
                    variant={room.guest.checkedIn ? "outline" : "secondary"}
                    className={room.guest.checkedIn ? "bg-green-50 text-green-700 mt-2" : "mt-2"}
                  >
                    {room.guest.checkedIn ? "Checked In" : "Not Checked In"}
                  </Badge>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                      Remove Guest
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Guest</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {room.guest.name} from {room.name}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRemoveGuest}>Remove</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground mb-4">No guest assigned to this room</div>
          )}
        </FormSection>

        {isAddingNewGuest ? (
          <FormSection title="Add New Guest" description="Create a new guest and assign to this room">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="guest-name" className="text-sm font-medium">
                  Guest Name
                </label>
                <Input
                  id="guest-name"
                  placeholder="Enter guest name"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="guest-vip"
                  checked={newGuestVip}
                  onChange={(e) => setNewGuestVip(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="guest-vip" className="text-sm font-medium">
                  VIP Guest
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingNewGuest(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNewGuest} disabled={!newGuestName}>
                  Add & Assign Guest
                </Button>
              </div>
            </div>
          </FormSection>
        ) : (
          <FormSection title="Available Guests" description="Select a guest to assign to this room">
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" className="ml-4" onClick={() => setIsAddingNewGuest(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                New Guest
              </Button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {filteredGuests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No guests found</div>
              ) : (
                filteredGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className={cn(
                      "bg-white rounded-xl p-3 border shadow-sm cursor-pointer hover:border-primary",
                      selectedGuest === guest.id ? "ring-2 ring-primary" : "",
                      guest.id === room.guest?.id ? "opacity-50 pointer-events-none" : "",
                    )}
                    onClick={() => setSelectedGuest(guest.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {guest.name}
                          {guest.vip && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700">
                              <Crown className="h-3 w-3 mr-1" />
                              VIP
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={guest.checkedIn ? "outline" : "secondary"}
                        className={guest.checkedIn ? "bg-green-50 text-green-700" : ""}
                      >
                        {guest.checkedIn ? "Checked In" : "Not Checked In"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={handleAssignGuest} disabled={!selectedGuest}>
                Assign Guest
              </Button>
            </div>
          </FormSection>
        )}
      </div>
    </ModalContainer>
  )
}
