"use client"

import { useState } from "react"
import { CalendarIcon, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { type CrewMember, rotationTemplates, shiftPatterns, yachtLocations } from "@/lib/crew-data"

interface DutyAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  crew: CrewMember[]
}

export function DutyAssignmentModal({ isOpen, onClose, crew }: DutyAssignmentModalProps) {
  const [activeTab, setActiveTab] = useState("single-assignment")
  const [selectedCrew, setSelectedCrew] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [selectedShiftPattern, setSelectedShiftPattern] = useState("standard")
  const [selectedRotation, setSelectedRotation] = useState("4-2")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [commandOpen, setCommandOpen] = useState(false)

  const handleSubmit = () => {
    // Here you would implement the actual duty assignment logic
    console.log({
      selectedCrew,
      dateRange,
      selectedShiftPattern,
      selectedRotation,
      selectedLocation,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Duty</DialogTitle>
          <DialogDescription>Schedule crew members for duty shifts and rotations.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="single-assignment">Single Assignment</TabsTrigger>
            <TabsTrigger value="rotation-pattern">Rotation Pattern</TabsTrigger>
          </TabsList>

          <TabsContent value="single-assignment" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="crew-select">Select Crew Members</Label>
                <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={commandOpen}
                      className="w-full justify-between"
                    >
                      {selectedCrew.length > 0
                        ? `${selectedCrew.length} crew members selected`
                        : "Select crew members..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search crew..." />
                      <CommandList>
                        <CommandEmpty>No crew member found.</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-auto">
                          {crew.map((member) => (
                            <CommandItem
                              key={member.id}
                              onSelect={() => {
                                const value = member.id.toString()
                                setSelectedCrew(
                                  selectedCrew.includes(value)
                                    ? selectedCrew.filter((item) => item !== value)
                                    : [...selectedCrew, value],
                                )
                              }}
                            >
                              <Checkbox checked={selectedCrew.includes(member.id.toString())} className="mr-2" />
                              <span>{member.name}</span>
                              <span className="ml-2 text-xs text-muted-foreground">{member.role}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? format(dateRange.to, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Shift Pattern</Label>
                <RadioGroup value={selectedShiftPattern} onValueChange={setSelectedShiftPattern}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {shiftPatterns.map((pattern) => (
                      <div key={pattern.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={pattern.id} id={`shift-${pattern.id}`} />
                        <Label htmlFor={`shift-${pattern.id}`} className="flex flex-col">
                          <span>{pattern.name}</span>
                          <span className="text-xs text-muted-foreground">{pattern.description}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {yachtLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Add any additional notes..." />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rotation-pattern" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="crew-select">Select Crew Members</Label>
                <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={commandOpen}
                      className="w-full justify-between"
                    >
                      {selectedCrew.length > 0
                        ? `${selectedCrew.length} crew members selected`
                        : "Select crew members..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search crew..." />
                      <CommandList>
                        <CommandEmpty>No crew member found.</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-auto">
                          {crew.map((member) => (
                            <CommandItem
                              key={member.id}
                              onSelect={() => {
                                const value = member.id.toString()
                                setSelectedCrew(
                                  selectedCrew.includes(value)
                                    ? selectedCrew.filter((item) => item !== value)
                                    : [...selectedCrew, value],
                                )
                              }}
                            >
                              <Checkbox checked={selectedCrew.includes(member.id.toString())} className="mr-2" />
                              <span>{member.name}</span>
                              <span className="ml-2 text-xs text-muted-foreground">{member.role}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Rotation Template</Label>
                <RadioGroup value={selectedRotation} onValueChange={setSelectedRotation}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {rotationTemplates.map((template) => (
                      <div key={template.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={template.id} id={`rotation-${template.id}`} />
                        <Label htmlFor={`rotation-${template.id}`} className="flex flex-col">
                          <span>{template.name}</span>
                          <span className="text-xs text-muted-foreground">{template.description}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Duration (weeks)</Label>
                  <Input type="number" min="1" defaultValue="4" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Shift Times</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs">Morning</Label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input type="time" defaultValue="07:00" />
                      </div>
                      <span>-</span>
                      <div className="flex-1">
                        <Input type="time" defaultValue="15:00" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Afternoon</Label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input type="time" defaultValue="15:00" />
                      </div>
                      <span>-</span>
                      <div className="flex-1">
                        <Input type="time" defaultValue="23:00" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Night</Label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input type="time" defaultValue="23:00" />
                      </div>
                      <span>-</span>
                      <div className="flex-1">
                        <Input type="time" defaultValue="07:00" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Assign Duty</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
