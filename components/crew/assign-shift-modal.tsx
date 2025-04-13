"use client"

import { useState, useEffect, useMemo } from "react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Clock, Sun, Moon, Check, Filter } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

import type { CrewMember } from "@/lib/crew-data"

interface AssignShiftModalProps {
  isOpen: boolean
  onClose: () => void
  date: Date
  shift: "morning" | "afternoon" | "night"
  crew: CrewMember[]
  onAssign: (crewIds: number[]) => void
  existingAssignments: {
    morning: number[]
    afternoon: number[]
    night: number[]
  }
}

export function AssignShiftModal({
  isOpen,
  onClose,
  date,
  shift,
  crew,
  onAssign,
  existingAssignments,
}: AssignShiftModalProps) {
  const { toast } = useToast()
  const [selectedCrewIds, setSelectedCrewIds] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("All Roles")

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCrewIds([])
      setSearchQuery("")
      setSelectedRole("All Roles")
    }
  }, [isOpen])

  // Get shift icon and color
  const shiftInfo = {
    morning: {
      icon: <Clock className="h-4 w-4 text-blue-500" />,
      label: "Morning",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    afternoon: {
      icon: <Sun className="h-4 w-4 text-amber-500" />,
      label: "Afternoon",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    night: {
      icon: <Moon className="h-4 w-4 text-indigo-500" />,
      label: "Night",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
  }

  // Filter and group crew members
  const filteredAndGroupedCrew = useMemo(() => {
    // First filter by search query and role
    const filtered = crew.filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = selectedRole === "All Roles" || member.role === selectedRole
      return matchesSearch && matchesRole
    })

    // Then group by role
    const grouped: Record<string, CrewMember[]> = {}
    filtered.forEach((member) => {
      if (!grouped[member.role]) {
        grouped[member.role] = []
      }
      grouped[member.role].push(member)
    })

    return grouped
  }, [crew, searchQuery, selectedRole])

  // Check if crew member is already assigned to another shift
  const getCrewStatus = (crewId: number) => {
    // Check if assigned to another shift on the same day
    if (
      (shift !== "morning" && existingAssignments.morning.includes(crewId)) ||
      (shift !== "afternoon" && existingAssignments.afternoon.includes(crewId)) ||
      (shift !== "night" && existingAssignments.night.includes(crewId))
    ) {
      // Determine which other shift they're assigned to
      const otherShift =
        shift !== "morning" && existingAssignments.morning.includes(crewId)
          ? "Morning"
          : shift !== "afternoon" && existingAssignments.afternoon.includes(crewId)
            ? "Afternoon"
            : "Night"

      return {
        status: "assigned",
        color: "bg-amber-400",
        tooltip: `Already on ${otherShift} shift`,
      }
    }

    // Check if crew member is off duty
    const member = crew.find((m) => m.id === crewId)
    const isOffDuty = member?.schedule?.some((s) => s.date === format(date, "yyyy-MM-dd") && s.shift === "off")

    if (isOffDuty) {
      return {
        status: "off",
        color: "bg-gray-400",
        tooltip: "Off duty",
      }
    }

    // Otherwise available
    return {
      status: "available",
      color: "bg-green-500",
      tooltip: "Available",
    }
  }

  // Toggle crew selection
  const toggleCrewSelection = (crewId: number) => {
    setSelectedCrewIds((prev) => (prev.includes(crewId) ? prev.filter((id) => id !== crewId) : [...prev, crewId]))
  }

  // Handle assignment confirmation
  const handleAssign = () => {
    onAssign(selectedCrewIds)

    toast({
      title: "Crew assigned",
      description: `${selectedCrewIds.length} crew member${selectedCrewIds.length !== 1 ? "s" : ""} assigned to ${shiftInfo[shift].label} Shift on ${format(date, "MMMM d")}`,
    })

    onClose()
  }

  // Get all available roles from crew data
  const availableRoles = useMemo(() => {
    const roles = new Set<string>()
    crew.forEach((member) => {
      roles.add(member.role)
    })
    return Array.from(roles)
  }, [crew])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Assign Shift – {format(date, "EEEE, MMMM d, yyyy")}</DialogTitle>
          <DialogDescription className="flex items-center mt-1">
            <div className={`flex items-center ${shiftInfo[shift].color}`}>
              {shiftInfo[shift].icon}
              <span className="ml-1 font-medium">{shiftInfo[shift].label} Shift</span>
            </div>
            {selectedCrewIds.length > 0 && (
              <Badge variant="outline" className="ml-auto">
                {selectedCrewIds.length} Crew Member{selectedCrewIds.length !== 1 ? "s" : ""} Selected
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Filters */}
          <div className="flex flex-col space-y-2">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Roles">All Roles</SelectItem>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crew members..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Crew list */}
          <ScrollArea className="h-[300px] pr-4 -mr-4">
            <AnimatePresence>
              {Object.keys(filteredAndGroupedCrew).length > 0 ? (
                Object.entries(filteredAndGroupedCrew).map(([role, members]) => (
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4"
                  >
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
                      {role}
                    </div>
                    <div className="space-y-2">
                      {members.map((member) => {
                        const status = getCrewStatus(member.id)

                        return (
                          <motion.div
                            key={member.id}
                            layout
                            className={`flex items-center p-2 rounded-lg border ${
                              selectedCrewIds.includes(member.id) ? `${shiftInfo[shift].bgColor} border-primary` : ""
                            }`}
                          >
                            <Checkbox
                              id={`crew-${member.id}`}
                              checked={selectedCrewIds.includes(member.id)}
                              onCheckedChange={() => toggleCrewSelection(member.id)}
                              className="mr-2"
                            />
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback>
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{member.name}</p>
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className={`w-3 h-3 rounded-full ${status.color}`} />
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>{status.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <p>No crew members found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={selectedCrewIds.length === 0} className="gap-2">
            <Check className="h-4 w-4" />
            Assign {selectedCrewIds.length > 0 && `(${selectedCrewIds.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
