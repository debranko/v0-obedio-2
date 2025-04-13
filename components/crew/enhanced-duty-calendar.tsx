"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Trash2,
  Undo,
  X,
  Eye,
  EyeOff,
  HelpCircle,
  Users,
  Calendar,
  Grid,
  Search,
  Filter,
  CheckCircle2,
  ChevronDown,
  Anchor,
  Briefcase,
  Settings,
  UserCheck,
} from "lucide-react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import {
  addMonths,
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isSameMonth,
  addDays,
  startOfWeek,
  endOfWeek,
} from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

import { AssignShiftModal } from "./assign-shift-modal"
import {
  sendDutyChangeNotification,
  shouldSendNotification,
  sendDutyReminderNotifications,
} from "@/lib/notification-service"
import type { CrewMember } from "@/lib/crew-data"

// Drag item types
const ItemTypes = {
  CREW_MEMBER: "crewMember",
}

interface EnhancedDutyCalendarProps {
  crew: CrewMember[]
  userRole?: "admin" | "chief" | "stewardess" | "guest" // For RBAC
}

export function EnhancedDutyCalendar({ crew, userRole = "admin" }: EnhancedDutyCalendarProps) {
  const { toast } = useToast()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showFreeOnly, setShowFreeOnly] = useState(false)
  const [selectedRole, setSelectedRole] = useState("All Roles")
  const [dutyAssignments, setDutyAssignments] = useState<Record<string, Array<{ crewId: number; shift: string }>>>({})
  const [previousAssignments, setPreviousAssignments] = useState<
    Record<string, Array<{ crewId: number; shift: string }>>
  >({})
  const [isAiAssigning, setIsAiAssigning] = useState(false)
  const [isAiCompleting, setIsAiCompleting] = useState(false)
  const [isSendingNotifications, setIsSendingNotifications] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [hasShownSidebarHelp, setHasShownSidebarHelp] = useState(false)
  const [activeTab, setActiveTab] = useState("monthly")
  const [searchQuery, setSearchQuery] = useState("")
  const [showTipsPopover, setShowTipsPopover] = useState(false)

  // Department mapping
  const departmentMapping = {
    "Interior Department": ["Chief Stewardess", "Stewardess", "Butler"],
    "Deck Department": ["Captain", "Deckhand"],
    "Engine Department": ["Engineer"],
    "Culinary Department": ["Chef"],
  }

  // Reverse mapping for roles to departments
  const roleToDepartment = useMemo(() => {
    const mapping: Record<string, string> = {}
    Object.entries(departmentMapping).forEach(([department, roles]) => {
      roles.forEach((role) => {
        mapping[role] = department
      })
    })
    return mapping
  }, [departmentMapping])

  const [selectedDepartment, setSelectedDepartment] = useState("Interior Department")
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)

  // State for department collapsible sections
  const [expandedDepartments, setExpandedDepartments] = useState({
    "Interior Department": true,
    "Deck Department": false,
    "Engine Department": false,
    "Culinary Department": false,
  })

  // Modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [assignModalDate, setAssignModalDate] = useState<Date>(new Date())
  const [assignModalShift, setAssignModalShift] = useState<"morning" | "afternoon" | "night">("morning")

  // Weekly view state
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))

  // Navigation functions
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const previousWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7))
  const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7))

  // Get days in current month
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get days in current week
  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 0 })
  const daysInWeek = eachDayOfInterval({ start: currentWeekStart, end: weekEnd })

  // Toggle department expansion
  const toggleDepartment = (department: string) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [department]: !prev[department],
    }))
  }

  // Group crew by department
  const crewByDepartmentOld = useMemo(() => {
    const departments: Record<string, CrewMember[]> = {}

    crew.forEach((member) => {
      if (!departments[member.role]) {
        departments[member.role] = []
      }
      departments[member.role].push(member)
    })

    return departments
  }, [crew])

  // Filter crew based on role, availability, and search query
  const filteredCrewOld = useMemo(() => {
    return crew.filter((member) => {
      // Filter by role
      if (selectedRole !== "All Roles" && member.role !== selectedRole) {
        return false
      }

      // Filter by availability if showFreeOnly is true
      if (showFreeOnly) {
        const today = format(new Date(), "yyyy-MM-dd")
        const isOnDutyToday = member.schedule?.some((day) => day.date === today && day.shift !== "off")
        return !isOnDutyToday
      }

      // Filter by search query
      if (searchQuery) {
        return member.name.toLowerCase().includes(searchQuery.toLowerCase())
      }

      return true
    })
  }, [crew, selectedRole, showFreeOnly, searchQuery])

  // Filter crew based on role, availability, and search query
  const filteredCrew = useMemo(() => {
    return crew.filter((member) => {
      // Filter by department
      const memberDepartment = roleToDepartment[member.role] || "Other"
      if (selectedDepartment !== "All Departments" && memberDepartment !== selectedDepartment) {
        return false
      }

      // Filter by availability if showOnlyAvailable is true
      if (showOnlyAvailable) {
        return member.onDuty
      }

      // Filter by search query
      if (searchQuery) {
        return member.name.toLowerCase().includes(searchQuery.toLowerCase())
      }

      return true
    })
  }, [crew, selectedDepartment, showOnlyAvailable, searchQuery, roleToDepartment])

  // Get filtered crew by department
  const filteredCrewByDepartmentOld = useMemo(() => {
    const departments: Record<string, CrewMember[]> = {}

    filteredCrewOld.forEach((member) => {
      if (!departments[member.role]) {
        departments[member.role] = []
      }
      departments[member.role].push(member)
    })

    return departments
  }, [filteredCrewOld])

  // Get filtered crew by department
  const crewByDepartment = useMemo(() => {
    const departments: Record<string, Record<string, CrewMember[]>> = {
      "Interior Department": {},
      "Deck Department": {},
      "Engine Department": {},
      "Culinary Department": {},
    }

    // Initialize role arrays for each department
    Object.entries(departmentMapping).forEach(([dept, roles]) => {
      roles.forEach((role) => {
        departments[dept][role] = []
      })
    })

    // Group crew by department and role
    filteredCrew.forEach((member) => {
      const dept = roleToDepartment[member.role] || "Other"
      if (!departments[dept]) {
        departments[dept] = {}
      }
      if (!departments[dept][member.role]) {
        departments[dept][member.role] = []
      }
      departments[dept][member.role].push(member)
    })

    return departments
  }, [filteredCrew, departmentMapping, roleToDepartment])

  // Get all departments
  const allDepartments = useMemo(() => {
    return Object.keys(crewByDepartmentOld)
  }, [crewByDepartmentOld])

  // Get department stats
  const departmentStats = useMemo(() => {
    const stats: Record<string, { total: number; onDuty: number; offDuty: number }> = {}

    allDepartments.forEach((dept) => {
      const deptMembers = crewByDepartmentOld[dept]
      const total = deptMembers.length
      const onDuty = deptMembers.filter((m) => m.onDuty).length

      stats[dept] = {
        total,
        onDuty,
        offDuty: total - onDuty,
      }
    })

    return stats
  }, [crewByDepartmentOld, allDepartments])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCrew = crew.length
    const onDuty = crew.filter((member) => member.onDuty).length
    const offDuty = totalCrew - onDuty

    // Calculate most assigned crew member for the month
    const assignmentCounts: Record<number, number> = {}

    Object.values(dutyAssignments).forEach((dayAssignments) => {
      dayAssignments.forEach(({ crewId }) => {
        assignmentCounts[crewId] = (assignmentCounts[crewId] || 0) + 1
      })
    })

    let mostAssignedId = -1
    let mostAssignments = 0
    let leastAssignedId = -1
    let leastAssignments = Number.POSITIVE_INFINITY

    Object.entries(assignmentCounts).forEach(([crewId, count]) => {
      if (count > mostAssignments) {
        mostAssignments = count
        mostAssignedId = Number.parseInt(crewId)
      }
      if (count < leastAssignments && count > 0) {
        leastAssignments = count
        leastAssignedId = Number.parseInt(crewId)
      }
    })

    const mostAssignedCrew = crew.find((m) => m.id === mostAssignedId)
    const leastAssignedCrew = crew.find((m) => m.id === leastAssignedId)

    // Department with most assignments
    const deptAssignments: Record<string, number> = {}

    Object.values(dutyAssignments).forEach((dayAssignments) => {
      dayAssignments.forEach(({ crewId }) => {
        const member = crew.find((m) => m.id === crewId)
        if (member) {
          deptAssignments[member.role] = (deptAssignments[member.role] || 0) + 1
        }
      })
    })

    let mostAssignedDept = ""
    let mostDeptAssignments = 0

    Object.entries(deptAssignments).forEach(([dept, count]) => {
      if (count > mostDeptAssignments) {
        mostDeptAssignments = count
        mostAssignedDept = dept
      }
    })

    return {
      totalCrew,
      onDuty,
      offDuty,
      mostAssignedCrew:
        mostAssignedId !== -1
          ? {
              name: mostAssignedCrew?.name || "Unknown",
              count: mostAssignments,
            }
          : null,
      leastAssignedCrew:
        leastAssignedId !== -1
          ? {
              name: leastAssignedCrew?.name || "Unknown",
              count: leastAssignments,
            }
          : null,
      mostAssignedDept:
        mostAssignedDept !== ""
          ? {
              name: mostAssignedDept,
              count: mostDeptAssignments,
            }
          : null,
    }
  }, [crew, dutyAssignments])

  // Get crew on duty for a specific date
  const getCrewOnDuty = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")

    // First check our custom assignments
    const customAssignments = dutyAssignments[dateString] || []

    // Then check the original schedule
    const scheduledCrew = crew.filter((member) =>
      member.schedule?.some((day) => day.date === dateString && day.shift !== "off"),
    )

    // Combine both, but prioritize custom assignments
    const allAssignments = [...customAssignments]

    // Add scheduled crew that aren't already in custom assignments
    scheduledCrew.forEach((member) => {
      if (!customAssignments.some((assignment) => assignment.crewId === member.id)) {
        const shift = member.schedule?.find((day) => day.date === dateString)?.shift || "morning"
        allAssignments.push({ crewId: member.id, shift })
      }
    })

    return allAssignments
  }

  // Get existing assignments for a date by shift
  const getExistingAssignmentsByShift = (date: Date) => {
    const assignments = getCrewOnDuty(date)
    return {
      morning: assignments.filter((a) => a.shift === "morning").map((a) => a.crewId),
      afternoon: assignments.filter((a) => a.shift === "afternoon").map((a) => a.crewId),
      night: assignments.filter((a) => a.shift === "night").map((a) => a.crewId),
    }
  }

  // Get previous shift for a crew member on a specific date
  const getPreviousShift = (date: Date, crewId: number): string | null => {
    const dateString = format(date, "yyyy-MM-dd")
    const previousAssignment = previousAssignments[dateString]?.find((a) => a.crewId === crewId)
    return previousAssignment ? previousAssignment.shift : null
  }

  // Handle date selection
  const handleDateClick = (date: Date) => {
    setSelectedDate(isSameDay(date, selectedDate as Date) ? null : date)
  }

  // Handle removing a crew member from a date
  const removeCrewFromDate = (date: Date, crewId: number) => {
    const dateString = format(date, "yyyy-MM-dd")

    // Save current state before modification
    setPreviousAssignments(dutyAssignments)

    setDutyAssignments((prev) => {
      const newAssignments = { ...prev }
      if (newAssignments[dateString]) {
        newAssignments[dateString] = newAssignments[dateString].filter((assignment) => assignment.crewId !== crewId)
      }
      return newAssignments
    })

    // Show toast notification
    toast({
      title: "Crew member removed",
      description: `Crew member has been removed from duty on ${format(date, "MMMM d")}`,
    })
  }

  // Handle changing a crew member's shift
  const changeCrewShift = (date: Date, crewId: number, shift: string) => {
    const dateString = format(date, "yyyy-MM-dd")

    // Save current state before modification
    setPreviousAssignments(dutyAssignments)

    // Get previous shift for notification
    const previousShift = getPreviousShift(date, crewId)

    setDutyAssignments((prev) => {
      const newAssignments = { ...prev }
      if (!newAssignments[dateString]) {
        newAssignments[dateString] = []
      }

      const existingIndex = newAssignments[dateString].findIndex((assignment) => assignment.crewId === crewId)

      if (existingIndex >= 0) {
        newAssignments[dateString][existingIndex].shift = shift
      } else {
        newAssignments[dateString].push({ crewId, shift })
      }

      return newAssignments
    })

    // Send notification if needed
    if (shouldSendNotification(crewId, date, shift, previousAssignments)) {
      sendDutyChangeNotification(crewId, date, shift, previousShift)

      // Show toast notification for the admin
      const crewMember = crew.find((m) => m.id === crewId)
      if (crewMember) {
        toast({
          title: "Duty notification sent",
          description: `${crewMember.name} has been notified of their ${shift} shift on ${format(date, "MMMM d")}`,
        })
      }
    }
  }

  // Handle assigning multiple crew members to a shift
  const handleAssignMultipleCrew = (crewIds: number[]) => {
    const dateString = format(assignModalDate, "yyyy-MM-dd")

    // Save current state before modification
    setPreviousAssignments(dutyAssignments)

    setDutyAssignments((prev) => {
      const newAssignments = { ...prev }
      if (!newAssignments[dateString]) {
        newAssignments[dateString] = []
      }

      // Process each crew member
      crewIds.forEach((crewId) => {
        // Get previous shift for notification
        const previousShift = getPreviousShift(assignModalDate, crewId)

        // Remove any existing assignments for this crew member on this date
        newAssignments[dateString] = newAssignments[dateString].filter((assignment) => assignment.crewId !== crewId)

        // Add new assignment
        newAssignments[dateString].push({ crewId, shift: assignModalShift })

        // Send notification if needed
        if (shouldSendNotification(crewId, assignModalDate, assignModalShift, previousAssignments)) {
          sendDutyChangeNotification(crewId, assignModalDate, assignModalShift, previousShift)
        }
      })

      return newAssignments
    })

    // Show toast notification
    toast({
      title: "Crew assigned",
      description: `${crewIds.length} crew member${crewIds.length !== 1 ? "s" : ""} assigned to ${assignModalShift} shift on ${format(assignModalDate, "MMMM d")}`,
    })
  }

  // Open assign modal for a specific shift
  const openAssignModal = (date: Date, shift: "morning" | "afternoon" | "night") => {
    setAssignModalDate(date)
    setAssignModalShift(shift)
    setAssignModalOpen(true)
  }

  // Handle clearing all assignments for the current month
  const handleClearMonth = () => {
    // Save current state before clearing
    setPreviousAssignments(dutyAssignments)

    // Get all dates in the current month
    const currentMonthDates = daysInMonth.map((day) => format(day, "yyyy-MM-dd"))

    // Create new assignments object without the current month dates
    const newAssignments = { ...dutyAssignments }
    currentMonthDates.forEach((dateString) => {
      delete newAssignments[dateString]
    })

    setDutyAssignments(newAssignments)

    // Show toast notification
    toast({
      title: "Calendar cleared",
      description: `All duty assignments for ${format(currentMonth, "MMMM yyyy")} have been cleared`,
    })
  }

  // Handle reverting to previous state
  const handleRevert = () => {
    if (Object.keys(previousAssignments).length > 0) {
      // Swap current and previous states
      const currentAssignments = { ...dutyAssignments }
      setDutyAssignments(previousAssignments)
      setPreviousAssignments(currentAssignments)

      // Show toast notification
      toast({
        title: "Changes reverted",
        description: "Previous duty assignments have been restored",
      })
    }
  }

  // Handle sending duty notifications to all crew members on duty for the selected date
  const handleSendDutyNotification = () => {
    // If no date is selected, use today's date
    const targetDate = selectedDate || new Date()

    setIsSendingNotifications(true)

    // Get crew on duty for the target date
    const crewOnDuty = getCrewOnDuty(targetDate)

    // Send notifications
    const result = sendDutyReminderNotifications(targetDate, crewOnDuty, crew)

    setTimeout(() => {
      setIsSendingNotifications(false)

      // Show toast notification
      if (result.count > 0) {
        toast({
          title: "Duty reminders sent",
          description: `Sent reminders to ${result.count} crew member${result.count !== 1 ? "s" : ""} for ${format(targetDate, "MMMM d")}`,
        })
      } else {
        toast({
          title: "No reminders sent",
          description: `No crew members are assigned to duty on ${format(targetDate, "MMMM d")}`,
          variant: "destructive",
        })
      }
    }, 1000)
  }

  // AI Assignment Logic
  const handleAiAssign = () => {
    setIsAiAssigning(true)

    // Save current state before AI assignment
    setPreviousAssignments(dutyAssignments)

    // Simulate AI processing time
    setTimeout(() => {
      const newAssignments: Record<string, Array<{ crewId: number; shift: string }>> = {}

      // Get all dates in the current month
      const dates = daysInMonth.map((day) => format(day, "yyyy-MM-dd"))

      // Track assignments for balancing
      const crewStats: Record<
        number,
        {
          total: number
          consecutive: number
          lastShift: string | null
          lastDate: string | null
          morning: number
          afternoon: number
          night: number
        }
      > = {}

      // Initialize stats for each crew member
      crew.forEach((member) => {
        crewStats[member.id] = {
          total: 0,
          consecutive: 0,
          lastShift: null,
          lastDate: null,
          morning: 0,
          afternoon: 0,
          night: 0,
        }
      })

      // Process each date
      dates.forEach((dateString) => {
        newAssignments[dateString] = []
        const currentDate = new Date(dateString)

        // Skip dates in the past
        if (currentDate < new Date()) return

        // Get available crew (not marked as "off" in original schedule)
        const availableCrew = crew.filter((member) => {
          const daySchedule = member.schedule?.find((day) => day.date === dateString)
          return !daySchedule || daySchedule.shift !== "off"
        })

        // Process each shift type
        ;["morning", "afternoon", "night"].forEach((shiftType) => {
          // Determine how many crew members needed for this shift
          const neededCrew = shiftType === "night" ? 1 : 2

          // Sort available crew by priority for this shift
          // Priority factors: total assignments, consecutive days, balance between shift types
          const sortedForShift = [...availableCrew]
            .filter((member) => {
              // Filter out crew already assigned to this date
              return !newAssignments[dateString].some((a) => a.crewId === member.id)
            })
            .sort((a, b) => {
              const statsA = crewStats[a.id]
              const statsB = crewStats[b.id]

              // First prioritize by consecutive days
              if (statsA.consecutive !== statsB.consecutive) {
                return statsA.consecutive - statsB.consecutive
              }

              // Then by specific shift balance (prefer those who haven't done this shift type much)
              if (statsA[shiftType as keyof typeof statsA] !== statsB[shiftType as keyof typeof statsB]) {
                return (
                  (statsA[shiftType as keyof typeof statsA] as number) -
                  (statsB[shiftType as keyof typeof statsB] as number)
                )
              }

              // Finally by total assignments
              return statsA.total - statsB.total
            })

          // Assign crew to this shift
          sortedForShift.slice(0, neededCrew).forEach((member) => {
            newAssignments[dateString].push({ crewId: member.id, shift: shiftType })

            // Update stats
            crewStats[member.id].total += 1
            crewStats[member.id][shiftType as keyof (typeof crewStats)[typeof member.id]] =
              (crewStats[member.id][shiftType as keyof (typeof crewStats)[typeof member.id]] as number) + 1

            // Update consecutive days
            const prevDate = crewStats[member.id].lastDate
            if (prevDate) {
              const prevDateObj = new Date(prevDate)
              const oneDayDiff = Math.abs(currentDate.getTime() - prevDateObj.getTime()) === 86400000
              if (oneDayDiff) {
                crewStats[member.id].consecutive += 1
              } else {
                crewStats[member.id].consecutive = 1
              }
            } else {
              crewStats[member.id].consecutive = 1
            }

            crewStats[member.id].lastShift = shiftType
            crewStats[member.id].lastDate = dateString

            // Remove this crew member from available list
            const index = availableCrew.findIndex((c) => c.id === member.id)
            if (index !== -1) {
              availableCrew.splice(index, 1)
            }

            // Send notification if needed
            const previousShift = getPreviousShift(currentDate, member.id)
            if (shouldSendNotification(member.id, currentDate, shiftType, previousAssignments)) {
              sendDutyChangeNotification(member.id, currentDate, shiftType, previousShift)
            }
          })
        })

        // Reset consecutive days counter for crew not assigned today
        crew.forEach((member) => {
          if (!newAssignments[dateString].some((assignment) => assignment.crewId === member.id)) {
            const prevDate = crewStats[member.id].lastDate
            if (prevDate) {
              const prevDateObj = new Date(prevDate)
              const oneDayDiff = Math.abs(currentDate.getTime() - prevDateObj.getTime()) === 86400000
              if (!oneDayDiff) {
                crewStats[member.id].consecutive = 0
              }
            }
          }
        })
      })

      setDutyAssignments(newAssignments)
      setIsAiAssigning(false)

      // Show toast notification
      toast({
        title: "AI Assignment Complete",
        description: `Duty schedule for ${format(currentMonth, "MMMM yyyy")} has been optimized`,
      })
    }, 1500)
  }

  // AI Complete Logic - fills in only unassigned shifts
  const handleAiComplete = () => {
    setIsAiCompleting(true)

    // Save current state before AI completion
    setPreviousAssignments(dutyAssignments)

    // Simulate AI processing time
    setTimeout(() => {
      const newAssignments = { ...dutyAssignments }

      // Get all dates in the current month
      const dates = daysInMonth.map((day) => format(day, "yyyy-MM-dd"))

      // Track assignments for balancing
      const crewStats: Record<
        number,
        {
          total: number
          consecutive: number
          lastShift: string | null
          lastDate: string | null
          morning: number
          afternoon: number
          night: number
        }
      > = {}

      // Initialize stats for each crew member and populate with existing assignments
      crew.forEach((member) => {
        crewStats[member.id] = {
          total: 0,
          consecutive: 0,
          lastShift: null,
          lastDate: null,
          morning: 0,
          afternoon: 0,
          night: 0,
        }
      })

      // First pass: calculate current stats from existing assignments
      dates.forEach((dateString) => {
        const currentDate = new Date(dateString)
        const existingAssignments = dutyAssignments[dateString] || []

        existingAssignments.forEach(({ crewId, shift }) => {
          crewStats[crewId].total += 1
          crewStats[crewId][shift as keyof (typeof crewStats)[typeof crewId]] =
            (crewStats[crewId][shift as keyof (typeof crewStats)[typeof crewId]] as number) + 1

          // Update consecutive days
          const prevDate = crewStats[crewId].lastDate
          if (prevDate) {
            const prevDateObj = new Date(prevDate)
            const oneDayDiff = Math.abs(currentDate.getTime() - prevDateObj.getTime()) === 86400000
            if (oneDayDiff) {
              crewStats[crewId].consecutive += 1
            } else {
              crewStats[crewId].consecutive = 1
            }
          } else {
            crewStats[crewId].consecutive = 1
          }

          crewStats[crewId].lastShift = shift
          crewStats[crewId].lastDate = dateString
        })
      })

      // Second pass: fill in missing assignments
      dates.forEach((dateString) => {
        const currentDate = new Date(dateString)

        // Skip dates in the past
        if (currentDate < new Date()) return

        // Initialize assignments for this date if not exist
        if (!newAssignments[dateString]) {
          newAssignments[dateString] = []
        }

        // Get available crew (not marked as "off" in original schedule)
        const availableCrew = crew.filter((member) => {
          const daySchedule = member.schedule?.find((day) => day.date === dateString)
          return !daySchedule || daySchedule.shift !== "off"
        })

        // Get existing assignments for this date
        const existingAssignments = newAssignments[dateString] || []
        const existingMorning = existingAssignments.filter((a) => a.shift === "morning").map((a) => a.crewId)
        const existingAfternoon = existingAssignments.filter((a) => a.shift === "afternoon").map((a) => a.crewId)
        const existingNight = existingAssignments.filter((a) => a.shift === "night").map((a) => a.crewId)

        // Process each shift type
        ;["morning", "afternoon", "night"].forEach((shiftType) => {
          // Skip if this shift is already fully assigned
          const existingForShift =
            shiftType === "morning" ? existingMorning : shiftType === "afternoon" ? existingAfternoon : existingNight
          const neededCrew = shiftType === "night" ? 1 : 2
          const vacancies = neededCrew - existingForShift.length

          if (vacancies <= 0) return

          // Get crew already assigned to other shifts on this datehifts on this date
          const crewAssignedToday = existingAssignments.map((a) => a.crewId)

          // Sort available crew by priority for this shift
          const sortedForShift = [...availableCrew]
            .filter((member) => {
              // Filter out crew already assigned to this date
              return !crewAssignedToday.includes(member.id)
            })
            .sort((a, b) => {
              const statsA = crewStats[a.id]
              const statsB = crewStats[b.id]

              // First prioritize by consecutive days
              if (statsA.consecutive !== statsB.consecutive) {
                return statsA.consecutive - statsB.consecutive
              }

              // Then by specific shift balance (prefer those who haven't done this shift type much)
              if (statsA[shiftType as keyof typeof statsA] !== statsB[shiftType as keyof typeof statsB]) {
                return (
                  (statsA[shiftType as keyof typeof statsA] as number) -
                  (statsB[shiftType as keyof typeof statsB] as number)
                )
              }

              // Finally by total assignments
              return statsA.total - statsB.total
            })

          // Assign crew to this shift
          sortedForShift.slice(0, vacancies).forEach((member) => {
            newAssignments[dateString].push({ crewId: member.id, shift: shiftType })

            // Update stats
            crewStats[member.id].total += 1
            crewStats[member.id][shiftType as keyof (typeof crewStats)[typeof member.id]] =
              (crewStats[member.id][shiftType as keyof (typeof crewStats)[typeof member.id]] as number) + 1

            // Update consecutive days
            const prevDate = crewStats[member.id].lastDate
            if (prevDate) {
              const prevDateObj = new Date(prevDate)
              const oneDayDiff = Math.abs(currentDate.getTime() - prevDateObj.getTime()) === 86400000
              if (oneDayDiff) {
                crewStats[member.id].consecutive += 1
              } else {
                crewStats[member.id].consecutive = 1
              }
            } else {
              crewStats[member.id].consecutive = 1
            }

            crewStats[member.id].lastShift = shiftType
            crewStats[member.id].lastDate = dateString

            // Remove this crew member from available list
            const index = availableCrew.findIndex((c) => c.id === member.id)
            if (index !== -1) {
              availableCrew.splice(index, 1)
            }

            // Send notification if needed
            const previousShift = getPreviousShift(currentDate, member.id)
            if (shouldSendNotification(member.id, currentDate, shiftType, previousAssignments)) {
              sendDutyChangeNotification(member.id, currentDate, shiftType, previousShift)
            }
          })
        })
      })

      setDutyAssignments(newAssignments)
      setIsAiCompleting(false)

      // Show toast notification
      toast({
        title: "AI Completion Finished",
        description: `Remaining duty slots for ${format(currentMonth, "MMMM yyyy")} have been filled`,
      })
    }, 1500)
  }

  // Draggable Crew Member Component
  const CrewMemberItem = ({ member }: { member: CrewMember }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.CREW_MEMBER,
      item: { id: member.id, name: member.name, role: member.role },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }))

    return (
      <motion.div
        ref={drag}
        className={`flex items-center p-1.5 rounded-lg border cursor-move transition-all duration-200 ${
          isDragging ? "opacity-50 bg-accent" : "hover:bg-accent/50 hover:ring-1 hover:ring-blue-500"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Avatar className="h-7 w-7 mr-2">
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
        <div className={`w-2 h-2 rounded-full ${member.onDuty ? "bg-green-500" : "bg-amber-500"}`} />
      </motion.div>
    )
  }

  // Department Section Component
  const DepartmentSection = ({
    title,
    icon,
    children,
    isExpanded,
    onToggle,
  }: {
    title: string
    icon: React.ReactNode
    children: React.ReactNode
    isExpanded: boolean
    onToggle: () => void
  }) => {
    return (
      <Collapsible open={isExpanded} onOpenChange={onToggle} className="mb-3 bg-muted/20 rounded-md overflow-hidden">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-2 border-b cursor-pointer hover:bg-accent/20 transition-colors duration-200 rounded-t-md">
            <div className="flex items-center gap-2">
              {icon}
              <h3 className="text-sm font-medium">{title}</h3>
            </div>
            <div className="flex items-center">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-2 space-y-1">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  // Droppable Calendar Cell
  const CalendarCell = ({ day, crewOnDuty }: { day: Date; crewOnDuty: Array<{ crewId: number; shift: string }> }) => {
    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
    const isCurrentMonth = isSameMonth(day, currentMonth)
    const dateString = format(day, "yyyy-MM-dd")

    // Group crew by shift
    const crewByShift = {
      morning: crewOnDuty.filter((c) => c.shift === "morning").map((c) => c.crewId),
      afternoon: crewOnDuty.filter((c) => c.shift === "afternoon").map((c) => c.crewId),
      night: crewOnDuty.filter((c) => c.shift === "night").map((c) => c.crewId),
    }

    // Create drop refs for each shift zone
    const [{ isOverMorning }, dropMorning] = useDrop(() => ({
      accept: ItemTypes.CREW_MEMBER,
      drop: (item: { id: number }) => {
        addCrewToShift(day, item.id, "morning")
      },
      collect: (monitor) => ({
        isOverMorning: !!monitor.isOver(),
      }),
    }))

    const [{ isOverAfternoon }, dropAfternoon] = useDrop(() => ({
      accept: ItemTypes.CREW_MEMBER,
      drop: (item: { id: number }) => {
        addCrewToShift(day, item.id, "afternoon")
      },
      collect: (monitor) => ({
        isOverAfternoon: !!monitor.isOver(),
      }),
    }))

    const [{ isOverNight }, dropNight] = useDrop(() => ({
      accept: ItemTypes.CREW_MEMBER,
      drop: (item: { id: number }) => {
        addCrewToShift(day, item.id, "night")
      },
      collect: (monitor) => ({
        isOverNight: !!monitor.isOver(),
      }),
    }))

    // Helper function to add crew to a specific shift
    const addCrewToShift = (date: Date, crewId: number, shift: string) => {
      // Save current state before modification
      setPreviousAssignments(dutyAssignments)

      // Get previous shift for notification
      const previousShift = getPreviousShift(date, crewId)

      const dateString = format(date, "yyyy-MM-dd")
      setDutyAssignments((prev) => {
        const newAssignments = { ...prev }
        if (!newAssignments[dateString]) {
          newAssignments[dateString] = []
        }

        // Remove from any existing shift for this date
        newAssignments[dateString] = newAssignments[dateString].filter((assignment) => assignment.crewId !== crewId)

        // Add to the new shift
        newAssignments[dateString].push({ crewId, shift })

        return newAssignments
      })

      // Send notification if needed
      if (shouldSendNotification(crewId, date, shift, previousAssignments)) {
        sendDutyChangeNotification(crewId, date, shift, previousShift)

        // Show toast notification for the admin
        const crewMember = crew.find((m) => m.id === crewId)
        if (crewMember) {
          toast({
            title: "Duty notification sent",
            description: `${crewMember.name} has been notified of their ${shift} shift on ${format(date, "MMMM d")}`,
          })
        }
      }
    }

    // Render crew badges for a specific shift
    const renderCrewBadges = (shiftType: "morning" | "afternoon" | "night", crewIds: number[]) => {
      // Group crew IDs by department/role
      const crewByDepartment: Record<string, number[]> = {}

      crewIds.forEach((crewId) => {
        const member = crew.find((m) => m.id === crewId)
        if (!member) return

        if (!crewByDepartment[member.role]) {
          crewByDepartment[member.role] = []
        }
        crewByDepartment[member.role].push(crewId)
      })

      // Process names to handle duplicates
      const processCrewNames = (deptCrewIds: number[]) => {
        // Get all crew members
        const members = deptCrewIds.map((id) => crew.find((m) => m.id === id)).filter(Boolean) as CrewMember[]

        // Extract first names and check for duplicates
        const firstNames = members.map((m) => m.name.split(" ")[0])
        const duplicateFirstNames = firstNames.filter(
          (name, index) => firstNames.indexOf(name) !== index || firstNames.lastIndexOf(name) !== index,
        )

        // Create a map of display names
        const displayNames = new Map<number, string>()

        members.forEach((member) => {
          if (!member) return

          const nameParts = member.name.split(" ")
          const firstName = nameParts[0]

          if (duplicateFirstNames.includes(firstName)) {
            // If duplicate, add last initial
            const lastName = nameParts[nameParts.length - 1]
            displayNames.set(member.id, `${firstName} ${lastName.charAt(0)}.`)
          } else {
            // If unique, just use first name
            displayNames.set(member.id, firstName)
          }
        })

        return displayNames
      }

      return (
        <>
          {Object.entries(crewByDepartment).map(([department, deptCrewIds]) => {
            const displayNames = processCrewNames(deptCrewIds)

            return (
              <div key={`${dateString}-${shiftType}-${department}`} className="mb-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="text-xs px-1 py-0 mb-0.5">
                        {department}: {deptCrewIds.length}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {deptCrewIds.map((crewId) => {
                        const member = crew.find((m) => m.id === crewId)
                        if (!member) return null
                        return (
                          <div key={`tooltip-${crewId}`} className="flex items-center gap-1">
                            <span>{member.name}</span>
                          </div>
                        )
                      })}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {deptCrewIds.slice(0, 1).map((crewId) => {
                  const member = crew.find((m) => m.id === crewId)
                  if (!member) return null

                  const displayName = displayNames.get(crewId) || `Crew #${crewId}`

                  return (
                    <TooltipProvider key={`${dateString}-${shiftType}-${crewId}`}>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center group">
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0 truncate max-w-[90%] group-hover:bg-accent transition-all duration-200"
                            >
                              <span className="truncate">{displayName}</span>
                            </Badge>
                            {hasAdminPermission && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeCrewFromDate(day, crewId)
                                }}
                              >
                                <X className="h-2.5 w-2.5" />
                              </Button>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start">
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}

                {deptCrewIds.length > 1 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          +{deptCrewIds.length - 1} more
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {deptCrewIds.slice(1).map((crewId) => {
                          const member = crew.find((m) => m.id === crewId)
                          if (!member) return null
                          const displayName = displayNames.get(crewId) || `Crew #${crewId}`
                          return (
                            <div key={`tooltip-${crewId}`} className="flex items-center gap-1">
                              <span>{displayName}</span>
                              <span className="text-xs text-muted-foreground">({member.role})</span>
                            </div>
                          )
                        })}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )
          })}

          {crewIds.length === 0 && hasAdminPermission && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 text-xs px-1 text-muted-foreground opacity-70 hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => {
                e.stopPropagation()
                openAssignModal(day, shiftType)
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          )}
        </>
      )
    }

    return (
      <motion.div
        layout
        className={`min-h-[180px] flex flex-col border rounded-md overflow-hidden transition-all duration-200 ${
          isToday(day) ? "ring-1 ring-primary" : ""
        } ${isSelected ? "ring-2 ring-primary" : ""} ${!isCurrentMonth ? "bg-muted/20 opacity-60" : ""}`}
        onClick={() => handleDateClick(day)}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.15 }}
      >
        {/* Date header */}
        <div className="px-1.5 py-1 flex justify-between items-center border-b bg-background/80">
          <span
            className={`text-sm font-medium ${
              isToday(day)
                ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                : ""
            }`}
          >
            {format(day, "d")}
          </span>
          <Badge variant="outline" className="text-xs">
            {crewOnDuty.length > 0 ? `${crewOnDuty.length} on duty` : ""}
          </Badge>
        </div>

        {/* Shift sections */}
        <div className="flex-1 flex flex-col divide-y divide-border/30">
          {/* Morning shift */}
          <div
            ref={dropMorning}
            className={`flex-1 p-1 space-y-0.5 ${isOverMorning ? "bg-blue-100" : "bg-blue-50/70"} transition-colors duration-200`}
          >
            <div className="flex items-center space-x-1 px-1 mb-1">
              <span className="text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">Morning</span>
            </div>
            <div className="space-y-0.5">{renderCrewBadges("morning", crewByShift.morning)}</div>
          </div>

          {/* Afternoon shift */}
          <div
            ref={dropAfternoon}
            className={`flex-1 p-1 space-y-0.5 ${
              isOverAfternoon ? "bg-amber-100" : "bg-amber-50/70"
            } transition-colors duration-200`}
          >
            <div className="flex items-center space-x-1 px-1 mb-1">
              <span className="text-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">Afternoon</span>
            </div>
            <div className="space-y-0.5">{renderCrewBadges("afternoon", crewByShift.afternoon)}</div>
          </div>

          {/* Night shift */}
          <div
            ref={dropNight}
            className={`flex-1 p-1 space-y-0.5 ${
              isOverNight ? "bg-indigo-100" : "bg-indigo-50/70"
            } transition-colors duration-200`}
          >
            <div className="flex items-center space-x-1 px-1 mb-1">
              <span className="text-indigo-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">Night</span>
            </div>
            <div className="space-y-0.5">{renderCrewBadges("night", crewByShift.night)}</div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Weekly View Day Component
  const WeeklyViewDay = ({ day }: { day: Date }) => {
    const isCurrentDay = isToday(day)
    const dateString = format(day, "yyyy-MM-dd")
    const crewOnDuty = getCrewOnDuty(day)

    // Group crew by shift
    const crewByShift = {
      morning: crewOnDuty.filter((c) => c.shift === "morning").map((c) => c.crewId),
      afternoon: crewOnDuty.filter((c) => c.shift === "afternoon").map((c) => c.crewId),
      night: crewOnDuty.filter((c) => c.shift === "night").map((c) => c.crewId),
    }

    // Group crew by department for each shift
    const getDepartmentGroups = (crewIds: number[]) => {
      const deptGroups: Record<string, CrewMember[]> = {}

      crewIds.forEach((crewId) => {
        const member = crew.find((m) => m.id === crewId)
        if (!member) return

        if (!deptGroups[member.role]) {
          deptGroups[member.role] = []
        }
        deptGroups[member.role].push(member)
      })

      return deptGroups
    }

    const morningDepts = getDepartmentGroups(crewByShift.morning)
    const afternoonDepts = getDepartmentGroups(crewByShift.afternoon)
    const nightDepts = getDepartmentGroups(crewByShift.night)

    const renderDepartmentGroup = (department: string, members: CrewMember[], shiftType: string) => {
      // Process names to handle duplicates
      const firstNames = members.map((m) => m.name.split(" ")[0])
      const duplicateFirstNames = firstNames.filter(
        (name, index) => firstNames.indexOf(name) !== index || firstNames.lastIndexOf(name) !== index,
      )

      return (
        <div key={`${dateString}-${shiftType}-${department}`} className="mb-2">
          <Badge variant="secondary" className="text-xs mb-1">
            {department}
          </Badge>
          <div className="space-y-1">
            {members.map((member) => {
              const nameParts = member.name.split(" ")
              const firstName = nameParts[0]
              let displayName = firstName

              if (duplicateFirstNames.includes(firstName)) {
                // If duplicate, add last initial
                const lastName = nameParts[nameParts.length - 1]
                displayName = `${firstName} ${lastName.charAt(0)}.`
              }

              return (
                <TooltipProvider key={`weekly-${dateString}-${shiftType}-${member.id}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center p-1 rounded-md hover:bg-accent/50 transition-colors duration-200">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{displayName || `Crew #${member.id}`}</p>
                        </div>
                        {hasAdminPermission && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 hover:opacity-100 transition-opacity duration-200"
                            onClick={() => removeCrewFromDate(day, member.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs">{member.role}</p>
                      <p className="text-xs text-muted-foreground">
                        {shiftType === "morning"
                          ? "Morning Shift (08:00-16:00)"
                          : shiftType === "afternoon"
                            ? "Afternoon Shift (16:00-00:00)"
                            : "Night Shift (00:00-08:00)"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        </div>
      )
    }

    return (
      <Card className={`${isCurrentDay ? "ring-1 ring-primary" : ""}`}>
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm flex justify-between items-center">
            <span>{format(day, "EEEE")}</span>
            <Badge variant={isCurrentDay ? "default" : "outline"} className="text-xs">
              {format(day, "MMM d")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-3">
            <div>
              <div className="flex items-center mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div>
                <span className="text-xs font-medium">Morning</span>
              </div>
              {Object.keys(morningDepts).length > 0 ? (
                Object.entries(morningDepts).map(([dept, members]) => renderDepartmentGroup(dept, members, "morning"))
              ) : (
                <div className="flex items-center justify-center p-2 text-xs text-muted-foreground">
                  No crew assigned
                </div>
              )}
              {hasAdminPermission && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-7 text-xs mt-1"
                  onClick={() => openAssignModal(day, "morning")}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Assign
                </Button>
              )}
            </div>

            <div>
              <div className="flex items-center mb-1">
                <div className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></div>
                <span className="text-xs font-medium">Afternoon</span>
              </div>
              {Object.keys(afternoonDepts).length > 0 ? (
                Object.entries(afternoonDepts).map(([dept, members]) =>
                  renderDepartmentGroup(dept, members, "afternoon"),
                )
              ) : (
                <div className="flex items-center justify-center p-2 text-xs text-muted-foreground">
                  No crew assigned
                </div>
              )}
              {hasAdminPermission && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-7 text-xs mt-1"
                  onClick={() => openAssignModal(day, "afternoon")}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Assign
                </Button>
              )}
            </div>

            <div>
              <div className="flex items-center mb-1">
                <div className="w-2 h-2 rounded-full bg-indigo-700 mr-1.5"></div>
                <span className="text-xs font-medium">Night</span>
              </div>
              {Object.keys(nightDepts).length > 0 ? (
                Object.entries(nightDepts).map(([dept, members]) => renderDepartmentGroup(dept, members, "night"))
              ) : (
                <div className="flex items-center justify-center p-2 text-xs text-muted-foreground">
                  No crew assigned
                </div>
              )}
              {hasAdminPermission && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-7 text-xs mt-1"
                  onClick={() => openAssignModal(day, "night")}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Assign
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Tips Popover Content
  const TipsContent = () => (
    <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h4 className="font-medium">Drag & Drop Assignment</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Drag crew members from departments in the sidebar directly onto a shift in the calendar to assign them.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h4 className="font-medium">AI Tools</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          <strong>AI Assign:</strong> Creates a completely new schedule for the entire month.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>AI Complete:</strong> Keeps your existing assignments and only fills in the empty slots.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h4 className="font-medium">Calendar Views</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Switch between Monthly and Weekly views to see different perspectives of the schedule.
        </p>
        <p className="text-sm text-muted-foreground">Click on any date to see detailed shift assignments.</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h4 className="font-medium">Notifications</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Use "Send Duty Notification" to alert crew members of their assignments via smartwatch and mobile app.
        </p>
      </div>
    </div>
  )

  useEffect(() => {
    if (showSidebar && !hasShownSidebarHelp) {
      toast({
        title: "Drag & Drop Assignment",
        description: "Drag crew members from departments onto calendar days to assign shifts",
        duration: 5000,
      })
      setHasShownSidebarHelp(true)
    }
  }, [showSidebar, hasShownSidebarHelp, toast])

  // Check if user has permission for admin actions
  const hasAdminPermission = userRole === "admin" || userRole === "chief"

  // Add this effect to handle conditional display based on user's department
  useEffect(() => {
    // If user is from Interior team, hide other departments unless explicitly expanded
    if (userRole === "stewardess" || userRole === "chief") {
      setExpandedDepartments({
        "Interior Department": true,
        "Deck Department": false,
        "Engine Department": false,
        "Culinary Department": false,
      })
      setSelectedDepartment("Interior Department")
    }
  }, [userRole])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        <Tabs defaultValue="monthly" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <TabsList>
                <TabsTrigger value="monthly" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Monthly View</span>
                  <span className="sm:hidden">Monthly</span>
                </TabsTrigger>
                <TabsTrigger value="weekly" className="flex items-center gap-1">
                  <Grid className="h-4 w-4" />
                  <span className="hidden sm:inline">Weekly View</span>
                  <span className="sm:hidden">Weekly</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {hasAdminPermission && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSendDutyNotification}
                  disabled={isSendingNotifications}
                >
                  {isSendingNotifications ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <Bell className="h-4 w-4 mr-1" />
                  )}
                  <span className="hidden sm:inline">Send Duty Notification</span>
                  <span className="sm:hidden">Notify</span>
                </Button>
              )}

              {hasAdminPermission && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleRevert}
                  disabled={Object.keys(previousAssignments).length === 0}
                >
                  <Undo className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Revert</span>
                </Button>
              )}

              {hasAdminPermission && (
                <Button size="sm" variant="destructive" onClick={handleClearMonth}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              )}

              {hasAdminPermission && (
                <Button size="sm" onClick={handleAiAssign} disabled={isAiAssigning} className="relative">
                  {isAiAssigning ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="hidden sm:inline">Assigning...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">AI Assign</span>
                      <span className="sm:hidden">AI</span>
                    </>
                  )}
                </Button>
              )}

              {hasAdminPermission && (
                <Button size="sm" onClick={handleAiComplete} disabled={isAiCompleting} className="relative">
                  {isAiCompleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="hidden sm:inline">Completing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">AI Complete</span>
                      <span className="sm:hidden">Complete</span>
                    </>
                  )}
                </Button>
              )}

              {hasAdminPermission && (
                <Button size="sm" onClick={() => handleDateClick(new Date())}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Add Duty</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              )}

              <Button size="sm" variant="outline" onClick={() => setShowSidebar(!showSidebar)}>
                {showSidebar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="hidden sm:inline ml-1">{showSidebar ? "Hide Departments" : "Show Departments"}</span>
                <span className="sm:hidden">{showSidebar ? "Hide" : "Show"}</span>
              </Button>
            </div>
          </div>

          <TabsContent value="monthly" className="mt-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Monthly stats summary */}
              <Card className="hidden lg:block">
                <CardContent className="p-3 flex gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Total Crew</p>
                    <p className="text-xl font-bold">{stats.totalCrew}</p>
                  </div>
                  <Separator orientation="vertical" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">On Duty</p>
                    <p className="text-xl font-bold text-green-500">{stats.onDuty}</p>
                  </div>
                  <Separator orientation="vertical" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Off Duty</p>
                    <p className="text-xl font-bold text-amber-500">{stats.offDuty}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4">
              {/* Departments Sidebar */}
              {showSidebar && (
                <Card className="xl:w-[300px] w-full">
                  <CardContent className="p-4">
                    <div className="flex flex-col h-full">
                      {/* Filters Section */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-sm font-medium">Filters</h3>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Filter by Department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Interior Department">Interior Department</SelectItem>
                              <SelectItem value="Deck Department">Deck Department</SelectItem>
                              <SelectItem value="Engine Department">Engine Department</SelectItem>
                              <SelectItem value="Culinary Department">Culinary Department</SelectItem>
                              <SelectItem value="All Departments">All Departments</SelectItem>
                            </SelectContent>
                          </Select>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="available-only"
                              checked={showOnlyAvailable}
                              onCheckedChange={setShowOnlyAvailable}
                            />
                            <Label htmlFor="available-only" className="text-xs">
                              Show only available
                            </Label>
                          </div>

                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Search crew..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-8 h-8 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Departments & Crew */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-sm font-medium">Departments</h3>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {filteredCrew.length} crew
                          </Badge>
                        </div>

                        {hasAdminPermission && (
                          <p className="text-xs text-muted-foreground">
                            Drag crew members to calendar days to assign shifts
                          </p>
                        )}

                        <ScrollArea className="overflow-y-auto max-h-[calc(100vh-380px)] pr-2">
                          <div className="space-y-1">
                            {/* Interior Department - Always shown first and expanded by default */}
                            <DepartmentSection
                              title="Interior Department"
                              icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                              isExpanded={expandedDepartments["Interior Department"]}
                              onToggle={() => {
                                setExpandedDepartments((prev) => ({
                                  ...prev,
                                  "Interior Department": !prev["Interior Department"],
                                }))
                              }}
                            >
                              {departmentMapping["Interior Department"].map((role) => {
                                const members = crewByDepartment["Interior Department"][role] || []
                                if (members.length === 0) return null

                                return (
                                  <div key={role} className="mb-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-medium">{role}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {members.length}
                                      </Badge>
                                    </div>
                                    <div className="space-y-1 pl-2">
                                      {members.map((member) =>
                                        hasAdminPermission ? (
                                          <CrewMemberItem key={member.id} member={member} />
                                        ) : (
                                          <div key={member.id} className="flex items-center p-2 rounded-lg border">
                                            <Avatar className="h-7 w-7 mr-2">
                                              <AvatarImage
                                                src={member.avatar || "/placeholder.svg"}
                                                alt={member.name}
                                              />
                                              <AvatarFallback>
                                                {member.name
                                                  .split(" ")
                                                  .map((n) => n[0])
                                                  .join("")}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium truncate">{member.name}</p>
                                              <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                                            </div>
                                            <div
                                              className={`w-2 h-2 rounded-full ${member.onDuty ? "bg-green-500" : "bg-amber-500"}`}
                                            />
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </DepartmentSection>

                            {/* Other Departments - Collapsed by default */}
                            {["Deck Department", "Engine Department", "Culinary Department"].map((dept) => {
                              // Skip if no crew in this department
                              const hasCrewInDept = departmentMapping[dept].some(
                                (role) => (crewByDepartment[dept][role]?.length || 0) > 0,
                              )

                              if (!hasCrewInDept) return null

                              const deptIcon =
                                dept === "Deck Department" ? (
                                  <Anchor className="h-4 w-4 text-muted-foreground" />
                                ) : dept === "Engine Department" ? (
                                  <Settings className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                                )

                              return (
                                <DepartmentSection
                                  key={dept}
                                  title={dept}
                                  icon={deptIcon}
                                  isExpanded={expandedDepartments[dept]}
                                  onToggle={() => {
                                    setExpandedDepartments((prev) => ({
                                      ...prev,
                                      [dept]: !prev[dept],
                                    }))
                                  }}
                                >
                                  {departmentMapping[dept].map((role) => {
                                    const members = crewByDepartment[dept][role] || []
                                    if (members.length === 0) return null

                                    return (
                                      <div key={role} className="mb-3">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-xs font-medium">{role}</span>
                                          <Badge variant="outline" className="text-xs">
                                            {members.length}
                                          </Badge>
                                        </div>
                                        <div className="space-y-1 pl-2">
                                          {members.map((member) =>
                                            hasAdminPermission ? (
                                              <CrewMemberItem key={member.id} member={member} />
                                            ) : (
                                              <div key={member.id} className="flex items-center p-2 rounded-lg border">
                                                <Avatar className="h-7 w-7 mr-2">
                                                  <AvatarImage
                                                    src={member.avatar || "/placeholder.svg"}
                                                    alt={member.name}
                                                  />
                                                  <AvatarFallback>
                                                    {member.name
                                                      .split(" ")
                                                      .map((n) => n[0])
                                                      .join("")}
                                                  </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-medium truncate">{member.name}</p>
                                                  <p className="text-xs text-muted-foreground truncate">
                                                    {member.role}
                                                  </p>
                                                </div>
                                                <div
                                                  className={`w-2 h-2 rounded-full ${member.onDuty ? "bg-green-500" : "bg-amber-500"}`}
                                                />
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </DepartmentSection>
                              )
                            })}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Calendar */}
              <div className="overflow-x-auto w-full">
                <div className="min-w-[1000px]">
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center font-medium text-sm py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                      <div key={`empty-start-${index}`} className="min-h-[180px] border rounded-md bg-muted/20"></div>
                    ))}

                    {daysInMonth.map((day) => {
                      const crewOnDuty = getCrewOnDuty(day)
                      return <CalendarCell key={day.toString()} day={day} crewOnDuty={crewOnDuty} />
                    })}

                    {Array.from({ length: (7 - ((monthStart.getDay() + daysInMonth.length) % 7)) % 7 }).map(
                      (_, index) => (
                        <div key={`empty-end-${index}`} className="min-h-[180px] border rounded-md bg-muted/20"></div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={previousWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-bold">
                  {format(currentWeekStart, "MMM d")} - {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
                </h2>
                <Button variant="outline" size="icon" onClick={nextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Roles">All Roles</SelectItem>
                    {allDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative w-[200px]">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search crew..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
              {daysInWeek.map((day) => (
                <WeeklyViewDay key={day.toString()} day={day} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {selectedDate && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h3 className="font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
                <div className="flex gap-2 self-end sm:self-auto">
                  {hasAdminPermission && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSendDutyNotification}
                      disabled={isSendingNotifications}
                    >
                      {isSendingNotifications ? (
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <Bell className="h-4 w-4 mr-1" />
                      )}
                      Send Duty Notification
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setSelectedDate(null)}>
                    Close
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Morning shift */}
                <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </span>
                      <h4 className="font-medium">Morning Shift</h4>
                      <span className="text-xs text-muted-foreground">(08:00-16:00)</span>
                    </div>
                    {hasAdminPermission && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2"
                        onClick={() => openAssignModal(selectedDate, "morning")}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Assign
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {/* Render by department */}
                    {(() => {
                      const morningCrewIds = getCrewOnDuty(selectedDate)
                        .filter((c) => c.shift === "morning")
                        .map((c) => c.crewId)

                      // Group by department
                      const deptGroups: Record<string, CrewMember[]> = {}

                      morningCrewIds.forEach((crewId) => {
                        const member = crew.find((m) => m.id === crewId)
                        if (!member) return

                        if (!deptGroups[member.role]) {
                          deptGroups[member.role] = []
                        }
                        deptGroups[member.role].push(member)
                      })

                      if (Object.keys(deptGroups).length === 0) {
                        return (
                          <div className="flex items-center justify-center p-2 border border-dashed rounded-md">
                            <span className="text-xs text-muted-foreground">No crew assigned</span>
                          </div>
                        )
                      }

                      return Object.entries(deptGroups).map(([dept, members]) => {
                        // Process names to handle duplicates
                        const firstNames = members.map((m) => m.name.split(" ")[0])
                        const duplicateFirstNames = firstNames.filter(
                          (name, index) => firstNames.indexOf(name) !== index || firstNames.lastIndexOf(name) !== index,
                        )

                        return (
                          <div key={`morning-dept-${dept}`} className="space-y-1">
                            <Badge variant="secondary" className="text-xs">
                              {dept}
                            </Badge>
                            {members.map((member) => {
                              const nameParts = member.name.split(" ")
                              const firstName = nameParts[0]
                              let displayName = firstName

                              if (duplicateFirstNames.includes(firstName)) {
                                // If duplicate, add last initial
                                const lastName = nameParts[nameParts.length - 1]
                                displayName = `${firstName} ${lastName.charAt(0)}.`
                              }

                              return (
                                <div
                                  key={`detail-morning-${member.id}`}
                                  className="flex items-center justify-between p-2 bg-white rounded-md border"
                                >
                                  <div className="flex items-center">
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                      <AvatarFallback>
                                        {member.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-sm truncate max-w-[120px]" title={member.name}>
                                        {displayName || `Crew #${member.id}`}
                                      </p>
                                    </div>
                                  </div>
                                  {hasAdminPermission && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => removeCrewFromDate(selectedDate, member.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )
                      })
                    })()}
                  </div>
                </div>

                {/* Afternoon shift */}
                <div className="space-y-2 p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-amber-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="5" />
                          <line x1="12" y1="1" x2="12" y2="3" />
                          <line x1="12" y1="21" x2="12" y2="23" />
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                          <line x1="1" y1="12" x2="3" y2="12" />
                          <line x1="21" y1="12" x2="23" y2="12" />
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                      </span>
                      <h4 className="font-medium">Afternoon Shift</h4>
                      <span className="text-xs text-muted-foreground">(16:00-00:00)</span>
                    </div>
                    {hasAdminPermission && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2"
                        onClick={() => openAssignModal(selectedDate, "afternoon")}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Assign
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {/* Render by department */}
                    {(() => {
                      const afternoonCrewIds = getCrewOnDuty(selectedDate)
                        .filter((c) => c.shift === "afternoon")
                        .map((c) => c.crewId)

                      // Group by department
                      const deptGroups: Record<string, CrewMember[]> = {}

                      afternoonCrewIds.forEach((crewId) => {
                        const member = crew.find((m) => m.id === crewId)
                        if (!member) return

                        if (!deptGroups[member.role]) {
                          deptGroups[member.role] = []
                        }
                        deptGroups[member.role].push(member)
                      })

                      if (Object.keys(deptGroups).length === 0) {
                        return (
                          <div className="flex items-center justify-center p-2 border border-dashed rounded-md">
                            <span className="text-xs text-muted-foreground">No crew assigned</span>
                          </div>
                        )
                      }

                      return Object.entries(deptGroups).map(([dept, members]) => (
                        <div key={`afternoon-dept-${dept}`} className="space-y-1">
                          <Badge variant="secondary" className="text-xs">
                            {dept}
                          </Badge>
                          {members.map((member) => (
                            <div
                              key={`detail-afternoon-${member.id}`}
                              className="flex items-center justify-between p-2 bg-white rounded-md border"
                            >
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                  <AvatarFallback>
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm truncate max-w-[120px]" title={member.name}>
                                    {member.name}
                                  </p>
                                </div>
                              </div>
                              {hasAdminPermission && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => removeCrewFromDate(selectedDate, member.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      ))
                    })()}
                  </div>
                </div>

                {/* Night shift */}
                <div className="space-y-2 p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                      </span>
                      <h4 className="font-medium">Night Shift</h4>
                      <span className="text-xs text-muted-foreground">(00:00-08:00)</span>
                    </div>
                    {hasAdminPermission && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2"
                        onClick={() => openAssignModal(selectedDate, "night")}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Assign
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {/* Render by department */}
                    {(() => {
                      const nightCrewIds = getCrewOnDuty(selectedDate)
                        .filter((c) => c.shift === "night")
                        .map((c) => c.crewId)

                      // Group by department
                      const deptGroups: Record<string, CrewMember[]> = {}

                      nightCrewIds.forEach((crewId) => {
                        const member = crew.find((m) => m.id === crewId)
                        if (!member) return

                        if (!deptGroups[member.role]) {
                          deptGroups[member.role] = []
                        }
                        deptGroups[member.role].push(member)
                      })

                      if (Object.keys(deptGroups).length === 0) {
                        return (
                          <div className="flex items-center justify-center p-2 border border-dashed rounded-md">
                            <span className="text-xs text-muted-foreground">No crew assigned</span>
                          </div>
                        )
                      }

                      return Object.entries(deptGroups).map(([dept, members]) => (
                        <div key={`night-dept-${dept}`} className="space-y-1">
                          <Badge variant="secondary" className="text-xs">
                            {dept}
                          </Badge>
                          {members.map((member) => (
                            <div
                              key={`detail-night-${member.id}`}
                              className="flex items-center justify-between p-2 bg-white rounded-md border"
                            >
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                  <AvatarFallback>
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm truncate max-w-[120px]" title={member.name}>
                                    {member.name}
                                  </p>
                                </div>
                              </div>
                              {hasAdminPermission && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => removeCrewFromDate(selectedDate, member.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      ))
                    })()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assign Shift Modal */}
        <AssignShiftModal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          date={assignModalDate}
          shift={assignModalShift}
          crew={crew}
          onAssign={handleAssignMultipleCrew}
          existingAssignments={getExistingAssignmentsByShift(assignModalDate)}
        />

        {/* Floating Tips Button */}
        <Popover open={showTipsPopover} onOpenChange={setShowTipsPopover}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="fixed bottom-4 right-4 shadow-md z-50 rounded-full"
              onClick={() => setShowTipsPopover(true)}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Tips
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end" alignOffset={-20}>
            <TipsContent />
          </PopoverContent>
        </Popover>
      </div>
    </DndProvider>
  )
}
