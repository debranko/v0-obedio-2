"use client"

import { useState } from "react"
import { SectionCard } from "@/components/ui-patterns/section-card"
import { InteractiveFloorMap } from "@/components/locations/interactive-floor-map"
import { ButtonsPanel } from "@/components/locations/buttons-panel"
import { RoomDetailsModal } from "@/components/locations/room-details-modal"

interface InteractiveMapTabProps {
  rooms: any[]
  availableButtons: any[]
  guests: any[]
  onRoomClick: (room: any) => void
  onButtonAssignment: (buttonId: string, roomId: string | null, previousRoomId: string | null) => void
  onAddButtonToRoom: (roomId: string, buttonId: string) => void
  onRemoveButtonFromRoom: (roomId: string, buttonId: string) => void
  onGuestAssignment: (roomId: string, guestId: string | null) => void
  onAddGuest: (guest: any) => any
  selectedRoom: any
  setSelectedRoom: (room: any) => void
}

export function InteractiveMapTab({
  rooms,
  availableButtons,
  guests,
  onRoomClick,
  onButtonAssignment,
  onAddButtonToRoom,
  onRemoveButtonFromRoom,
  onGuestAssignment,
  onAddGuest,
  selectedRoom,
  setSelectedRoom,
}: InteractiveMapTabProps) {
  const [isRoomDetailsModalOpen, setIsRoomDetailsModalOpen] = useState(false)

  // Handle room click
  const handleRoomClick = (room: any) => {
    onRoomClick(room)
    setIsRoomDetailsModalOpen(true)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <SectionCard title="Interactive Floor Map" description="Drag and drop buttons to assign them to rooms">
          <div className="h-[600px] relative border rounded-xl overflow-hidden bg-slate-50">
            <InteractiveFloorMap rooms={rooms} onRoomClick={handleRoomClick} onButtonAssignment={onButtonAssignment} />
          </div>
        </SectionCard>
      </div>

      <div className="lg:col-span-1">
        <ButtonsPanel availableButtons={availableButtons} onButtonAssignment={onButtonAssignment} />
      </div>

      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          isOpen={isRoomDetailsModalOpen}
          onClose={() => setIsRoomDetailsModalOpen(false)}
          availableButtons={availableButtons}
          guests={guests}
          onAddButton={onAddButtonToRoom}
          onRemoveButton={onRemoveButtonFromRoom}
          onGuestAssignment={onGuestAssignment}
          onAddGuest={onAddGuest}
        />
      )}
    </div>
  )
}
