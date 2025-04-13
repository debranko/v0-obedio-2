"use client"

import { useState } from "react"
import { ModalContainer } from "@/components/ui-patterns/modal-container"
import { FormSection } from "@/components/ui-patterns/form-section"
import { FormField } from "@/components/ui-patterns/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { UserPlus, Key, Smartphone } from "lucide-react"

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    smartwatch: "",
    location: "",
    sendInvite: true,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData)
    onClose()
  }

  // Mock data for dropdowns
  const roles = [
    { id: "role-1", name: "Admin" },
    { id: "role-2", name: "Chief Stewardess" },
    { id: "role-3", name: "Stewardess" },
    { id: "role-4", name: "Junior Steward" },
    { id: "role-5", name: "Engineer" },
  ]

  const smartwatches = [
    { id: "watch-1", name: "Smart Watch #106 (Available)" },
    { id: "watch-2", name: "Smart Watch #107 (Available)" },
    { id: "watch-3", name: "Smart Watch #108 (Available)" },
  ]

  const locations = [
    { id: "loc-1", name: "Bridge Deck" },
    { id: "loc-2", name: "Main Deck" },
    { id: "loc-3", name: "Lower Deck" },
    { id: "loc-4", name: "Guest Deck" },
  ]

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Add New User / Crew Member"
      icon={<UserPlus />}
      onSave={handleSubmit}
      saveLabel="Create User"
      size="lg"
    >
      <div className="space-y-6">
        <FormSection title="Personal Information" description="Enter the crew member's details">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" htmlFor="firstName">
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Enter first name"
              />
            </FormField>

            <FormField label="Last Name" htmlFor="lastName">
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Enter last name"
              />
            </FormField>
          </div>

          <FormField label="Email Address" htmlFor="email">
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email address"
            />
          </FormField>
        </FormSection>

        <FormSection
          title="Account & Access"
          description="Set up login credentials and role"
          icon={<Key className="h-5 w-5" />}
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Password" htmlFor="password">
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Enter password"
              />
            </FormField>

            <FormField label="Confirm Password" htmlFor="confirmPassword">
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="Confirm password"
              />
            </FormField>
          </div>

          <FormField label="Role" htmlFor="role" description="Determines default permissions and access level">
            <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="flex items-center space-x-2">
            <Switch
              id="sendInvite"
              checked={formData.sendInvite}
              onCheckedChange={(checked) => handleChange("sendInvite", checked)}
            />
            <Label htmlFor="sendInvite">Send email invitation with login details</Label>
          </div>
        </FormSection>

        <FormSection
          title="Assignments (Optional)"
          description="Assign devices and location"
          icon={<Smartphone className="h-5 w-5" />}
        >
          <FormField label="Assign Smartwatch" htmlFor="smartwatch">
            <Select value={formData.smartwatch} onValueChange={(value) => handleChange("smartwatch", value)}>
              <SelectTrigger id="smartwatch">
                <SelectValue placeholder="Select a smartwatch (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {smartwatches.map((watch) => (
                  <SelectItem key={watch.id} value={watch.id}>
                    {watch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Assign Location / Deck"
            htmlFor="location"
            description="Primary working area for this crew member"
          >
            <Select value={formData.location} onValueChange={(value) => handleChange("location", value)}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select a location (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </FormSection>
      </div>
    </ModalContainer>
  )
}
