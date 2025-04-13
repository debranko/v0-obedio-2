"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Sun, Moon, Upload, ImageIcon, Sparkles, RefreshCw } from "lucide-react"

export default function ThemesDisplayTab() {
  const [theme, setTheme] = useState("light")
  const [primaryColor, setPrimaryColor] = useState("blue")
  const [showLogo, setShowLogo] = useState(true)
  const [enableAnimations, setEnableAnimations] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    toast({
      title: "Settings saved",
      description: "Your theme and display settings have been updated successfully.",
    })

    setIsSaving(false)
  }

  return (
    <Card className="rounded-2xl shadow-md bg-white">
      <CardHeader>
        <CardTitle>Themes & Display</CardTitle>
        <CardDescription>Customize the appearance of the application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Theme</Label>
          <div className="flex space-x-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTheme("light")}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTheme("dark")}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTheme("system")}
            >
              <span className="mr-2">🖥️</span>
              System
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Primary Color</Label>
          <RadioGroup
            value={primaryColor}
            onValueChange={setPrimaryColor}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
          >
            <div
              className={`border rounded-md p-4 flex items-center space-x-2 ${primaryColor === "blue" ? "border-blue-500 bg-blue-50" : ""}`}
            >
              <RadioGroupItem value="blue" id="blue" />
              <Label htmlFor="blue" className="cursor-pointer flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
                Blue
              </Label>
            </div>
            <div
              className={`border rounded-md p-4 flex items-center space-x-2 ${primaryColor === "gold" ? "border-amber-500 bg-amber-50" : ""}`}
            >
              <RadioGroupItem value="gold" id="gold" />
              <Label htmlFor="gold" className="cursor-pointer flex items-center">
                <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
                Gold
              </Label>
            </div>
            <div
              className={`border rounded-md p-4 flex items-center space-x-2 ${primaryColor === "purple" ? "border-purple-500 bg-purple-50" : ""}`}
            >
              <RadioGroupItem value="purple" id="purple" />
              <Label htmlFor="purple" className="cursor-pointer flex items-center">
                <div className="w-4 h-4 rounded-full bg-purple-600 mr-2"></div>
                Purple
              </Label>
            </div>
            <div
              className={`border rounded-md p-4 flex items-center space-x-2 ${primaryColor === "teal" ? "border-teal-500 bg-teal-50" : ""}`}
            >
              <RadioGroupItem value="teal" id="teal" />
              <Label htmlFor="teal" className="cursor-pointer flex items-center">
                <div className="w-4 h-4 rounded-full bg-teal-600 mr-2"></div>
                Teal
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label>Logo</Label>
          <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
            <div className="flex flex-col items-center">
              <div className="mb-4 h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                <ImageIcon className="h-10 w-10 text-gray-400" />
              </div>
              <Button variant="outline" className="mb-2">
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground">Recommended size: 512x512px. PNG or SVG format.</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="show-logo">Show Logo on Interface</Label>
            </div>
            <Switch id="show-logo" checked={showLogo} onCheckedChange={setShowLogo} />
          </div>
          <p className="text-sm text-muted-foreground">Display the logo in the header and sidebar</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="enable-animations">Enable Animations</Label>
            </div>
            <Switch id="enable-animations" checked={enableAnimations} onCheckedChange={setEnableAnimations} />
          </div>
          <p className="text-sm text-muted-foreground">
            Enable smooth transitions and animations throughout the interface
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
