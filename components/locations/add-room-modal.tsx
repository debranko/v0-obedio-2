"use client"

import { useState } from "react"
import { ModalContainer } from "@/components/ui-patterns/modal-container"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormSection } from "@/components/ui-patterns/form-section"
import { FormField } from "@/components/ui-patterns/form-field"
import { Plus } from "lucide-react"

interface AddRoomModalProps {
  isOpen: boolean
  onClose: () => void
  onAddRoom: (room: any) => void
  existingRooms: any[]
}

export function AddRoomModal({ isOpen, onClose, onAddRoom, existingRooms }: AddRoomModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "cabin",
    width: 150,
    height: 150,
  })

  // Handle form input change
  const handleInputChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  // Handle form submission
  const handleSubmit = () => {
    // Find a position for the new room that doesn't overlap with existing rooms
    // Simple algorithm: place it to the right of the rightmost room
    let maxX = 0
    existingRooms.forEach((room) => {
      const rightEdge = room.position.x + room.width
      if (rightEdge > maxX) {
        maxX = rightEdge
      }
    })

    // Add some padding
    const newX = maxX + 50

    // Create new room
    const newRoom = {
      id: `room-${existingRooms.length + 1}`,
      name: formData.name,
      type: formData.type,
      position: { x: newX, y: 100 },
      width: formData.width,
      height: formData.height,
      buttons: [],
      guest: null,
    }

    onAddRoom(newRoom)

    // Reset form
    setFormData({
      name: "",
      type: "cabin",
      width: 150,
      height: 150,
    })
  }

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Room"
      icon={<Plus className="h-5 w-5" />}
      onSave={handleSubmit}
      saveLabel="Add Room"
      size="md"
    >
      <FormSection title="Room Details">
        <FormField label="Room Name" htmlFor="room-name" tooltip="Enter a unique name for the room">
          <Input
            id="room-name"
            placeholder="e.g., VIP Suite 2"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </FormField>

        <FormField label="Room Type" htmlFor="room-type">
          <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
            <SelectTrigger id="room-type">
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cabin">Cabin</SelectItem>
              <SelectItem value="common">Common Area</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Width (px)" htmlFor="room-width">
            <Input
              id="room-width"
              type="number"
              value={formData.width.toString()}
              onChange={(e) => handleInputChange("width", Number.parseInt(e.target.value) || 150)}
              min={100}
              max={400}
            />
          </FormField>

          <FormField label="Height (px)" htmlFor="room-height">
            <Input
              id="room-height"
              type="number"
              value={formData.height.toString()}
              onChange={(e) => handleInputChange("height", Number.parseInt(e.target.value) || 150)}
              min={100}
              max={400}
            />
          </FormField>
        </div>
      </FormSection>
    </ModalContainer>
  )
}
