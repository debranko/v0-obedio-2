"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Battery,
  CheckCircle2,
  Clock,
  Cpu,
  Download,
  FileText,
  Laptop,
  Plug,
  PlugZap,
  Power,
  RefreshCw,
  RotateCcw,
  Server,
  Signal,
  Wifi,
  WifiOff,
} from "lucide-react"
import { StatusBadge } from "@/components/ui-patterns/status-badge"
import { FormSection } from "@/components/ui-patterns/form-section"
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

interface RepeaterDetailsModalProps {
  repeater: any
  isOpen: boolean
  onClose: () => void
}

export function RepeaterDetailsModal({ repeater, isOpen, onClose }: RepeaterDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("diagnostics")
  const [isPinging, setIsPinging] = useState(false)
  const [pingResult, setPingResult] = useState<string | null>(null)
  const [isRestarting, setIsRestarting] = useState(false)
  const [alertSettings, setAlertSettings] = useState({
    offlineAlerts: true,
    weakSignalAlerts: true,
    powerSourceChangeAlerts: true,
  })

  // Handle ping repeater
  const handlePingRepeater = () => {
    setIsPinging(true)
    setPingResult(null)

    // Simulate ping delay
    setTimeout(() => {
      setIsPinging(false)
      if (repeater.status === "online") {
        setPingResult("success")
      } else {
        setPingResult("failed")
      }
    }, 2000)
  }

  // Handle restart repeater
  const handleRestartRepeater = () => {
    setIsRestarting(true)

    // Simulate restart delay
    setTimeout(() => {
      setIsRestarting(false)
      onClose()
    }, 3000)
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
                <Wifi className="h-5 w-5 text-primary" />
                Repeater Details
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  {repeater.id} • {repeater.location}
                </span>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="diagnostics" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="diagnostics" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Diagnostics & Status
                </TabsTrigger>
                <TabsTrigger value="logs" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Activity Logs
                </TabsTrigger>
              </TabsList>

              {/* Diagnostics & Status Tab */}
              <TabsContent value="diagnostics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormSection title="Repeater Status" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {repeater.status === "online" ? (
                          <Signal className="h-4 w-4 text-green-600" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">Status</span>
                      </div>
                      <StatusBadge
                        status={repeater.status as "online" | "offline"}
                        label={repeater.status === "online" ? "Online" : "Offline"}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Uptime</span>
                      </div>
                      <span>{repeater.status === "online" ? repeater.uptime : "N/A"}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Last Seen</span>
                      </div>
                      <span>{repeater.lastSeen}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Laptop className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">IP Address</span>
                      </div>
                      <span>{repeater.ipAddress}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Server className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">MAC Address</span>
                      </div>
                      <span>{repeater.macAddress}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Firmware</span>
                      </div>
                      <span>v{repeater.firmwareVersion}</span>
                    </div>
                  </FormSection>

                  <FormSection title="Diagnostic Tools" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Ping Repeater</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePingRepeater}
                          disabled={isPinging || repeater.status === "offline"}
                        >
                          {isPinging ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                className="mr-2"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </motion.div>
                              Pinging...
                            </>
                          ) : (
                            <>
                              <Activity className="mr-2 h-4 w-4" />
                              Ping
                            </>
                          )}
                        </Button>
                      </div>

                      {pingResult && (
                        <div
                          className={`p-3 rounded-md ${
                            pingResult === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                          }`}
                        >
                          {pingResult === "success" ? (
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              <span>Ping successful (12ms)</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              <span>Ping failed. Repeater unreachable.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={isRestarting || repeater.status === "offline"}
                          >
                            {isRestarting ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                  className="mr-2"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </motion.div>
                                Restarting...
                              </>
                            ) : (
                              <>
                                <Power className="mr-2 h-4 w-4" />
                                Restart Repeater
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Restart Repeater</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to restart this repeater? All connected devices will temporarily
                              lose connection.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRestartRepeater}>Restart</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="pt-4">
                      <div className="text-sm text-muted-foreground italic">
                        Note: LoRa Frequency settings are managed centrally in Settings → Communication.
                      </div>
                    </div>
                  </FormSection>
                </div>

                <FormSection title="Connected Devices" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Total Connected</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {repeater.connectedDevices} Devices
                    </Badge>
                  </div>

                  {repeater.connectedDevices > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <div className="grid grid-cols-3 bg-muted/20 p-2 text-sm font-medium">
                        <div>Device ID</div>
                        <div>Type</div>
                        <div>Signal Strength</div>
                      </div>
                      <div className="divide-y">
                        {repeater.connectedDevicesList.map((device: any, index: number) => (
                          <motion.div
                            key={device.id}
                            className="grid grid-cols-3 p-2 text-sm hover:bg-muted/10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="font-medium">{device.id}</div>
                            <div>{device.type}</div>
                            <div className="flex items-center">
                              <Signal className="h-3 w-3 mr-1 text-muted-foreground" />
                              {device.signal}%
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">No connected devices</div>
                  )}
                </FormSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormSection title="Signal & Performance" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Current Signal Strength</span>
                        <span
                          className={
                            repeater.signal > 80
                              ? "text-green-600 font-medium"
                              : repeater.signal > 50
                                ? "text-amber-600 font-medium"
                                : "text-red-600 font-medium"
                          }
                        >
                          {repeater.signal}%
                        </span>
                      </div>
                      <Progress
                        value={repeater.signal}
                        className={
                          repeater.signal > 80
                            ? "h-2 bg-green-100"
                            : repeater.signal > 50
                              ? "h-2 bg-amber-100"
                              : "h-2 bg-red-100"
                        }
                      />
                      <div className="text-xs text-muted-foreground">
                        {repeater.signal > 80
                          ? "Excellent signal strength"
                          : repeater.signal > 50
                            ? "Moderate signal strength"
                            : "Poor signal strength - consider relocating the repeater"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Signal History (24h)</span>
                        <Button variant="outline" size="sm">
                          <ArrowRight className="h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                      <div className="h-24 bg-muted/20 rounded-md p-2 relative">
                        <div className="absolute inset-0 flex items-end justify-between px-2">
                          {repeater.signalHistory.map((value: number, index: number) => (
                            <motion.div
                              key={index}
                              className={`w-1 rounded-t-sm ${
                                value > 80
                                  ? "bg-green-500"
                                  : value > 50
                                    ? "bg-amber-500"
                                    : value > 0
                                      ? "bg-red-500"
                                      : "bg-slate-300"
                              }`}
                              initial={{ height: 0 }}
                              animate={{ height: `${(value / 100) * 80}%` }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                            ></motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>24h ago</span>
                        <span>12h ago</span>
                        <span>Now</span>
                      </div>
                    </div>
                  </FormSection>

                  <FormSection title="Power & UPS" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <PlugZap className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Current Power Source</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          repeater.powerSource === "UPS"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }
                      >
                        <Plug className="h-3 w-3 mr-1" />
                        {repeater.powerSource}
                      </Badge>
                    </div>

                    {repeater.powerSource === "UPS" && (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">UPS Battery Level</span>
                            <span
                              className={
                                repeater.batteryLevel > 50
                                  ? "text-green-600 font-medium"
                                  : repeater.batteryLevel > 20
                                    ? "text-amber-600 font-medium"
                                    : "text-red-600 font-medium"
                              }
                            >
                              {repeater.batteryLevel}%
                            </span>
                          </div>
                          <Progress
                            value={repeater.batteryLevel}
                            className={
                              repeater.batteryLevel > 50
                                ? "h-2 bg-green-100"
                                : repeater.batteryLevel > 20
                                  ? "h-2 bg-amber-100"
                                  : "h-2 bg-red-100"
                            }
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Battery className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Estimated Runtime</span>
                          </div>
                          <span>{repeater.estimatedRuntime}</span>
                        </div>
                      </>
                    )}

                    <div className="pt-2">
                      <div className="text-sm text-muted-foreground">
                        {repeater.powerSource === "AC"
                          ? "Connected to AC power. UPS will activate automatically during power outages."
                          : "Running on UPS battery power. AC power is currently unavailable."}
                      </div>
                    </div>
                  </FormSection>
                </div>

                <FormSection title="Alert Settings" className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="offline-alerts" className="flex-1">
                      Repeater Offline Alerts
                      <p className="text-sm font-normal text-muted-foreground">
                        Receive notifications when this repeater goes offline
                      </p>
                    </Label>
                    <Switch
                      id="offline-alerts"
                      checked={alertSettings.offlineAlerts}
                      onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, offlineAlerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="weak-signal-alerts" className="flex-1">
                      Weak Signal Alerts
                      <p className="text-sm font-normal text-muted-foreground">
                        Receive notifications when signal strength drops below 50%
                      </p>
                    </Label>
                    <Switch
                      id="weak-signal-alerts"
                      checked={alertSettings.weakSignalAlerts}
                      onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, weakSignalAlerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="power-source-alerts" className="flex-1">
                      Power Source Change Alerts
                      <p className="text-sm font-normal text-muted-foreground">
                        Receive notifications when power source changes (AC to UPS or vice versa)
                      </p>
                    </Label>
                    <Switch
                      id="power-source-alerts"
                      checked={alertSettings.powerSourceChangeAlerts}
                      onCheckedChange={(checked) =>
                        setAlertSettings({ ...alertSettings, powerSourceChangeAlerts: checked })
                      }
                    />
                  </div>
                </FormSection>
              </TabsContent>

              {/* Activity Logs Tab */}
              <TabsContent value="logs" className="space-y-6">
                <FormSection title="Repeater Activity Logs" description="Recent events and status changes">
                  <div className="border rounded-md overflow-hidden">
                    <div className="divide-y">
                      {repeater.status === "online" ? (
                        <>
                          <div className="p-3 flex items-start">
                            <div className="mr-3 mt-0.5">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">Repeater Online</span>
                                <span className="text-sm text-muted-foreground">Today, 08:32 AM</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Repeater connected to the network successfully
                              </p>
                            </div>
                          </div>
                          <div className="p-3 flex items-start">
                            <div className="mr-3 mt-0.5">
                              <PlugZap className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">Power Source Changed</span>
                                <span className="text-sm text-muted-foreground">Today, 08:30 AM</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Power source changed from UPS to AC</p>
                            </div>
                          </div>
                          <div className="p-3 flex items-start">
                            <div className="mr-3 mt-0.5">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">Repeater Offline</span>
                                <span className="text-sm text-muted-foreground">Today, 08:15 AM</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Repeater disconnected from the network</p>
                            </div>
                          </div>
                          <div className="p-3 flex items-start">
                            <div className="mr-3 mt-0.5">
                              <PlugZap className="h-4 w-4 text-amber-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">Power Source Changed</span>
                                <span className="text-sm text-muted-foreground">Today, 08:14 AM</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Power source changed from AC to UPS</p>
                            </div>
                          </div>
                          <div className="p-3 flex items-start">
                            <div className="mr-3 mt-0.5">
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">Weak Signal Detected</span>
                                <span className="text-sm text-muted-foreground">Yesterday, 06:45 PM</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Signal strength dropped below 50% (48%)</p>
                            </div>
                          </div>
                          <div className="p-3 flex items-start">
                            <div className="mr-3 mt-0.5">
                              <RefreshCw className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">Repeater Restarted</span>
                                <span className="text-sm text-muted-foreground">Yesterday, 02:30 PM</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Repeater was restarted manually by Admin User
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-3 flex items-start">
                            <div className="mr-3 mt-0.5">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">Repeater Offline</span>
                                <span className="text-sm text-muted-foreground">Today, 10:15 AM</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Repeater disconnected from the network</p>
                            </div>
                          </div>
                          <div className="p-3 flex items-start">
                            <div className="mr-3 mt-0.5">
                              <PlugZap className="h-4 w-4 text-amber-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">Power Source Changed</span>
                                <span className="text-sm text-muted-foreground">Today, 10:14 AM</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Power source changed from AC to UPS</p>
                            </div>
                          </div>
                          <div className="p-3 flex items-start">
                            <div className="mr-3 mt-0.5">
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">Weak Signal Detected</span>
                                <span className="text-sm text-muted-foreground">Today, 09:45 AM</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Signal strength dropped below 50% (42%)</p>
                            </div>
                          </div>
                          <div className="p-3 flex items-start">
                            <div className="mr-3 mt-0.5">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">Repeater Online</span>
                                <span className="text-sm text-muted-foreground">Today, 08:30 AM</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Repeater connected to the network successfully
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </FormSection>

                <div className="flex justify-end">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Logs
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
