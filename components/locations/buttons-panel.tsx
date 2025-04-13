"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Battery, BatteryLow, Signal, WifiOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SectionCard } from "@/components/ui-patterns/section-card"
import { cn } from "@/lib/utils"

interface ButtonsPanelProps {
  availableButtons: any[]
  onButtonAssignment: (buttonId: string, roomId: string | null, previousRoomId: string | null) => void
}

export function ButtonsPanel({ availableButtons, onButtonAssignment }: ButtonsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter buttons based on search term
  const filteredButtons = availableButtons.filter((button) => {
    return (
      button.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      button.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Handle button drag end
  const handleButtonDragEnd = (event: any, buttonId: string) => {
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

    // If the button is dropped on a room
    if (targetRoomId) {
      onButtonAssignment(buttonId, targetRoomId, null)
    }
  }

  return (
    <SectionCard title="Available Buttons" description="Drag buttons onto rooms to assign them">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search buttons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredButtons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No available buttons found</div>
          ) : (
            filteredButtons.map((button, index) => (
              <motion.div
                key={button.id}
                className={cn(
                  "bg-white rounded-xl p-3 border shadow-sm",
                  button.status === "online" ? "border-green-200" : "border-red-200",
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                drag
                dragMomentum={false}
                onDragEnd={(e) => handleButtonDragEnd(e, button.id)}
                whileDrag={{ scale: 1.05, zIndex: 100, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                whileHover={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
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
                <div className="text-xs text-muted-foreground mt-2 italic">Drag to assign to a room</div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </SectionCard>
  )
}
