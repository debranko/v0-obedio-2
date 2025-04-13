"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Battery,
  Signal,
  Check,
  Wifi,
  Watch,
  Plug,
  Clock,
  Server,
  Thermometer,
  Cpu,
  HardDrive,
  Zap,
  Radio,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

// Mock data - in a real app, this would come from an API
const initialData = {
  smartButtons: {
    active: 28,
    lowBattery: 3,
    withSignal: 24,
    provisioned: 30,
  },
  smartwatches: {
    active: 6,
    total: 8,
    charging: 2,
    lastSeen: "2 minutes ago",
  },
  server: {
    health: "OK",
    cpuLoad: 24,
    temperature: 42,
    ramUsage: 3.2,
    ramTotal: 8,
  },
  repeaters: {
    online: 4,
    total: 4,
    powerSources: {
      AC: 1,
      UPS: 2,
      POE: 1,
    },
    frequencies: {
      "868": 2,
      "433": 1,
      "915": 1,
    },
    connectionTypes: {
      "Wi-Fi": 2,
      Ethernet: 2,
    },
  },
}

export function SystemStatusPanel() {
  const [data, setData] = useState(initialData)
  const router = useRouter()

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would be a fetch call to an API
      // For demo purposes, we'll just slightly modify the existing data
      setData((prevData) => ({
        ...prevData,
        smartButtons: {
          ...prevData.smartButtons,
          withSignal: Math.max(20, Math.min(30, prevData.smartButtons.withSignal + Math.floor(Math.random() * 3) - 1)),
        },
        server: {
          ...prevData.server,
          cpuLoad: Math.max(10, Math.min(90, prevData.server.cpuLoad + Math.floor(Math.random() * 5) - 2)),
          temperature: Math.max(35, Math.min(60, prevData.server.temperature + Math.floor(Math.random() * 3) - 1)),
        },
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Navigation handlers for Smart Buttons
  const handleLowBatteryClick = () => {
    router.push("/devices?tab=smart-buttons&filter=low-battery")
  }

  const handleWithSignalClick = () => {
    router.push("/devices?tab=smart-buttons&filter=online")
  }

  const handleProvisionedClick = () => {
    router.push("/devices?tab=smart-buttons&sort=provisioned")
  }

  // Navigation handlers for Smartwatches
  const handleActiveWatchesClick = () => {
    router.push("/devices?tab=smart-watches&filter=active")
  }

  const handleChargingWatchesClick = () => {
    router.push("/devices?tab=smart-watches&filter=charging")
  }

  const handleLastSeenClick = () => {
    router.push("/devices?tab=smart-watches&sort=last-seen")
  }

  // Animation variants for value changes
  const valueAnimation = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.1, 1], transition: { duration: 0.3 } },
  }

  // Interactive item style
  const interactiveItemStyle = "cursor-pointer transition-all hover:bg-primary/5 hover:shadow-sm rounded px-1"

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">System Status</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4">
        {/* Smart Buttons Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center">
            <Wifi className="h-4 w-4 mr-1.5" />
            Smart Buttons
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <StatusItem
              icon={<Check className="h-4 w-4 text-green-500" />}
              label="Active"
              value={data.smartButtons.active}
              tooltip="Number of active buttons"
              animateKey={`active-${data.smartButtons.active}`}
            />
            <StatusItem
              icon={<Battery className="h-4 w-4 text-amber-500" />}
              label="Low Battery"
              value={data.smartButtons.lowBattery}
              tooltip="Buttons with battery below 20%. Click to view these devices."
              animateKey={`battery-${data.smartButtons.lowBattery}`}
              alert={data.smartButtons.lowBattery > 0}
              onClick={handleLowBatteryClick}
              interactive
            />
            <StatusItem
              icon={<Signal className="h-4 w-4 text-blue-500" />}
              label="With Signal"
              value={data.smartButtons.withSignal}
              tooltip="Buttons with good signal strength. Click to view online devices."
              animateKey={`signal-${data.smartButtons.withSignal}`}
              onClick={handleWithSignalClick}
              interactive
            />
            <StatusItem
              icon={<Wifi className="h-4 w-4 text-blue-500" />}
              label="Provisioned"
              value={data.smartButtons.provisioned}
              tooltip="Total provisioned buttons. Click to view all, sorted by provisioning date."
              animateKey={`provisioned-${data.smartButtons.provisioned}`}
              onClick={handleProvisionedClick}
              interactive
            />
          </div>
        </div>

        <Separator className="my-1" />

        {/* Smartwatches Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center">
            <Watch className="h-4 w-4 mr-1.5" />
            Smartwatches
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <StatusItem
              icon={<Check className="h-4 w-4 text-green-500" />}
              label="Active"
              value={`${data.smartwatches.active} / ${data.smartwatches.total}`}
              tooltip="Number of active smartwatches. Click to view active devices."
              animateKey={`watch-active-${data.smartwatches.active}`}
              onClick={handleActiveWatchesClick}
              interactive
            />
            <StatusItem
              icon={<Plug className="h-4 w-4 text-amber-500" />}
              label="Charging"
              value={`${data.smartwatches.charging} / ${data.smartwatches.total}`}
              tooltip="Smartwatches currently charging. Click to view charging devices."
              animateKey={`watch-charging-${data.smartwatches.charging}`}
              onClick={handleChargingWatchesClick}
              interactive
            />
            <div className="col-span-2">
              <StatusItem
                icon={<Clock className="h-4 w-4 text-slate-500" />}
                label="Last Seen"
                value={data.smartwatches.lastSeen}
                tooltip="Time since last communication. Click to sort by last seen timestamp."
                animateKey={`watch-lastseen-${data.smartwatches.lastSeen}`}
                onClick={handleLastSeenClick}
                interactive
              />
            </div>
          </div>
        </div>

        <Separator className="my-1" />

        {/* Server Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center">
            <Server className="h-4 w-4 mr-1.5" />
            Server
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <Server className="h-4 w-4 mr-1.5 text-green-500" />
                      <span className="text-sm">Health</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Server health status</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {data.server.health}
              </Badge>
            </div>

            <ServerMetric
              icon={<Cpu className="h-4 w-4 text-blue-500" />}
              label="CPU Load"
              value={data.server.cpuLoad}
              unit="%"
              tooltip="Current CPU utilization"
              animateKey={`cpu-${data.server.cpuLoad}`}
            />

            <ServerMetric
              icon={<Thermometer className="h-4 w-4 text-amber-500" />}
              label="Temperature"
              value={data.server.temperature}
              unit="°C"
              tooltip="Current server temperature"
              animateKey={`temp-${data.server.temperature}`}
              alert={data.server.temperature > 50}
            />

            <ServerMetric
              icon={<HardDrive className="h-4 w-4 text-purple-500" />}
              label="RAM Usage"
              value={data.server.ramUsage}
              maxValue={data.server.ramTotal}
              unit="GB"
              tooltip="Current memory utilization"
              animateKey={`ram-${data.server.ramUsage}`}
            />
          </div>
        </div>

        <Separator className="my-1" />

        {/* Repeaters Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center">
            <Radio className="h-4 w-4 mr-1.5" />
            Repeaters
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <StatusItem
              icon={<Check className="h-4 w-4 text-green-500" />}
              label="Online"
              value={`${data.repeaters.online} / ${data.repeaters.total}`}
              tooltip="Number of online repeaters. Click to view repeaters page."
              animateKey={`repeaters-online-${data.repeaters.online}`}
              onClick={() => router.push("/devices/repeaters")}
              interactive
            />
            <div className="flex items-center justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <span className="text-xs ml-1.5">Power</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Power sources for repeaters</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-xs">
                {data.repeaters.powerSources.UPS > 0 && (
                  <span className="text-blue-600">UPS: {data.repeaters.powerSources.UPS}</span>
                )}
                {data.repeaters.powerSources.UPS > 0 && data.repeaters.powerSources.POE > 0 && " · "}
                {data.repeaters.powerSources.POE > 0 && (
                  <span className="text-orange-600">POE: {data.repeaters.powerSources.POE}</span>
                )}
                {(data.repeaters.powerSources.UPS > 0 || data.repeaters.powerSources.POE > 0) &&
                  data.repeaters.powerSources.AC > 0 &&
                  " · "}
                {data.repeaters.powerSources.AC > 0 && (
                  <span className="text-green-600">AC: {data.repeaters.powerSources.AC}</span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <Radio className="h-4 w-4 text-purple-500" />
                      <span className="text-xs ml-1.5">LoRa</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>LoRa frequencies in use</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-xs">
                {data.repeaters.frequencies["868"] > 0 && <span>{data.repeaters.frequencies["868"]}×868 MHz</span>}
                {data.repeaters.frequencies["868"] > 0 && data.repeaters.frequencies["433"] > 0 && " · "}
                {data.repeaters.frequencies["433"] > 0 && <span>{data.repeaters.frequencies["433"]}×433 MHz</span>}
                {(data.repeaters.frequencies["868"] > 0 || data.repeaters.frequencies["433"] > 0) &&
                  data.repeaters.frequencies["915"] > 0 &&
                  " · "}
                {data.repeaters.frequencies["915"] > 0 && <span>{data.repeaters.frequencies["915"]}×915 MHz</span>}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 text-blue-500" />
                      <span className="text-xs ml-1.5">Connection</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connection types for repeaters</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-xs">
                {data.repeaters.connectionTypes["Wi-Fi"] > 0 && (
                  <span>{data.repeaters.connectionTypes["Wi-Fi"]}×Wi-Fi</span>
                )}
                {data.repeaters.connectionTypes["Wi-Fi"] > 0 && data.repeaters.connectionTypes["Ethernet"] > 0 && " · "}
                {data.repeaters.connectionTypes["Ethernet"] > 0 && (
                  <span>{data.repeaters.connectionTypes["Ethernet"]}×Ethernet</span>
                )}
              </span>
            </div>
            <div className="mt-1">
              <Button variant="link" size="sm" className="h-6 p-0 text-xs" asChild>
                <a href="/devices/repeaters">View All</a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper component for status items with icons
function StatusItem({
  icon,
  label,
  value,
  tooltip,
  animateKey,
  alert = false,
  onClick,
  interactive = false,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  tooltip: string
  animateKey: string
  alert?: boolean
  onClick?: () => void
  interactive?: boolean
}) {
  return (
    <div
      className={`flex justify-between items-center ${interactive ? "cursor-pointer transition-all hover:bg-primary/5 hover:shadow-sm rounded px-1 hover:ring-1 hover:ring-primary/20" : ""}`}
      onClick={onClick}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              {icon}
              <span className="text-xs ml-1.5">{label}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <motion.div
        key={animateKey}
        initial="initial"
        animate="animate"
        variants={
          alert
            ? {
                initial: { scale: 1 },
                animate: { scale: [1, 1.1, 1], color: ["#ef4444", "#ef4444", "#ef4444"] },
              }
            : {
                initial: { scale: 1 },
                animate: { scale: [1, 1.1, 1] },
              }
        }
        className={`text-sm font-medium ${alert ? "text-red-500" : ""}`}
      >
        {value}
      </motion.div>
    </div>
  )
}

// Helper component for server metrics with progress bars
function ServerMetric({
  icon,
  label,
  value,
  maxValue = 100,
  unit = "",
  tooltip,
  animateKey,
  alert = false,
}: {
  icon: React.ReactNode
  label: string
  value: number
  maxValue?: number
  unit?: string
  tooltip: string
  animateKey: string
  alert?: boolean
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                {icon}
                <span className="text-xs ml-1.5">{label}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <motion.div
          key={animateKey}
          initial="initial"
          animate="animate"
          variants={{
            initial: { scale: 1 },
            animate: { scale: [1, 1.1, 1] },
          }}
          className={`text-xs font-medium ${alert ? "text-red-500" : ""}`}
        >
          {maxValue !== 100 ? `${value} / ${maxValue} ${unit}` : `${value}${unit}`}
        </motion.div>
      </div>
      <Progress
        value={(value / maxValue) * 100}
        className="h-1.5"
        indicatorClassName={alert ? "bg-red-500" : undefined}
      />
    </div>
  )
}
