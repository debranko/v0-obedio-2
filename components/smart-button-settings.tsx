"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { QrCode } from "lucide-react"

interface SmartButtonSettingsProps {
  device: any
  onClose: () => void
  onSave: (updatedDevice: any) => void
}

export function SmartButtonSettings({ device, onClose, onSave }: SmartButtonSettingsProps) {
  const [settings, setSettings] = useState({
    // Interaction settings
    actions: {
      singlePress: device.actions?.singlePress || "Call Stewardess",
      doublePress: device.actions?.doublePress || "Beverage Request",
      touch: device.actions?.touch || "Room Service",
      doubleTouch: device.actions?.doubleTouch || "Housekeeping",
      hold: "Start recording",
    },
    shakeToCall: device.shakeToCall || false,

    // Audio settings
    microphoneEnabled: device.microphoneEnabled || true,
    microphoneGain: device.microphoneGain || "medium",
    microphonePattern: device.microphonePattern || "omnidirectional",
    speakerVolume: device.speakerVolume || 70,

    // LED settings
    ledEnabled: device.ledEnabled !== undefined ? device.ledEnabled : true,
    ledBrightness: device.ledBrightness || 70,

    // Advanced settings
    lowBatteryNotification: device.lowBatteryNotification !== undefined ? device.lowBatteryNotification : true,
  })

  // Available actions for buttons
  const availableActions = [
    "Call Stewardess",
    "Call Butler",
    "Beverage Request",
    "Room Service",
    "Housekeeping",
    "Technical Support",
    "Emergency",
    "None",
  ]

  const handleSave = () => {
    onSave({
      ...device,
      ...settings,
      actions: settings.actions,
      shakeToCall: settings.shakeToCall,
      microphoneEnabled: settings.microphoneEnabled,
      microphoneGain: settings.microphoneGain,
      microphonePattern: settings.microphonePattern,
      speakerVolume: settings.speakerVolume,
      ledEnabled: settings.ledEnabled,
      ledBrightness: settings.ledBrightness,
      lowBatteryNotification: settings.lowBatteryNotification,
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Configure Smart Button</CardTitle>
            <CardDescription>
              {device.id} • {device.room}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={device.status === "online" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-700"}
          >
            {device.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="interaction" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="interaction">Interaction</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="led">LED</TabsTrigger>
            <TabsTrigger value="provisioning">Provisioning</TabsTrigger>
          </TabsList>

          {/* Interaction Tab */}
          <TabsContent value="interaction" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Action Mappings</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="single-press">Single Press</Label>
                  <Select
                    value={settings.actions.singlePress}
                    onValueChange={(value) =>
                      setSettings({ ...settings, actions: { ...settings.actions, singlePress: value } })
                    }
                  >
                    <SelectTrigger id="single-press">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableActions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="double-press">Double Press</Label>
                  <Select
                    value={settings.actions.doublePress}
                    onValueChange={(value) =>
                      setSettings({ ...settings, actions: { ...settings.actions, doublePress: value } })
                    }
                  >
                    <SelectTrigger id="double-press">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableActions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="touch">Touch</Label>
                  <Select
                    value={settings.actions.touch}
                    onValueChange={(value) =>
                      setSettings({ ...settings, actions: { ...settings.actions, touch: value } })
                    }
                  >
                    <SelectTrigger id="touch">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableActions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="double-touch">Double Touch</Label>
                  <Select
                    value={settings.actions.doubleTouch}
                    onValueChange={(value) =>
                      setSettings({ ...settings, actions: { ...settings.actions, doubleTouch: value } })
                    }
                  >
                    <SelectTrigger id="double-touch">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableActions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="hold">Press and Hold</Label>
                  <div className="text-sm text-muted-foreground">Start recording / Cancel / Play feedback</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Advanced Interaction</h3>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="shake-to-call" className="flex-1">
                  Enable Shake-to-Call
                  <p className="text-sm font-normal text-muted-foreground">
                    Activates call function when button is shaken (requires accelerometer)
                  </p>
                </Label>
                <Switch
                  id="shake-to-call"
                  checked={settings.shakeToCall}
                  onCheckedChange={(checked) => setSettings({ ...settings, shakeToCall: checked })}
                />
              </div>
            </div>
          </TabsContent>

          {/* Audio Tab */}
          <TabsContent value="audio" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="microphone-enabled" className="flex-1">
                  Enable Microphone
                  <p className="text-sm font-normal text-muted-foreground">
                    Allow voice recording when button is pressed and held
                  </p>
                </Label>
                <Switch
                  id="microphone-enabled"
                  checked={settings.microphoneEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, microphoneEnabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Microphone Gain</Label>
                <RadioGroup
                  value={settings.microphoneGain}
                  onValueChange={(value) => setSettings({ ...settings, microphoneGain: value })}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="mic-low" />
                    <Label htmlFor="mic-low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="mic-medium" />
                    <Label htmlFor="mic-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="mic-high" />
                    <Label htmlFor="mic-high">High</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mic-pattern">Microphone Directionality Pattern</Label>
                <Select
                  value={settings.microphonePattern}
                  onValueChange={(value) => setSettings({ ...settings, microphonePattern: value })}
                >
                  <SelectTrigger id="mic-pattern">
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="omnidirectional">Omnidirectional</SelectItem>
                    <SelectItem value="cardioid">Cardioid</SelectItem>
                    <SelectItem value="bidirectional">Bidirectional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="speaker-volume">Speaker Volume</Label>
                  <span className="text-sm">{settings.speakerVolume}%</span>
                </div>
                <Slider
                  id="speaker-volume"
                  value={[settings.speakerVolume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setSettings({ ...settings, speakerVolume: value[0] })}
                />
                <p className="text-xs text-muted-foreground">
                  Controls feedback and notification volume (not used in initial implementation)
                </p>
              </div>
            </div>
          </TabsContent>

          {/* LED Tab */}
          <TabsContent value="led" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="led-enabled" className="flex-1">
                  Enable LED Ring
                  <p className="text-sm font-normal text-muted-foreground">Illuminates LED ring for visual feedback</p>
                </Label>
                <Switch
                  id="led-enabled"
                  checked={settings.ledEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, ledEnabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="led-brightness">LED Brightness</Label>
                  <span className="text-sm">{settings.ledBrightness}%</span>
                </div>
                <Slider
                  id="led-brightness"
                  value={[settings.ledBrightness]}
                  min={0}
                  max={100}
                  step={1}
                  disabled={!settings.ledEnabled}
                  onValueChange={(value) => setSettings({ ...settings, ledBrightness: value[0] })}
                />
              </div>
            </div>
          </TabsContent>

          {/* Provisioning Tab */}
          <TabsContent value="provisioning" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Device Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Device ID:</span>
                    <span className="text-sm">{device.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Location:</span>
                    <span className="text-sm">{device.room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Firmware Version:</span>
                    <span className="text-sm">v2.3.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Battery Level:</span>
                    <span className="text-sm">{device.battery}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Signal Strength:</span>
                    <span className="text-sm">{device.signal}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Last Seen:</span>
                    <span className="text-sm">{device.lastSeen}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="low-battery" className="flex-1">
                      Low Battery Notifications
                      <p className="text-sm font-normal text-muted-foreground">
                        Receive alerts when battery level is low
                      </p>
                    </Label>
                    <Switch
                      id="low-battery"
                      checked={settings.lowBatteryNotification}
                      onCheckedChange={(checked) => setSettings({ ...settings, lowBatteryNotification: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-muted p-6 rounded-lg">
                  <QrCode className="h-32 w-32 text-primary" />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Scan this QR code to provision or re-provision this device
                </p>
                <Button variant="outline" size="sm">
                  Download QR Code
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
