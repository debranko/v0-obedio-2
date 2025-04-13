"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CameraIcon, QrCode, Upload } from "lucide-react"

interface QrProvisioningModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QrProvisioningModal({ isOpen, onClose }: QrProvisioningModalProps) {
  const [deviceType, setDeviceType] = useState("smart-button")
  const [step, setStep] = useState(1)
  const [isScanning, setIsScanning] = useState(false)

  // Reset state when modal is closed
  const handleClose = () => {
    setStep(1)
    setIsScanning(false)
    onClose()
  }

  // Simulate scanning QR code
  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setStep(2)
    }, 2000)
  }

  // Simulate completing provisioning
  const handleComplete = () => {
    setTimeout(() => {
      handleClose()
    }, 500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <QrCode className="h-5 w-5 text-primary" />
              Provision New Device
            </DialogTitle>
          </DialogHeader>

          {step === 1 && (
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="device-type">Device Type</Label>
                <Select value={deviceType} onValueChange={setDeviceType}>
                  <SelectTrigger id="device-type">
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smart-button">Smart Button</SelectItem>
                    <SelectItem value="smart-watch">Smart Watch</SelectItem>
                    <SelectItem value="repeater">Repeater</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-lg">
                {isScanning ? (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <CameraIcon className="h-32 w-32 text-muted-foreground" />
                      <motion.div
                        className="absolute top-0 left-0 w-full h-1 bg-primary"
                        initial={{ top: 0 }}
                        animate={{ top: "100%" }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          ease: "linear",
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">Scanning QR code...</p>
                  </div>
                ) : (
                  <>
                    <CameraIcon className="h-32 w-32 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-4 mb-6">
                      Position the QR code within the frame to scan
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleScan}>
                        Start Scanning
                      </Button>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload QR Code
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="device-id">Device ID</Label>
                  <Input
                    id="device-id"
                    value={
                      deviceType === "smart-button" ? "BTN-006" : deviceType === "smart-watch" ? "WCH-006" : "RPT-005"
                    }
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="device-location">Location</Label>
                  <Select defaultValue="master-cabin">
                    <SelectTrigger id="device-location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="master-cabin">Master Cabin</SelectItem>
                      <SelectItem value="vip-suite-1">VIP Suite 1</SelectItem>
                      <SelectItem value="vip-suite-2">VIP Suite 2</SelectItem>
                      <SelectItem value="guest-cabin-1">Guest Cabin 1</SelectItem>
                      <SelectItem value="guest-cabin-2">Guest Cabin 2</SelectItem>
                      <SelectItem value="salon">Salon</SelectItem>
                      <SelectItem value="dining-room">Dining Room</SelectItem>
                      <SelectItem value="main-deck">Main Deck</SelectItem>
                      <SelectItem value="lower-deck">Lower Deck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {deviceType === "smart-watch" && (
                  <div className="space-y-2">
                    <Label htmlFor="assigned-crew">Assign to Crew Member</Label>
                    <Select defaultValue="unassigned">
                      <SelectTrigger id="assigned-crew">
                        <SelectValue placeholder="Select crew member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        <SelectItem value="john-smith">John Smith</SelectItem>
                        <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                        <SelectItem value="david-williams">David Williams</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-green-700 text-sm">
                  Device detected successfully. Ready to provision.
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleComplete}>Complete Provisioning</Button>
              </div>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
