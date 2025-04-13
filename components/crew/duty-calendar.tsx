"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { addMonths, format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import type { CrewMember } from "@/lib/crew-data"

interface DutyCalendarProps {
  crew: CrewMember[]
}

export function DutyCalendar({ crew }: DutyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Navigation functions
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  // Get days in current month
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get crew on duty for a specific date
  const getCrewOnDuty = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return crew.filter((member) => member.schedule?.some((day) => day.date === dateString && day.shift !== "off"))
  }

  // Get shift for a crew member on a specific date
  const getShiftForDate = (crewMember: CrewMember, date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return crewMember.schedule?.find((day) => day.date === dateString)?.shift || null
  }

  // Handle date selection
  const handleDateClick = (date: Date) => {
    setSelectedDate(isSameDay(date, selectedDate as Date) ? null : date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Duty
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium text-sm py-2">
            {day}
          </div>
        ))}

        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <div key={`empty-start-${index}`} className="h-24 p-1 border rounded-md bg-muted/20"></div>
        ))}

        {daysInMonth.map((day) => {
          const crewOnDuty = getCrewOnDuty(day)
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false

          return (
            <motion.div
              key={day.toString()}
              className={`h-24 p-1 border rounded-md overflow-hidden ${
                isToday(day) ? "border-primary" : ""
              } ${isSelected ? "ring-2 ring-primary" : ""}`}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`text-sm font-medium ${isToday(day) ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center" : ""}`}
                >
                  {format(day, "d")}
                </span>
                {crewOnDuty.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {crewOnDuty.length} on duty
                  </Badge>
                )}
              </div>

              <div className="mt-1 space-y-1 overflow-hidden">
                {crewOnDuty.slice(0, 3).map((member) => {
                  const shift = getShiftForDate(member, day)
                  return (
                    <TooltipProvider key={member.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center text-xs truncate">
                            <div
                              className={`w-2 h-2 rounded-full mr-1 ${
                                shift === "morning"
                                  ? "bg-blue-500"
                                  : shift === "afternoon"
                                    ? "bg-amber-500"
                                    : shift === "night"
                                      ? "bg-indigo-700"
                                      : "bg-gray-400"
                              }`}
                            />
                            <span className="truncate">{member.name}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {member.name} - {member.role}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {shift === "morning"
                              ? "Morning Shift"
                              : shift === "afternoon"
                                ? "Afternoon Shift"
                                : shift === "night"
                                  ? "Night Shift"
                                  : "Off Duty"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
                {crewOnDuty.length > 3 && (
                  <div className="text-xs text-muted-foreground">+{crewOnDuty.length - 3} more</div>
                )}
              </div>
            </motion.div>
          )
        })}

        {Array.from({ length: (7 - ((monthStart.getDay() + daysInMonth.length) % 7)) % 7 }).map((_, index) => (
          <div key={`empty-end-${index}`} className="h-24 p-1 border rounded-md bg-muted/20"></div>
        ))}
      </div>

      {selectedDate && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
            <div className="space-y-2">
              {getCrewOnDuty(selectedDate).length > 0 ? (
                getCrewOnDuty(selectedDate).map((member) => {
                  const shift = getShiftForDate(member, selectedDate)
                  return (
                    <div key={member.id} className="flex items-center justify-between p-2 rounded-md border">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${
                            shift === "morning"
                              ? "bg-blue-500"
                              : shift === "afternoon"
                                ? "bg-amber-500"
                                : shift === "night"
                                  ? "bg-indigo-700"
                                  : "bg-gray-400"
                          }`}
                        />
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {shift === "morning"
                          ? "Morning"
                          : shift === "afternoon"
                            ? "Afternoon"
                            : shift === "night"
                              ? "Night"
                              : "Off"}
                      </Badge>
                    </div>
                  )
                })
              ) : (
                <div className="text-center p-4 text-muted-foreground">No crew members on duty for this date</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
