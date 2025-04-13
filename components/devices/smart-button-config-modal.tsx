"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bluetooth, Mic, Lightbulb, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AnimatedDialog } from "@/components/ui-patterns/animated-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { tabVariants, tabTransition } from "@/lib/animation-utils"

interface SmartButtonConfigModalProps {
  button: any
  isOpen: boolean
  onClose: () => void
  onSave: (updatedButton: any) => void
}

export function SmartButtonConfigModal({ button, isOpen, onClose, onSave }: SmartButtonConfigModalProps) {
  const [activeTab, setActiveTab] = useState("actions")
  const [config, setConfig] = useState({
    // Actions
    actions: {
      singlePress: button.actions?.singlePress || "Call Stewardess",
      doublePress: button.actions?.doublePress || "Beverage Request",
      longPress: button.actions?.longPress || "Emergency",
      touch: button.actions?.touch || "Room Service",
      doubleTouch: button.actions?.doubleTouch || "Housekeeping",
    },

    // Audio
    microphoneEnabled: button.microphoneEnabled !== undefined ? button.microphoneEnabled : true,
    microphoneGain: button.microphoneGain || 70,
    microphonePattern: button.microphonePattern || "omnidirectional",
    speakerVolume: button.speakerVolume || 70,

    // LED
    ledEnabled: button.ledEnabled !== undefined ? button.ledEnabled : true,
    ledBrightness: button.ledBrightness || 70,
  })

  // Available actions for buttons
  const availableActions = [
    "Call Stewardess",
    "Call Butler",
    "Beverage Request",
    "Room Service",
    "Emergency",
    "Housekeeping",
    "Technical Support",
    "None",
  ]

  // Available microphone patterns
  const microphonePatterns = [
    { value: "omnidirectional", label: "Omnidirectional" },
    { value: "cardioid", label: "Cardioid" },
    { value: "bidirectional", label: "Bidirectional" },
    { value: "stereo", label: "Stereo" },
  ]

  const handleSave = () => {
    onSave({
      ...button,
      actions: config.actions,
      microphoneEnabled: config.microphoneEnabled,
      microphoneGain: config.microphoneGain,
      microphonePattern: config.microphonePattern,
      speakerVolume: config.speakerVolume,
      ledEnabled: config.ledEnabled,
      ledBrightness: config.ledBrightness,
    })
  }

  return (
    <AnimatedDialog
      open={isOpen}
      onOpenChange={onClose}
      title={
        <div className="flex items-center gap-2 text-xl">
          <Bluetooth className="h-5 w-5 text-primary" />
          Configure Smart Button
          <span className="text-sm font-normal text-muted-foreground ml-2">
            {button.id} • {button.room}
          </span>
        </div>
      }
    >
      <Tabs defaultValue="actions" className="mt-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="actions" className="flex items-center gap-2">
            <Bluetooth className="h-4 w-4" />
            Actions
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Audio
          </TabsTrigger>
          <TabsTrigger value="led" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            LED
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            transition={tabTransition}
          >
            {/* Actions Tab */}
            <TabsContent value="actions" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="single-press">Single Press</Label>
                  <Select
                    value={config.actions.singlePress}
                    onValueChange={(value) =>
                      setConfig({
                        ...config,
                        actions: { ...config.actions, singlePress: value },
                      })
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
                    value={config.actions.doublePress}
                    onValueChange={(value) =>
                      setConfig({
                        ...config,
                        actions: { ...config.actions, doublePress: value },
                      })
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
                  <Label htmlFor="long-press">Long Press</Label>
                  <Select
                    value={config.actions.longPress}
                    onValueChange={(value) =>
                      setConfig({
                        ...config,
                        actions: { ...config.actions, longPress: value },
                      })
                    }
                  >
                    <SelectTrigger id="long-press">
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
                    value={config.actions.touch}
                    onValueChange={(value) =>
                      setConfig({
                        ...config,
                        actions: { ...config.actions, touch: value },
                      })
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
                    value={config.actions.doubleTouch}
                    onValueChange={(value) =>
                      setConfig({
                        ...config,
                        actions: { ...config.actions, doubleTouch: value },
                      })
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
                  <div className="flex items-center gap-2">
                    <Label htmlFor="press-hold">Press & Hold</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Press & Hold is reserved for voice recording functionality</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-sm text-muted-foreground">Voice Recording (fixed)</div>
                </div>
              </div>
            </TabsContent>

            {/* Audio Tab */}
            <TabsContent value="audio" className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="microphone-enabled" className="flex-1">
                  Enable Microphone
                </Label>
                <Switch
                  id="microphone-enabled"
                  checked={config.microphoneEnabled}
                  onCheckedChange={(checked) => setConfig({ ...config, microphoneEnabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="microphone-gain">Microphone Gain</Label>
                  <span className="text-sm">{config.microphoneGain}%</span>
                </div>
                <Slider
                  id="microphone-gain"
                  value={[config.microphoneGain]}
                  min={0}
                  max={100}
                  step={1}
                  disabled={!config.microphoneEnabled}
                  onValueChange={(value) => setConfig({ ...config, microphoneGain: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="microphone-pattern">Directionality Pattern</Label>
                <Select
                  value={config.microphonePattern}
                  onValueChange={(value) => setConfig({ ...config, microphonePattern: value })}
                  disabled={!config.microphoneEnabled}
                >
                  <SelectTrigger id="microphone-pattern">
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    {microphonePatterns.map((pattern) => (
                      <SelectItem key={pattern.value} value={pattern.value}>
                        {pattern.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="speaker-volume">Speaker Volume</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Not used in initial implementation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm">{config.speakerVolume}%</span>
                </div>
                <Slider
                  id="speaker-volume"
                  value={[config.speakerVolume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setConfig({ ...config, speakerVolume: value[0] })}
                />
                <p className="text-xs text-muted-foreground">Optional: Not used in initial implementation</p>
              </div>
            </TabsContent>

            {/* LED Tab */}
            <TabsContent value="led" className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="led-enabled" className="flex-1">
                  Enable LED Ring
                </Label>
                <Switch
                  id="led-enabled"
                  checked={config.ledEnabled}
                  onCheckedChange={(checked) => setConfig({ ...config, ledEnabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="led-brightness">LED Brightness</Label>
                  <span className="text-sm">{config.ledBrightness}%</span>
                </div>
                <Slider
                  id="led-brightness"
                  value={[config.ledBrightness]}
                  min={0}
                  max={100}
                  step={1}
                  disabled={!config.ledEnabled}
                  onValueChange={(value) => setConfig({ ...config, ledBrightness: value[0] })}
                />
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Button onClick={handleSave}>Save Changes</Button>
        </motion.div>
      </div>
    </AnimatedDialog>
  )
}
