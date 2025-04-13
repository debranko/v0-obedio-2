"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ModalContainer } from "@/components/ui-patterns/modal-container"
import { FormSection } from "@/components/ui-patterns/form-section"
import { FormField } from "@/components/ui-patterns/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { UserCog, Info, ShieldCheck, History, Check, Smartphone, LogOut, KeyRound, Plus } from "lucide-react"
import { tabVariants, tabTransition } from "@/lib/animation-utils"

interface EditUserPermissionsModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

export function EditUserPermissionsModal({ isOpen, onClose, user }: EditUserPermissionsModalProps) {
  const [activeTab, setActiveTab] = useState("general")
  const [formData, setFormData] = useState({
    role: user.role,
    status: user.status === "active",
    simplifiedUI: true,
    permissions: { ...user.permissions },
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePermissionChange = (section: string, permission: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section]: {
          ...prev.permissions[section],
          [permission]: value,
        },
      },
    }))
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log("Permissions updated:", formData)
    onClose()
  }

  // Mock data for roles
  const roles = [
    { id: "role-1", name: "Admin" },
    { id: "role-2", name: "Chief Stewardess" },
    { id: "role-3", name: "Stewardess" },
    { id: "role-4", name: "Junior Steward" },
    { id: "role-5", name: "Engineer" },
  ]

  // Sections for permissions matrix
  const sections = [
    { id: "dashboard", name: "Dashboard" },
    { id: "devices", name: "Devices" },
    { id: "guests", name: "Guests" },
    { id: "locations", name: "Locations" },
    { id: "logs", name: "Logs" },
    { id: "settings", name: "Settings" },
  ]

  // Permission types
  const permissionTypes = [
    { id: "view", name: "View", description: "Can view this section" },
    { id: "modify", name: "Modify", description: "Can make changes in this section" },
    { id: "assign", name: "Assign", description: "Can assign resources and permissions" },
  ]

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit User: ${user.name}`}
      icon={<UserCog />}
      onSave={handleSubmit}
      saveLabel="Save Changes"
      size="xl"
    >
      <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>General Info</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Permissions Matrix</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>Sessions</span>
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
            {/* General Info Tab */}
            <TabsContent value="general" className="mt-0">
              <div className="space-y-6">
                <FormSection title="User Information" description="Basic user details and role">
                  <FormField label="Full Name" htmlFor="fullName">
                    <Input id="fullName" value={user.name} disabled className="bg-muted/50" />
                  </FormField>

                  <FormField label="Email Address" htmlFor="email">
                    <Input id="email" value={user.email} disabled className="bg-muted/50" />
                  </FormField>

                  <FormField label="Role" htmlFor="role" description="Determines default permissions and access level">
                    <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </FormSection>

                <FormSection
                  title="Account Settings"
                  description="Status and interface preferences"
                  icon={<UserCog className="h-5 w-5" />}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="status">Account Status</Label>
                      <div className="text-sm text-muted-foreground">Enable or disable user access to the system</div>
                    </div>
                    <Switch
                      id="status"
                      checked={formData.status}
                      onCheckedChange={(checked) => handleChange("status", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="simplifiedUI">Simplified User Interface</Label>
                      <div className="text-sm text-muted-foreground">
                        Show a simplified UI with only essential features
                      </div>
                    </div>
                    <Switch
                      id="simplifiedUI"
                      checked={formData.simplifiedUI}
                      onCheckedChange={(checked) => handleChange("simplifiedUI", checked)}
                    />
                  </div>

                  <Button variant="outline" className="w-full">
                    <KeyRound className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                </FormSection>

                <FormSection
                  title="Device Assignments"
                  description="Manage assigned devices"
                  icon={<Smartphone className="h-5 w-5" />}
                >
                  {user.devices.length > 0 ? (
                    <div className="space-y-4">
                      {user.devices.map((device: string, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <span>{device}</span>
                          </div>
                          <Button variant="outline" size="sm">
                            Unassign
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Assign Additional Device
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-4">No devices assigned</p>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Assign Device
                      </Button>
                    </div>
                  )}
                </FormSection>
              </div>
            </TabsContent>

            {/* Permissions Matrix Tab */}
            <TabsContent value="permissions" className="mt-0">
              <div className="space-y-6">
                <FormSection
                  title="Permissions Matrix"
                  description="Configure detailed access permissions for each section"
                >
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-medium">Section</th>
                          {permissionTypes.map((type) => (
                            <th key={type.id} className="text-left p-3 font-medium">
                              <div className="flex items-center gap-1">
                                <span>{type.name}</span>
                                <span className="text-xs text-muted-foreground">({type.description})</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sections.map((section) => (
                          <tr key={section.id} className="border-t">
                            <td className="p-3 font-medium">{section.name}</td>
                            {permissionTypes.map((type) => (
                              <td key={`${section.id}-${type.id}`} className="p-3">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${section.id}-${type.id}`}
                                    checked={formData.permissions[section.id]?.[type.id] || false}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(section.id, type.id, !!checked)
                                    }
                                  />
                                  <Label htmlFor={`${section.id}-${type.id}`} className="sr-only">
                                    {`${section.name} ${type.name}`}
                                  </Label>
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Role Template</h4>
                      <p className="text-xs text-muted-foreground">Apply a predefined set of permissions</p>
                    </div>
                    <Select>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="chief-stewardess">Chief Stewardess</SelectItem>
                        <SelectItem value="stewardess">Stewardess</SelectItem>
                        <SelectItem value="junior-steward">Junior Steward</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormSection>

                <FormSection
                  title="Permission Legend"
                  description="Understanding permission levels"
                  icon={<Info className="h-5 w-5" />}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">View</p>
                        <p className="text-muted-foreground">
                          Can view information in this section but cannot make changes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Modify</p>
                        <p className="text-muted-foreground">
                          Can make changes to existing items but cannot create new ones
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <Check className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Assign</p>
                        <p className="text-muted-foreground">Can assign resources and manage permissions for others</p>
                      </div>
                    </div>
                  </div>
                </FormSection>
              </div>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="mt-0">
              <FormSection
                title="Active Sessions"
                description="Manage user's active login sessions"
                icon={<History className="h-5 w-5" />}
              >
                {user.sessions.length > 0 ? (
                  <div className="space-y-4">
                    {user.sessions.map((session: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="font-medium">{session.device}</div>
                          <div className="text-sm text-muted-foreground">
                            {session.ip} • {session.time}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <LogOut className="h-4 w-4 mr-2" />
                          Revoke
                        </Button>
                      </div>
                    ))}

                    <Button variant="outline" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Revoke All Sessions
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No active sessions</p>
                  </div>
                )}
              </FormSection>

              <FormSection
                title="Login History"
                description="Recent login activity"
                icon={<History className="h-5 w-5" />}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <div className="font-medium">iPhone 13</div>
                      <div className="text-xs text-muted-foreground">192.168.1.45</div>
                    </div>
                    <div className="text-right">
                      <div>Today, 10:23 AM</div>
                      <div className="text-xs text-muted-foreground">Successful</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <div className="font-medium">MacBook Pro</div>
                      <div className="text-xs text-muted-foreground">192.168.1.23</div>
                    </div>
                    <div className="text-right">
                      <div>Yesterday, 15:47 PM</div>
                      <div className="text-xs text-muted-foreground">Successful</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <div className="font-medium">Unknown Device</div>
                      <div className="text-xs text-muted-foreground">203.45.67.89</div>
                    </div>
                    <div className="text-right">
                      <div>3 days ago, 08:12 AM</div>
                      <div className="text-xs text-red-500">Failed (Wrong Password)</div>
                    </div>
                  </div>
                </div>
              </FormSection>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </ModalContainer>
  )
}
