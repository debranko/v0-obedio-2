"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, Calendar, Edit, Home, Info, MapPin, MessageSquare, Phone, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

import type { CrewMember } from "@/lib/crew-data"

interface CrewDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  crewMember: CrewMember
}

export function CrewDetailsDrawer({ isOpen, onClose, crewMember }: CrewDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState("personal-info")

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-bold">Crew Member Details</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <Avatar className="h-24 w-24 border-2 border-background">
                <AvatarImage src={crewMember.avatar || "/placeholder.svg"} alt={crewMember.name} />
                <AvatarFallback>
                  {crewMember.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold">{crewMember.name}</h2>
                <Badge className="mt-1">{crewMember.role}</Badge>
              </div>
            </div>

            <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{crewMember.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>{crewMember.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>{crewMember.experience} experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span>{crewMember.nationality}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="personal-info" className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Info</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="assigned-areas" className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Areas</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center">
                <Award className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Performance</span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="personal-info" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Languages</h3>
                        <div className="flex flex-wrap gap-1">
                          {crewMember.languages.map((language) => (
                            <Badge key={language} variant="secondary">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Specialties</h3>
                        <div className="flex flex-wrap gap-1">
                          {crewMember.specialties?.map((specialty) => (
                            <Badge key={specialty} variant="outline">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Certifications</h3>
                        <div className="flex flex-wrap gap-1">
                          {crewMember.certifications?.map((certification) => (
                            <Badge key={certification} variant="outline" className="bg-muted">
                              {certification}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium mb-1">Start Date</h3>
                          <p className="text-sm text-muted-foreground">{crewMember.startDate}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-1">Status</h3>
                          <Badge variant={crewMember.onDuty ? "default" : "secondary"}>
                            {crewMember.onDuty ? "On Duty" : "Off Duty"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="schedule" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-sm font-medium mb-4">Current Week Schedule</h3>
                      <div className="space-y-3">
                        {crewMember.schedule?.map((day) => (
                          <div key={day.date} className="flex items-center justify-between p-2 rounded-md border">
                            <div>
                              <p className="font-medium">
                                {new Date(day.date).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                              {day.shift !== "off" && (
                                <p className="text-sm text-muted-foreground">
                                  {day.startTime} - {day.endTime} • {day.location}
                                </p>
                              )}
                            </div>
                            <Badge variant={day.shift === "off" ? "outline" : getShiftBadgeVariant(day.shift)}>
                              {day.shift === "off" ? "Day Off" : capitalizeFirstLetter(day.shift) + " Shift"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="assigned-areas" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-sm font-medium mb-4">Assigned Areas</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {crewMember.assignedRooms.map((room) => (
                          <div key={room} className="flex items-center p-3 rounded-md border">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{room}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="performance" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-sm font-medium mb-4">Performance Metrics</h3>
                      <div className="text-center p-8">
                        <p className="text-muted-foreground">Performance data will be available in the next update.</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

// Helper functions
function getShiftBadgeVariant(shift: string) {
  switch (shift) {
    case "morning":
      return "default"
    case "afternoon":
      return "secondary"
    case "night":
      return "destructive"
    default:
      return "outline"
  }
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
