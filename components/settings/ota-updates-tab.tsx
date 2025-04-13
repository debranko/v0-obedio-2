"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Download, Upload, AlertTriangle } from "lucide-react"

// Mock data for devices needing updates
const devicesNeedingUpdates = [
  {
    id: "device-1",
    name: "Smart Button BTN-005",
    type: "Smart Button",
    currentVersion: "1.2.3",
    availableVersion: "1.3.0",
    selected: false,
  },
  {
    id: "device-2",
    name: "Smart Button BTN-012",
    type: "Smart Button",
    currentVersion: "1.2.3",
    availableVersion: "1.3.0",
    selected: false,
  },
  {
    id: "device-3",
    name: "Smartwatch SW-002",
    type: "Smartwatch",
    currentVersion: "2.0.1",
    availableVersion: "2.1.0",
    selected: false,
  },
  {
    id: "device-4",
    name: "Repeater REP-001",
    type: "Repeater",
    currentVersion: "1.5.0",
    availableVersion: "1.6.2",
    selected: false,
  },
]

export default function OtaUpdatesTab() {
  const [devices, setDevices] = useState(devicesNeedingUpdates)
  const [isChecking, setIsChecking] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateProgress, setUpdateProgress] = useState(0)
  const [lastChecked, setLastChecked] = useState("2023-11-15T10:30:00Z")
  const [currentVersion, setCurrentVersion] = useState("2.5.1")
  const [isSaving, setIsSaving] = useState(false)

  const toggleDeviceSelection = (deviceId: string) => {
    setDevices(devices.map((device) => (device.id === deviceId ? { ...device, selected: !device.selected } : device)))
  }

  const toggleAllDevices = (checked: boolean) => {
    setDevices(devices.map((device) => ({ ...device, selected: checked })))
  }

  const checkForUpdates = async () => {
    setIsChecking(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Update check complete",
      description: "All devices are up to date.",
    })

    setLastChecked(new Date().toISOString())
    setIsChecking(false)
  }

  const forceUpdate = async () => {
    const selectedDevices = devices.filter((device) => device.selected)

    if (selectedDevices.length === 0) {
      toast({
        title: "No devices selected",
        description: "Please select at least one device to update.",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    setUpdateProgress(0)

    // Simulate update progress
    const interval = setInterval(() => {
      setUpdateProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 500)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 5000))

    clearInterval(interval)
    setUpdateProgress(100)

    toast({
      title: "Update complete",
      description: `Successfully updated ${selectedDevices.length} device(s).`,
    })

    // Reset selection
    setDevices(devices.map((device) => ({ ...device, selected: false })))

    setIsUpdating(false)
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    toast({
      title: "Settings saved",
      description: "Your OTA and update settings have been saved successfully.",
    })

    setIsSaving(false)
  }

  return (
    <Card className="rounded-2xl shadow-md bg-white">
      <CardHeader>
        <CardTitle>OTA & Updates</CardTitle>
        <CardDescription>Manage firmware and application updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted/20 rounded-lg border">
          <div>
            <h3 className="font-medium">Current System Version</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-sm font-mono">
                v{currentVersion}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Last checked: {new Date(lastChecked).toLocaleString()}
              </span>
            </div>
          </div>
          <Button onClick={checkForUpdates} disabled={isChecking} className="min-w-[150px]">
            {isChecking ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="mr-2"
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Check for Updates
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Devices Needing Updates</h3>
            <div className="flex items-center gap-2">
              <Checkbox id="select-all" onCheckedChange={(checked) => toggleAllDevices(!!checked)} />
              <Label htmlFor="select-all">Select All</Label>
            </div>
          </div>

          {devices.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Current Version</TableHead>
                    <TableHead>Available Version</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <Checkbox checked={device.selected} onCheckedChange={() => toggleDeviceSelection(device.id)} />
                      </TableCell>
                      <TableCell className="font-medium">{device.name}</TableCell>
                      <TableCell>{device.type}</TableCell>
                      <TableCell className="font-mono text-sm">{device.currentVersion}</TableCell>
                      <TableCell className="font-mono text-sm text-green-600">{device.availableVersion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 border rounded-lg">
              <p className="text-muted-foreground">All devices are up to date</p>
            </div>
          )}

          {isUpdating && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Update Progress</Label>
                <span className="text-sm font-medium">{updateProgress}%</span>
              </div>
              <Progress value={updateProgress} className="h-2" />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Download complete",
                  description: "Firmware package has been downloaded successfully.",
                })
              }}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Firmware
            </Button>
            <Button
              onClick={forceUpdate}
              disabled={isUpdating || devices.filter((d) => d.selected).length === 0}
              className="flex items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mr-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.div>
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Force OTA Update
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Manual Update</h3>
          <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
            <div className="flex flex-col items-center">
              <AlertTriangle className="mb-4 h-10 w-10 text-amber-500" />
              <Button variant="outline" className="mb-2">
                <Upload className="mr-2 h-4 w-4" />
                Upload Firmware (.zip)
              </Button>
              <p className="text-xs text-muted-foreground text-center max-w-md">
                Warning: Manual firmware updates should only be performed by qualified personnel. Incorrect firmware can
                cause device malfunction.
              </p>
            </div>
          </div>
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
