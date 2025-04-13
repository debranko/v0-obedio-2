"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormSection } from "@/components/ui-patterns/form-section"
import { FormField } from "@/components/ui-patterns/form-field"
import { Plus, Wifi } from "lucide-react"
import { themeConfig } from "@/lib/theme-config"

interface AddRepeaterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddRepeaterModal({ isOpen, onClose }: AddRepeaterModalProps) {
  const [step, setStep] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    location: "",
    model: "LoRa Repeater Pro",
    powerSource: "AC",
  })

  // Handle form input change
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  // Handle form submission
  const handleSubmit = () => {
    setIsAdding(true)

    // Simulate adding delay
    setTimeout(() => {
      setIsAdding(false)
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <DialogHeader className="mb-6">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Plus className="h-5 w-5 text-primary" />
              Add New Repeater
            </DialogTitle>
          </DialogHeader>

          {step === 1 && (
            <div className={themeConfig.spacing.container}>
              <FormSection title="Repeater Information">
                <FormField label="Repeater ID" htmlFor="repeater-id" tooltip="Unique identifier for the repeater">
                  <Input
                    id="repeater-id"
                    placeholder="e.g., RPT-006"
                    value={formData.id}
                    onChange={(e) => handleInputChange("id", e.target.value)}
                  />
                </FormField>

                <FormField label="Location" htmlFor="repeater-location" tooltip="Where the repeater will be installed">
                  <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger id="repeater-location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Deck">Main Deck</SelectItem>
                      <SelectItem value="Lower Deck">Lower Deck</SelectItem>
                      <SelectItem value="Upper Deck">Upper Deck</SelectItem>
                      <SelectItem value="Engine Room">Engine Room</SelectItem>
                      <SelectItem value="Guest Cabin Area">Guest Cabin Area</SelectItem>
                      <SelectItem value="Master Cabin">Master Cabin</SelectItem>
                      <SelectItem value="Salon">Salon</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Model" htmlFor="repeater-model">
                  <Select value={formData.model} onValueChange={(value) => handleInputChange("model", value)}>
                    <SelectTrigger id="repeater-model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LoRa Repeater Pro">LoRa Repeater Pro</SelectItem>
                      <SelectItem value="LoRa Repeater Standard">LoRa Repeater Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Power Source" htmlFor="repeater-power">
                  <Select
                    value={formData.powerSource}
                    onValueChange={(value) => handleInputChange("powerSource", value)}
                  >
                    <SelectTrigger id="repeater-power">
                      <SelectValue placeholder="Select power source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AC">AC Power</SelectItem>
                      <SelectItem value="UPS">UPS Battery</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </FormSection>

              <div className="text-sm text-muted-foreground mt-4">
                Note: After adding the repeater, you will need to provision it using the QR code on the device.
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.id || !formData.location || isAdding}>
              {isAdding ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mr-2"
                  >
                    <Wifi className="h-4 w-4" />
                  </motion.div>
                  Adding Repeater...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Repeater
                </>
              )}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
