"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Battery, BatteryLow, Cog, Eye, Mic, Radio, Sun, Waves } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"

// Mock data for room assignments
const rooms = [
  { id: "room-1", name: "Master Cabin" },
  { id: "room-2", name: "VIP Suite 1" },
  { id: "room-3", name: "Guest Cabin 1" },
  { id: "room-4", name: "Guest Cabin 2" },
  { id: "room-5", name: "Salon" },
  { id: "room-6", name: "Dining Room" },
  { id: "room-7", name: "Upper Deck" },
  { id: "room-8", name: "Lower Deck" },
]

// Mock data for button actions
const buttonActions = [
  { id: "action-1", name: "Call Stewardess" },
  { id: "action-2", name: "Beverage Request" },
  { id: "action-3", name: "Room Service" },
  { id: "action-4", name: "Housekeeping" },
  { id: "action-5", name: "Technical Support" },
  { id: "action-6", name: "Emergency" },
  { id: "action-7", name: "Do Not Disturb" },
  { id: "action-8", name: "Custom Message" },
]

export type DeviceType = "smart-button" | "smart-watch" | "repeater"

interface ExpandableRowContentProps {
  device: any
  deviceType: DeviceType
  userRole: "admin" | "chief-stewardess" | "stewardess"
  onConfigureDevice: (device: any) => void
  onUpdateDevice: (updatedDevice: any) => void
}

