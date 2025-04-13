"use client"

import { useState } from "react"
import { Calendar, Clock, Filter, LayoutGrid, MapPin, Search } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { CrewCards } from "@/components/crew/crew-cards"
import { EnhancedDutyCalendar } from "@/components/crew/enhanced-duty-calendar"
import { DutyAssignmentModal } from "@/components/crew/duty-assignment-modal"
import { crewData, crewRoles } from "@/lib/crew-data"

export default function CrewPage() {
  const [activeTab, setActiveTab] = useState("crew-cards")
  const [selectedRole, setSelectedRole] = useState("All Roles")
  const [searchQuery, setSearchQuery] = useState("")
  const [showOnDutyOnly, setShowOnDutyOnly] = useState(false)
  const [isAssignDutyOpen, setIsAssignDutyOpen] = useState(false)

  // Filter crew by role, search query, and duty status
  const filteredCrew = crewData
    .filter((member) => selectedRole === "All Roles" || member.role === selectedRole)
    .filter((member) => member.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((member) => !showOnDutyOnly || member.onDuty)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Crew Management</h1>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsAssignDutyOpen(true)}>
            <Clock className="mr-2 h-4 w-4" />
            Change Duty
          </Button>
          <Button variant="outline" asChild>
            <Link href="/locations">
              <MapPin className="mr-2 h-4 w-4" />
              Assign Crew
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="crew-cards" className="flex items-center">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Crew Cards</span>
                </TabsTrigger>
                <TabsTrigger value="duty-calendar" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Duty Calendar</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center">
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      {crewRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative w-[200px]">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search crew..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="on-duty-filter" checked={showOnDutyOnly} onCheckedChange={setShowOnDutyOnly} />
                  <Label htmlFor="on-duty-filter">On Duty Only</Label>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <TabsContent value="crew-cards" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <CrewCards crew={filteredCrew} />
                </motion.div>
              </TabsContent>

              <TabsContent value="duty-calendar" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <EnhancedDutyCalendar crew={crewData} />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>

      <DutyAssignmentModal isOpen={isAssignDutyOpen} onClose={() => setIsAssignDutyOpen(false)} crew={crewData} />
    </div>
  )
}
