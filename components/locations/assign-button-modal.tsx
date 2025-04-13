"use client"

import { useState } from "react"
import { ModalContainer } from "@/components/ui-patterns/modal-container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Battery, BatteryLow, Signal, WifiOff, Trash2 } from "lucide-react"
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

interface AssignButtonModalProps {
  room: any
  isOpen: boolean
  onClose: () => void
  availableButtons: any[]
  onAddButton: (roomId: string, buttonId: string) => void
  onRemoveButton: (roomId: string, buttonId: string) => void
}

export function AssignButtonModal({
  room,
  isOpen,
  onClose,
  availableButtons,
  onAddButton,
  onRemoveButton,
}: AssignButtonModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAvailableButton, setSelectedAvailableButton] = useState<string | null>(null)
  const [buttonToRemove, setButtonToRemove] = useState<string | null>(null)

  // Filter room buttons based on search term
  const filteredRoomButtons = room.buttons.filter((button: any) => {
    return (
      button.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      button.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Filter available buttons based on search term
  const filteredAvailableButtons = availableButtons.filter((button) => {
    return (
      button.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      button.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Handle add button
  const handleAddButton = () => {
    if (selectedAvailableButton) {
      onAddButton(room.id, selectedAvailableButton)
      setSelectedAvailableButton(null)
    }
  }

  // Handle remove button
  const handleRemoveButton = () => {
    if (buttonToRemove) {
      onRemoveButton(room.id, buttonToRemove)
      setButtonToRemove(null)
    }
  }

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title={`Assign Buttons to ${room.name}`} size="lg">
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search buttons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <FormSection title="Current Buttons" description="Buttons currently assigned to this room">
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
            {filteredRoomButtons.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No buttons assigned to this room</div>
            ) : (
              filteredRoomButtons.map((button: any) => (
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

        <FormSection title="Available Buttons" description="Select a button to assign to this room">
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
            {filteredAvailableButtons.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No available buttons found</div>
            ) : (
              filteredAvailableButtons.map((button) => (
                <div
                  key={button.id}
                  className={cn(
                    "bg-white rounded-xl p-3 border shadow-sm cursor-pointer hover:border-primary",
                    button.status === "online" ? "border-green-200" : "border-red-200",
                    selectedAvailableButton === button.id ? "ring-2 ring-primary" : "",
                  )}
                  onClick={() => setSelectedAvailableButton(button.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{button.id}</div>
                      <div className="text-sm text-muted-foreground">{button.name}</div>
                    </div>
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
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-muted-foreground">Last seen: {button.lastSeen}</div>
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
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={handleAddButton} disabled={!selectedAvailableButton}>
              Assign Selected Button
            </Button>
          </div>
        </FormSection>
      </div>
    </ModalContainer>
  )
}