export function ExpandableRowContent({
  device,
  deviceType,
  userRole,
  onConfigureDevice,
  onUpdateDevice,
}: ExpandableRowContentProps) {
  const [ledBrightness, setLedBrightness] = useState(device.ledBrightness || 70)
  const [microphoneEnabled, setMicrophoneEnabled] = useState(device.microphoneEnabled || false)
  const [shakeToCallEnabled, setShakeToCallEnabled] = useState(device.shakeToCallEnabled || false)
  const [assignedRoom, setAssignedRoom] = useState(device.room || "")
  const [singlePressAction, setSinglePressAction] = useState(device.actions?.singlePress || buttonActions[0].name)
  const [doublePressAction, setDoublePressAction] = useState(device.actions?.doublePress || buttonActions[1].name)

  const handleSaveChanges = () => {
    const updatedDevice = {
      ...device,
      ledBrightness,
      microphoneEnabled,
      shakeToCallEnabled,
      room: assignedRoom,
      actions: {
        ...device.actions,
        singlePress: singlePressAction,
        doublePress: doublePressAction,
      },
    }
    onUpdateDevice(updatedDevice)
  }

  const getBatteryIcon = () => {
    if (device.charging) {
      return <Battery className="h-4 w-4 text-green-600" />
    } else if (device.battery < 20) {
      return <BatteryLow className="h-4 w-4 text-destructive" />
    } else {
      return <Battery className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getBatteryColor = () => {
    if (device.battery < 20) return "text-destructive"
    if (device.battery < 50) return "text-amber-500"
    return "text-green-600"
  }

  const getSignalStrength = () => {
    if (device.signal === 0) return "No Signal"
    if (device.signal < 50) return "Weak"
    if (device.signal < 80) return "Good"
    return "Excellent"
  }

  const getSignalColor = () => {
    if (device.signal === 0) return "text-destructive"
    if (device.signal < 50) return "text-amber-500"
    return "text-green-600"
  }

  // Admin view with full controls
  const renderAdminView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quick Settings Panel */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Cog className="h-4 w-4" /> Quick Settings
          </h4>

          {deviceType === "smart-button" && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="led-brightness" className="text-xs flex items-center gap-1">
                    <Sun className="h-3 w-3" /> LED Brightness
                  </Label>
                  <span className="text-xs font-medium">{ledBrightness}%</span>
                </div>
                <Slider
                  id="led-brightness"
                  min={0}
                  max={100}
                  step={1}
                  value={[ledBrightness]}
                  onValueChange={(value) => setLedBrightness(value[0])}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="microphone-toggle" className="text-xs flex items-center gap-1">
                  <Mic className="h-3 w-3" /> Enable Microphone
                </Label>
                <Switch id="microphone-toggle" checked={microphoneEnabled} onCheckedChange={setMicrophoneEnabled} />
              </div>
            </>
          )}

          {deviceType === "smart-watch" && (
            <div className="flex items-center justify-between">
              <Label htmlFor="shake-to-call" className="text-xs flex items-center gap-1">
                <Waves className="h-3 w-3" /> Shake-to-Call
              </Label>
              <Switch id="shake-to-call" checked={shakeToCallEnabled} onCheckedChange={setShakeToCallEnabled} />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label className="text-xs flex items-center gap-1">
              <Eye className="h-3 w-3" /> Assigned Room
            </Label>
            <Select value={assignedRoom} onValueChange={setAssignedRoom}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.name}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Eye className="h-4 w-4" /> Status Information
          </h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs flex items-center gap-1">{getBatteryIcon()} Battery</span>
              <span className={`text-xs font-medium ${getBatteryColor()}`}>
                {device.battery}%{device.charging && " (Charging)"}
              </span>
            </div>
            <Progress value={device.battery} className={device.battery < 20 ? "h-1.5 bg-destructive/20" : "h-1.5"} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs flex items-center gap-1">
                <Waves className="h-3 w-3" /> Signal Strength
              </span>
              <span className={`text-xs font-medium ${getSignalColor()}`}>
                {getSignalStrength()} ({device.signal}%)
              </span>
            </div>
            <Progress value={device.signal} className="h-1.5" />
          </div>

          {deviceType === "repeater" && (
            <div className="flex items-center justify-between">
              <span className="text-xs flex items-center gap-1">
                <Radio className="h-3 w-3" /> Frequency
              </span>
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                {device.frequency} MHz
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs">Last Seen</span>
            <span className="text-xs">{device.lastSeen}</span>
          </div>
        </div>

        {/* Button Actions (for smart buttons only) */}
        {deviceType === "smart-button" && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Cog className="h-4 w-4" /> Button Actions
            </h4>

            <div className="space-y-2">
              <Label htmlFor="single-press" className="text-xs">
                Single Press
              </Label>
              <Select value={singlePressAction} onValueChange={setSinglePressAction}>
                <SelectTrigger id="single-press" className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {buttonActions.map((action) => (
                    <SelectItem key={action.id} value={action.name}>
                      {action.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="double-press" className="text-xs">
                Double Press
              </Label>
              <Select value={doublePressAction} onValueChange={setDoublePressAction}>
                <SelectTrigger id="double-press" className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {buttonActions.map((action) => (
                    <SelectItem key={action.id} value={action.name}>
                      {action.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <Button size="sm" variant="outline" onClick={handleSaveChanges}>
          Save Changes
        </Button>
        <Button size="sm" variant="default" onClick={() => onConfigureDevice(device)}>
          <Cog className="mr-2 h-4 w-4" />
          Open Full Config
        </Button>
      </div>
    </div>
  )

  // Chief Stewardess view with limited controls
  const renderChiefStewardessView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Eye className="h-4 w-4" /> Device Status
          </h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs flex items-center gap-1">{getBatteryIcon()} Battery</span>
              <span className={`text-xs font-medium ${getBatteryColor()}`}>
                {device.battery}%{device.charging && " (Charging)"}
              </span>
            </div>
            <Progress value={device.battery} className={device.battery < 20 ? "h-1.5 bg-destructive/20" : "h-1.5"} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs flex items-center gap-1">
                <Waves className="h-3 w-3" /> Signal Strength
              </span>
              <span className={`text-xs font-medium ${getSignalColor()}`}>
                {getSignalStrength()} ({device.signal}%)
              </span>
            </div>
            <Progress value={device.signal} className="h-1.5" />
          </div>
        </div>

        {/* Limited Controls */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Cog className="h-4 w-4" /> Controls
          </h4>

          <div className="flex items-center justify-between">
            <Label className="text-xs flex items-center gap-1">
              <Eye className="h-3 w-3" /> Assigned Room
            </Label>
            <Select value={assignedRoom} onValueChange={setAssignedRoom}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.name}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {deviceType === "smart-watch" && (
            <div className="flex items-center justify-between">
              <Label htmlFor="chief-shake-to-call" className="text-xs flex items-center gap-1">
                <Waves className="h-3 w-3" /> Shake-to-Call
              </Label>
              <Switch id="chief-shake-to-call" checked={shakeToCallEnabled} onCheckedChange={setShakeToCallEnabled} />
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <Button size="sm" variant="outline" onClick={handleSaveChanges}>
          Save Changes
        </Button>
        <Button size="sm" variant="default" onClick={() => onConfigureDevice(device)}>
          Reassign {deviceType === "smart-button" ? "Button" : deviceType === "smart-watch" ? "Watch" : "Repeater"}
        </Button>
      </div>
    </div>
  )

  // Stewardess view with read-only information
  const renderStewardessView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Read-only Status Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Eye className="h-4 w-4" /> Device Information
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Assigned Room</span>
              <p className="text-sm font-medium">{device.room || "Not Assigned"}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Last Seen</span>
              <p className="text-sm font-medium">{device.lastSeen}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">{getBatteryIcon()} Battery</span>
              <p className={`text-sm font-medium ${getBatteryColor()}`}>
                {device.battery}%{device.charging && " (Charging)"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Waves className="h-3 w-3" /> Signal
              </span>
              <p className={`text-sm font-medium ${getSignalColor()}`}>{getSignalStrength()}</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end items-center">
        <Button size="sm" variant="outline" onClick={() => onConfigureDevice(device)}>
          <AlertCircle className="mr-2 h-4 w-4" />
          Report Issue
        </Button>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mt-2 mb-2 bg-muted/10 border-dashed">
        <div className="p-4">
          <TooltipProvider>
            {userRole === "admin" && renderAdminView()}
            {userRole === "chief-stewardess" && renderChiefStewardessView()}
            {userRole === "stewardess" && renderStewardessView()}
          </TooltipProvider>
        </div>
      </Card>
    </motion.div>
  )
}
