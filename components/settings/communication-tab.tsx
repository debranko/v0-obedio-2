"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Radio, Wifi, MapPin, RefreshCw, Info } from "lucide-react"

export default function CommunicationTab() {
  const [loraFrequency, setLoraFrequency] = useState("868")
  const [wifiFallback, setWifiFallback] = useState(true)
  const [gpsEnabled, setGpsEnabled] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    toast({
      title: "Settings saved",
      description: "Your communication settings have been updated successfully.",
    })

    setIsSaving(false)
  }

  return (
    <Card className="rounded-2xl shadow-md bg-white">
      <CardHeader>
        <CardTitle>Communication Settings</CardTitle>
        <CardDescription>Configure LoRa, Wi-Fi, and GPS settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-muted-foreground" />
            <Label>LoRa Frequency</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Changing frequency will trigger OTA sync on all devices</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup
            value={loraFrequency}
            onValueChange={setLoraFrequency}
            className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="433" id="433mhz" />
              <Label htmlFor="433mhz" className="cursor-pointer">
                433 MHz
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="868" id="868mhz" />
              <Label htmlFor="868mhz" className="cursor-pointer">
                868 MHz
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="915" id="915mhz" />
              <Label htmlFor="915mhz" className="cursor-pointer">
                915 MHz
              </Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-muted-foreground">
            Select the appropriate frequency based on your region's regulations
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="wifi-fallback">Wi-Fi Fallback for Voice</Label>
            </div>
            <Switch id="wifi-fallback" checked={wifiFallback} onCheckedChange={setWifiFallback} />
          </div>
          <p className="text-sm text-muted-foreground">
            Use Wi-Fi for voice messages when available to improve quality
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="gps-enabled">GPS Tracking</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">GPS from smartwatches helps optimize LoRa frequency and signal strength</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch id="gps-enabled" checked={gpsEnabled} onCheckedChange={setGpsEnabled} />
          </div>
          <p className="text-sm text-muted-foreground">
            Enable GPS tracking for location-based services and optimizations
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving} className="ml-auto">
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="mr-2"
              >
                <RefreshCw className="h-4 w-4" />
              </motion.div>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
