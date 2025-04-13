"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, MessageSquare } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { CrewDetailsDrawer } from "@/components/crew/crew-details-drawer"
import type { CrewMember } from "@/lib/crew-data"

interface CrewCardsProps {
  crew: CrewMember[]
}

export function CrewCards({ crew }: CrewCardsProps) {
  const [selectedCrewMember, setSelectedCrewMember] = useState<CrewMember | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [crewState, setCrewState] = useState<CrewMember[]>(crew)

  // Toggle duty status
  const toggleDutyStatus = (id: number) => {
    setCrewState(crewState.map((member) => (member.id === id ? { ...member, onDuty: !member.onDuty } : member)))
  }

  // Open crew details drawer
  const openCrewDetails = (member: CrewMember) => {
    setSelectedCrewMember(member)
    setIsDrawerOpen(true)
  }

  // Animation variants for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <>
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {crewState.map((member) => (
          <motion.div key={member.id} variants={itemVariants}>
            <Card className="overflow-hidden h-full">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="p-4 flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <Avatar className="h-16 w-16 border-2 border-background">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`duty-status-${member.id}`} className="text-sm">
                        On Duty
                      </Label>
                      <Switch
                        id={`duty-status-${member.id}`}
                        checked={member.onDuty}
                        onCheckedChange={() => toggleDutyStatus(member.id)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <Badge variant="outline" className="bg-muted">
                      {member.role}
                    </Badge>

                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1">Languages</h4>
                      <div className="flex flex-wrap gap-1">
                        {member.languages.map((language) => (
                          <Badge key={language} variant="secondary" className="text-xs">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Assigned Areas</h4>
                      <div className="flex flex-wrap gap-1">
                        {member.assignedRooms.map((room) => (
                          <Badge key={room} variant="outline" className="text-xs">
                            {room}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t p-3 bg-muted/30 flex justify-between items-center">
                  <div className="flex space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Message</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => openCrewDetails(member)}
                    className="text-xs"
                    onClick={() => openCrewDetails(member)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {selectedCrewMember && (
        <CrewDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          crewMember={selectedCrewMember}
        />
      )}
    </>
  )
}
