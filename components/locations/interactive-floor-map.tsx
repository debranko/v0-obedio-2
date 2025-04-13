"use client"

import { useState, useRef } from "react"
import { motion, useDragControls } from "framer-motion"
import { ZoomIn, ZoomOut, Move, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface InteractiveFloorMapProps {
  rooms: any[]
  onRoomClick: (room: any) => void
  onButtonAssignment: (buttonId: string, roomId: string | null, previousRoomId: string | null) => void
}

export function InteractiveFloorMap({ rooms, onRoomClick, onButtonAssignment }: InteractiveFloorMapProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [draggedButton, setDraggedButton] = useState<{ id: string; roomId: string } | null>(null)
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()

  // Handle zoom in
  const handleZoomIn = () => {
    setScale(Math.min(scale + 0.1, 2))
  }

  // Handle zoom out
  const handleZoomOut = () => {
    setScale(Math.max(scale - 0.1, 0.5))
  }

  // Handle map drag start
  const handleMapDragStart = (event: any) => {
    dragControls.start(event)
    setIsDragging(true)
  }

  // Handle map drag end
  const handleMapDragEnd = () => {
    setIsDragging(false)
  }

  // Handle button drag start
  const handleButtonDragStart = (buttonId: string, roomId: string) => {
    setDraggedButton({ id: buttonId, roomId })
  }

  // Handle button drag end
  const handleButtonDragEnd = (event: any, buttonId: string, roomId: string) => {
    if (!draggedButton) return

    // Get the position of the button when dropped
    const buttonElement = event.target
    const buttonRect = buttonElement.getBoundingClientRect()
    const buttonCenterX = buttonRect.left + buttonRect.width / 2
    const buttonCenterY = buttonRect.top + buttonRect.height / 2

    // Check if the button is dropped on a room
    let targetRoomId = null
    const roomElements = document.querySelectorAll("[data-room-id]")
    roomElements.forEach((roomElement) => {
      const roomRect = roomElement.getBoundingClientRect()
      if (
        buttonCenterX >= roomRect.left &&
        buttonCenterX <= roomRect.right &&
        buttonCenterY >= roomRect.top &&
        buttonCenterY <= roomRect.bottom
      ) {
        targetRoomId = roomElement.getAttribute("data-room-id")
      }
    })

    // If the button is dropped on a different room or outside any room
    if (targetRoomId !== roomId) {
      onButtonAssignment(buttonId, targetRoomId, roomId)
    }

    setDraggedButton(null)
    setHoveredRoom(null)
  }

  // Handle room hover for drag and drop
  const handleRoomHover = (roomId: string) => {
    if (draggedButton) {
      setHoveredRoom(roomId)
    }
  }

  // Handle room hover end
  const handleRoomHoverEnd = () => {
    if (draggedButton) {
      setHoveredRoom(null)
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden" ref={mapRef}>
      {/* Zoom and pan controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn} className="bg-white">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut} className="bg-white">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="bg-white" title="Drag to pan">
          <Move className="h-4 w-4" />
        </Button>
      </div>

      {/* Floor map */}
      <motion.div
        className="relative w-full h-full"
        style={{ scale, x: position.x, y: position.y }}
        drag
        dragControls={dragControls}
        dragMomentum={false}
        dragElastic={0}
        onDragStart={handleMapDragStart}
        onDragEnd={handleMapDragEnd}
        whileDrag={{ cursor: "grabbing" }}
      >
        {/* Rooms */}
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            className={cn(
              "absolute rounded-2xl border-2 p-4 cursor-pointer transition-colors",
              room.type === "cabin" ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200",
              hoveredRoom === room.id ? "ring-2 ring-primary" : "",
              isDragging ? "pointer-events-none" : "",
            )}
            style={{
              left: room.position.x,
              top: room.position.y,
              width: room.width,
              height: room.height,
            }}
            onClick={() => !isDragging && onRoomClick(room)}
            data-room-id={room.id}
            onMouseEnter={() => handleRoomHover(room.id)}
            onMouseLeave={handleRoomHoverEnd}
            whileHover={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="font-medium mb-2">{room.name}</div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="bg-white">
                {room.buttons.length} Button{room.buttons.length !== 1 ? "s" : ""}
              </Badge>

              {room.guest && (
                <Badge
                  variant="outline"
                  className={room.guest.vip ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}
                >
                  {room.guest.vip && <Crown className="h-3 w-3 mr-1" />}
                  {room.guest.name}
                </Badge>
              )}
            </div>

            {/* Buttons in room */}
            <div className="mt-2 space-y-1">
              {room.buttons.map((button: any) => (
                <motion.div
                  key={button.id}
                  className={cn(
                    "bg-white rounded-lg p-2 text-xs border flex items-center justify-between",
                    button.status === "online" ? "border-green-200" : "border-red-200",
                    draggedButton?.id === button.id ? "opacity-50" : "",
                  )}
                  drag
                  dragMomentum={false}
                  onDragStart={() => handleButtonDragStart(button.id, room.id)}
                  onDragEnd={(e) => handleButtonDragEnd(e, button.id, room.id)}
                  whileDrag={{ scale: 1.05, zIndex: 100 }}
                >
                  <span>{button.id}</span>
                  <Badge
                    variant="outline"
                    className={button.status === "online" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                  >
                    {button.battery}%
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
