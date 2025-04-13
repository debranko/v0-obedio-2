"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Lightbulb, Mic, Clock, Smartphone, RefreshCw } from "lucide-react"

export default function DevicesTab() {
  const [ledBrightness, setLedBrightness] = useState(70)
  const [micEnabled, setMicEnabled] = useState(true)
  const [micGain, setMicGain] = useState("medium")
  const [autoSleepTime, setAutoSleepTime] = useState("60")
  const [shakeToCall, setShakeToCall] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    toast({
      title: "Settings saved",
      description: "Your device settings have been updated successfully.",
    })

    setIsSaving(false)
  }

  return (
    <Card className="rounded-2xl shadow-md bg-white">
      <CardHeader>
        <CardTitle>Device Settings</CardTitle>
        <CardDescription>Configure global settings for buttons, watches, and repeaters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
            <Label>LED Brightness Defaults</Label>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="led-brightness">Smart Buttons</Label>
                <span className="text-sm font-medium">{ledBrightness}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
                <Slider
                  id="led-brightness"
                  value={[ledBrightness]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setLedBrightness(value[0])}
                />
                <Lightbulb className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-sm text-muted-foreground">Adjust default LED brightness for all smart buttons</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-muted-foreground" />
            <Label>Microphone Default Settings</Label>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="mic-enabled">Microphone Enabled</Label>
              <Switch id="mic-enabled" checked={micEnabled} onCheckedChange={setMicEnabled} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mic-gain">Microphone Gain</Label>
              <Select value={micGain} onValueChange={setMicGain} disabled={!micEnabled}>
                <SelectTrigger id="mic-gain">
                  <SelectValue placeholder="Select gain level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Higher gain increases sensitivity but may introduce noise</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label>Auto-Sleep for Buttons</Label>
          </div>
          <div className="space-y-2">
            <Select value={autoSleepTime} onValueChange={setAutoSleepTime}>
              <SelectTrigger id="auto-sleep">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">After 30 seconds</SelectItem>
                <SelectItem value="60">After 1 minute</SelectItem>
                <SelectItem value="120">After 2 minutes</SelectItem>
                <SelectItem value="300">After 5 minutes</SelectItem>
                <SelectItem value="0">Never (always on)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Time of inactivity after which buttons enter sleep mode</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="shake-to-call">Shake-to-Call Default</Label>
            </div>
            <Switch id="shake-to-call" checked={shakeToCall} onCheckedChange={setShakeToCall} />
          </div>
          <p className="text-sm text-muted-foreground">
            Enable shake gesture on smartwatches to initiate service calls
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
