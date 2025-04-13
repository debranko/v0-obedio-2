"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModalContainer } from "@/components/ui-patterns/modal-container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Battery, BatteryLow, Signal, WifiOff, Plus, Trash2, UserPlus, Crown } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormSection } from "@/components/ui-patterns/form-section"
import { cn } from "@/lib/utils"

interface RoomDetailsModalProps {
  room: any
  isOpen: boolean
  onClose: () => void
  availableButtons: any[]
  guests: any[]
  onAddButton: (roomId: string, buttonId: string) => void
  onRemoveButton: (roomId: string, buttonId: string) => void
  onGuestAssignment: (roomId: string, guestId: string | null) => void
  onAddGuest: (guest: any) => any
}

export function RoomDetailsModal({
  room,
  isOpen,
  onClose,
  availableButtons,
  guests,
  onAddButton,
  onRemoveButton,
  onGuestAssignment,
  onAddGuest,
}: RoomDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("buttons")
  const [buttonSearchTerm, setButtonSearchTerm] = useState("")
  const [guestSearchTerm, setGuestSearchTerm] = useState("")
  const [selectedButton, setSelectedButton] = useState("")
  const [selectedGuest, setSelectedGuest] = useState("")
  const [buttonToRemove, setButtonToRemove] = useState<string | null>(null)
  const [newGuestName, setNewGuestName] = useState("")
  const [newGuestVip, setNewGuestVip] = useState(false)
  const [isAddingNewGuest, setIsAddingNewGuest] = useState(false)

  // Filter buttons based on search term
  const filteredButtons = room.buttons.filter((button: any) => {
    return (
      button.id.toLowerCase().includes(buttonSearchTerm.toLowerCase()) ||
      button.name.toLowerCase().includes(buttonSearchTerm.toLowerCase())
    )
  })

  // Filter guests based on search term
  const filteredGuests = guests.filter((guest) => {
    return guest.name.toLowerCase().includes(guestSearchTerm.toLowerCase())
  })

  // Handle add button
  const handleAddButton = () => {
    if (selectedButton) {
      onAddButton(room.id, selectedButton)
      setSelectedButton("")
    }
  }

  // Handle remove button
  const handleRemoveButton = () => {
    if (buttonToRemove) {
      onRemoveButton(room.id, buttonToRemove)
      setButtonToRemove(null)
    }
  }

  // Handle assign guest
  const handleAssignGuest = () => {
    if (selectedGuest) {
      onGuestAssignment(room.id, selectedGuest)
      setSelectedGuest("")
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

      // Reset form
      setNewGuestName("")
      setNewGuestVip(false)
      setIsAddingNewGuest(false)
    }
  }

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title={`Room Details: ${room.name}`} size="lg">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buttons">Assign Buttons</TabsTrigger>
          <TabsTrigger value="guest">Assign Guest</TabsTrigger>
        </TabsList>

        <TabsContent value="buttons" className="mt-6">
          <FormSection title="Assigned Buttons" description="Buttons currently assigned to this room">
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search buttons..."
                  value={buttonSearchTerm}
                  onChange={(e) => setButtonSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Select value={selectedButton} onValueChange={setSelectedButton}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select button to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableButtons.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No available buttons
                      </SelectItem>
                    ) : (
                      availableButtons.map((button) => (
                        <SelectItem key={button.id} value={button.id}>
                          {button.id} - {button.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddButton} disabled={!selectedButton}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Button
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {filteredButtons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No buttons assigned to this room</div>
              ) : (
                filteredButtons.map((button: any, index: number) => (
                  <div
                    key={button.id}
                    className={cn(
                      "bg-white rounded-xl p-3 border shadow-sm",
                      button.status === "online" ? "border-green-200" : "border-red-200",
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{button.id}</div>
                        <div className="text-sm text-muted-foreground">{button.name}</div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setButtonToRemove(button.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Button</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {button.id} from {room.name}? The button will be moved to
                              the available buttons list.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setButtonToRemove(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRemoveButton}>Remove</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <Badge
                        variant="outline"
                        className={button.status === "online" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                      >
                        {button.status === "online" ? (
                          <Signal className="h-3 w-3 mr-1" />
                        ) : (
                          <WifiOff className="h-3 w-3 mr-1" />
                        )}
                        {button.status}
                      </Badge>
                      <div className="flex items-center">
                        {button.battery < 20 ? (
                          <BatteryLow className="h-3 w-3 mr-1 text-red-500" />
                        ) : (
                          <Battery className="h-3 w-3 mr-1 text-green-500" />
                        )}
                        <span
                          className={cn("text-xs font-medium", button.battery < 20 ? "text-red-500" : "text-green-500")}
                        >
                          {button.battery}%
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Last seen: {button.lastSeen}</div>
                  </div>
                ))
              )}
            </div>
          </FormSection>
        </TabsContent>

        <TabsContent value="guest" className="mt-6">
          <FormSection title="Assigned Guest" description="Guest currently assigned to this room">
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

          <FormSection title="Assign Guest" description="Select a guest to assign to this room">
            {isAddingNewGuest ? (
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
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search guests..."
                      value={guestSearchTerm}
                      onChange={(e) => setGuestSearchTerm(e.target.value)}
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
              </>
            )}
          </FormSection>
        </TabsContent>
      </Tabs>
    </ModalContainer>
  )
}
