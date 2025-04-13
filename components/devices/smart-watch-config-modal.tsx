"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertCircle,
  Bell,
  Check,
  Clock,
  Download,
  Globe,
  HelpCircle,
  MapPin,
  Moon,
  Palette,
  RotateCcw,
  Search,
  Sun,
  User,
  Vibrate,
  Watch,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface SmartWatchConfigModalProps {
  watch: any
  isOpen: boolean
  onClose: () => void
  onSave: (updatedWatch: any) => void
  availableCrewMembers: any[]
}

export function SmartWatchConfigModal({
  watch,
  isOpen,
  onClose,
  onSave,
  availableCrewMembers,
}: SmartWatchConfigModalProps) {
  const [config, setConfig] = useState({
    id: watch.id,
    crewMember: watch.crewMember,
    battery: watch.battery,
    signal: watch.signal,
    status: watch.status,
    lastSeen: watch.lastSeen,
    charging: watch.charging,
    settings: {
      ...watch.settings,
    },
  })

  const [activeTab, setActiveTab] = useState("crew")
  const [searchTerm, setSearchTerm] = useState("")
  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false)
  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(false)
  const [isLocatingWatch, setIsLocatingWatch] = useState(false)

  // Filter crew members based on search term
  const filteredCrewMembers = availableCrewMembers.filter((crew) => {
    return (
      crew.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crew.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Handle crew assignment
  const handleAssignCrew = (crew: any) => {
    setConfig({
      ...config,
      crewMember: crew,
    })
  }

  // Handle unassign watch
  const handleUnassignWatch = () => {
    setConfig({
      ...config,
      crewMember: null,
    })
    setIsUnassignDialogOpen(false)
  }

  // Handle check for updates
  const handleCheckForUpdates = () => {
    setIsCheckingForUpdates(true)
    setTimeout(() => {
      setIsCheckingForUpdates(false)
      setConfig({
        ...config,
        settings: {
          ...config.settings,
          firmwareVersion: "2.3.2",
        },
      })
    }, 2000)
  }

  // Handle locate watch
  const handleLocateWatch = () => {
    setIsLocatingWatch(true)
    setTimeout(() => {
      setIsLocatingWatch(false)
    }, 3000)
  }

  // Handle save configuration
  const handleSave = () => {
    onSave(config)
  }

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            className="p-6"
          >
            <DialogHeader className="mb-6">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Watch className="h-5 w-5 text-primary" />
                Configure Smart Watch
                {config.crewMember && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    {config.crewMember.name} • {config.crewMember.role}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="crew" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="crew" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Crew Assignment
                </TabsTrigger>
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Watch className="h-4 w-4" />
                  General Settings
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location & Security
                </TabsTrigger>
                <TabsTrigger value="themes" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Themes
                </TabsTrigger>
              </TabsList>

              {/* Crew Assignment Tab */}
              <TabsContent value="crew" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Assign Smartwatch to Crew Member</h3>
                    {config.crewMember && (
                      <AlertDialog open={isUnassignDialogOpen} onOpenChange={setIsUnassignDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive">
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Unassign Smartwatch
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will unassign the smartwatch from {config.crewMember.name}. The watch will be
                              available for reassignment.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleUnassignWatch}>Unassign</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search crew members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="max-h-[300px] overflow-y-auto">
                      {filteredCrewMembers.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">No crew members found</div>
                      ) : (
                        <div className="divide-y">
                          {filteredCrewMembers.map((crew) => (
                            <div
                              key={crew.id}
                              className={`p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer transition-colors ${
                                config.crewMember?.id === crew.id ? "bg-primary/10" : ""
                              }`}
                              onClick={() => handleAssignCrew(crew)}
                            >
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={crew.avatar || "/placeholder.svg"} alt={crew.name} />
                                  <AvatarFallback>
                                    {crew.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{crew.name}</div>
                                  <div className="text-sm text-muted-foreground">{crew.role}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="outline"
                                  className={
                                    crew.onDuty
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-slate-100 text-slate-700 border-slate-200"
                                  }
                                >
                                  {crew.onDuty ? "On Duty" : "Off Duty"}
                                </Badge>
                                {config.crewMember?.id === crew.id && <Check className="h-5 w-5 text-primary" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {config.crewMember && (
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={config.crewMember.avatar || "/placeholder.svg"}
                            alt={config.crewMember.name}
                          />
                          <AvatarFallback>
                            {config.crewMember.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-lg">{config.crewMember.name}</div>
                          <div className="text-sm text-muted-foreground">{config.crewMember.role}</div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            config.crewMember.onDuty
                              ? "bg-green-50 text-green-700 border-green-200 ml-auto"
                              : "bg-slate-100 text-slate-700 border-slate-200 ml-auto"
                          }
                        >
                          {config.crewMember.onDuty ? "On Duty" : "Off Duty"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* General Settings Tab */}
              <TabsContent value="general" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Interface Language</h3>
                  <Select
                    value={config.settings.language}
                    onValueChange={(value) =>
                      setConfig({
                        ...config,
                        settings: {
                          ...config.settings,
                          language: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">
                        <div className="flex items-center">
                          <Globe className="mr-2 h-4 w-4" />
                          English
                        </div>
                      </SelectItem>
                      <SelectItem value="french">
                        <div className="flex items-center">
                          <Globe className="mr-2 h-4 w-4" />
                          French
                        </div>
                      </SelectItem>
                      <SelectItem value="german">
                        <div className="flex items-center">
                          <Globe className="mr-2 h-4 w-4" />
                          German
                        </div>
                      </SelectItem>
                      <SelectItem value="italian">
                        <div className="flex items-center">
                          <Globe className="mr-2 h-4 w-4" />
                          Italian
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Time Settings</h3>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="automatic-sync" className="flex-1">
                      Automatic Time Sync
                      <p className="text-sm font-normal text-muted-foreground">
                        Automatically sync time with the server
                      </p>
                    </Label>
                    <Switch id="automatic-sync" checked={true} disabled onCheckedChange={() => {}} />
                  </div>

                  <div className="space-y-2">
                    <Label>Time Format</Label>
                    <RadioGroup
                      value={config.settings.timeFormat}
                      onValueChange={(value) =>
                        setConfig({
                          ...config,
                          settings: {
                            ...config.settings,
                            timeFormat: value,
                          },
                        })
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="12h" id="time-12h" />
                        <Label htmlFor="time-12h">12-hour (AM/PM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="24h" id="time-24h" />
                        <Label htmlFor="time-24h">24-hour</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Display Settings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="screen-brightness">Screen Brightness</Label>
                      <span className="text-sm">{config.settings.brightness}%</span>
                    </div>
                    <Slider
                      id="screen-brightness"
                      value={[config.settings.brightness]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) =>
                        setConfig({
                          ...config,
                          settings: {
                            ...config.settings,
                            brightness: value[0],
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="screen-auto-lock" className="flex-1">
                      Screen Auto-Lock
                      <p className="text-sm font-normal text-muted-foreground">
                        Automatically lock screen after a period of inactivity
                      </p>
                    </Label>
                    <Switch
                      id="screen-auto-lock"
                      checked={config.settings.autoLock}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          settings: {
                            ...config.settings,
                            autoLock: checked,
                          },
                        })
                      }
                    />
                  </div>

                  {config.settings.autoLock && (
                    <div className="space-y-2 pl-6 border-l-2 border-muted">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="lock-delay">Lock Delay</Label>
                        <span className="text-sm">{config.settings.lockDelay} min</span>
                      </div>
                      <Slider
                        id="lock-delay"
                        value={[config.settings.lockDelay]}
                        min={1}
                        max={30}
                        step={1}
                        onValueChange={(value) =>
                          setConfig({
                            ...config,
                            settings: {
                              ...config.settings,
                              lockDelay: value[0],
                            },
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Battery Settings</h3>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="low-battery-alert" className="flex-1">
                      Low Battery Alert (5%)
                      <p className="text-sm font-normal text-muted-foreground">
                        Notify other crew members when battery is critically low
                      </p>
                    </Label>
                    <Switch
                      id="low-battery-alert"
                      checked={config.settings.lowBatteryAlert}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          settings: {
                            ...config.settings,
                            lowBatteryAlert: checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Firmware Information</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Current Version</p>
                      <p className="text-sm text-muted-foreground">{config.settings.firmwareVersion}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCheckForUpdates} disabled={isCheckingForUpdates}>
                      {isCheckingForUpdates ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-2"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </motion.div>
                          Checking...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Check for Updates
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Battery Alerts</h3>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="battery-alerts" className="flex-1">
                      Enable Battery Alerts
                      <p className="text-sm font-normal text-muted-foreground">
                        Receive notifications when battery is low
                      </p>
                    </Label>
                    <Switch
                      id="battery-alerts"
                      checked={config.settings.batteryAlerts}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          settings: {
                            ...config.settings,
                            batteryAlerts: checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Duty Alerts</h3>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="duty-alerts" className="flex-1">
                      Enable Duty Alerts
                      <p className="text-sm font-normal text-muted-foreground">
                        Receive notifications about upcoming duty shifts
                      </p>
                    </Label>
                    <Switch
                      id="duty-alerts"
                      checked={config.settings.dutyAlerts}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          settings: {
                            ...config.settings,
                            dutyAlerts: checked,
                          },
                        })
                      }
                    />
                  </div>

                  {config.settings.dutyAlerts && (
                    <div className="space-y-4 pl-6 border-l-2 border-muted">
                      <div className="space-y-2">
                        <Label htmlFor="duty-reminder-time">Reminder Time</Label>
                        <Select
                          id="duty-reminder-time"
                          value={config.settings.dutyReminderTime}
                          onValueChange={(value) =>
                            setConfig({
                              ...config,
                              settings: {
                                ...config.settings,
                                dutyReminderTime: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select reminder time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15min">15 minutes before</SelectItem>
                            <SelectItem value="30min">30 minutes before</SelectItem>
                            <SelectItem value="1h">1 hour before</SelectItem>
                            <SelectItem value="2h">2 hours before</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Example: If next shift is at 14:00, a 15-minute reminder will alert at 13:45
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Reminder Method</Label>
                        <RadioGroup
                          value={config.settings.dutyReminderMethod}
                          onValueChange={(value) =>
                            setConfig({
                              ...config,
                              settings: {
                                ...config.settings,
                                dutyReminderMethod: value,
                              },
                            })
                          }
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="visual" id="reminder-visual" />
                            <Label htmlFor="reminder-visual">Visual</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="vibration" id="reminder-vibration" />
                            <Label htmlFor="reminder-vibration">Vibration</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="reminder-both" />
                            <Label htmlFor="reminder-both">Both</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Location & Security Tab */}
              <TabsContent value="location" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">GPS Tracking</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              GPS data helps with automatic LoRa frequency selection based on location regulations
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="gps-tracking" className="flex-1">
                      Enable GPS Tracking
                      <p className="text-sm font-normal text-muted-foreground">
                        GPS data is used for LoRa frequency selection
                      </p>
                    </Label>
                    <Switch
                      id="gps-tracking"
                      checked={config.settings.gpsTracking}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          settings: {
                            ...config.settings,
                            gpsTracking: checked,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg text-blue-700 text-sm">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <p>
                        Enabling GPS helps with automatic LoRa frequency assignment based on location regulations.
                        Different regions require different frequencies (433 MHz, 868 MHz, or 915 MHz).
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Identify Watch</h3>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex-1">
                      <p className="text-sm">Locate this watch by triggering vibration and screen blinking</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLocateWatch} disabled={isLocatingWatch}>
                      {isLocatingWatch ? (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                            className="mr-2"
                          >
                            <Vibrate className="h-4 w-4 text-primary" />
                          </motion.div>
                          Locating...
                        </>
                      ) : (
                        <>
                          <Vibrate className="mr-2 h-4 w-4" />
                          Locate Watch
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Vibration Intensity</h3>
                  <RadioGroup
                    value={config.settings.vibrationIntensity}
                    onValueChange={(value) =>
                      setConfig({
                        ...config,
                        settings: {
                          ...config.settings,
                          vibrationIntensity: value,
                        },
                      })
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="vibration-low" />
                      <Label htmlFor="vibration-low">Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="vibration-medium" />
                      <Label htmlFor="vibration-medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="vibration-high" />
                      <Label htmlFor="vibration-high">High</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security</h3>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="passcode-protection" className="flex-1">
                      Passcode Protection
                      <p className="text-sm font-normal text-muted-foreground">Require passcode to unlock watch</p>
                    </Label>
                    <Switch id="passcode-protection" checked={false} disabled onCheckedChange={() => {}} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Passcode protection will be available in a future update
                  </p>
                </div>
              </TabsContent>

              {/* Themes & Personalization Tab */}
              <TabsContent value="themes" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Watch Interface Theme</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        config.settings.theme === "light" ? "ring-2 ring-primary border-primary" : "hover:bg-muted/50"
                      }`}
                      onClick={() =>
                        setConfig({
                          ...config,
                          settings: {
                            ...config.settings,
                            theme: "light",
                          },
                        })
                      }
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Sun className="h-5 w-5 mr-2 text-amber-500" />
                          <span className="font-medium">Light Theme</span>
                        </div>
                        {config.settings.theme === "light" && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="bg-white border rounded-lg p-3 flex flex-col items-center">
                        <div className="w-full h-2 bg-slate-200 rounded-full mb-2"></div>
                        <div className="w-3/4 h-2 bg-slate-200 rounded-full mb-4"></div>
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                          <Clock className="h-6 w-6" />
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        config.settings.theme === "dark" ? "ring-2 ring-primary border-primary" : "hover:bg-muted/50"
                      }`}
                      onClick={() =>
                        setConfig({
                          ...config,
                          settings: {
                            ...config.settings,
                            theme: "dark",
                          },
                        })
                      }
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Moon className="h-5 w-5 mr-2 text-indigo-400" />
                          <span className="font-medium">Dark Theme</span>
                        </div>
                        {config.settings.theme === "dark" && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex flex-col items-center">
                        <div className="w-full h-2 bg-slate-700 rounded-full mb-2"></div>
                        <div className="w-3/4 h-2 bg-slate-700 rounded-full mb-4"></div>
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                          <Clock className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Accent Color</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {["blue", "purple", "green", "teal"].map((color) => (
                      <div
                        key={color}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          config.settings.primaryColor === color
                            ? "ring-2 ring-primary border-primary"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() =>
                          setConfig({
                            ...config,
                            settings: {
                              ...config.settings,
                              primaryColor: color,
                            },
                          })
                        }
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full mb-2 ${
                              color === "blue"
                                ? "bg-blue-500"
                                : color === "purple"
                                  ? "bg-purple-500"
                                  : color === "green"
                                    ? "bg-green-500"
                                    : "bg-teal-500"
                            }`}
                          ></div>
                          <span className="text-sm capitalize">{color}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Watch Face</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {["classic", "digital", "minimal"].map((face) => (
                      <div key={face} className="border rounded-lg p-3 cursor-pointer transition-all hover:bg-muted/50">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full border flex items-center justify-center mb-2">
                            <Clock className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <span className="text-sm capitalize">{face}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Custom watch faces will be available in a future update
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
