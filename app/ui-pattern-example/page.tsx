"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Cog, User, Bell, Battery, Signal, PlugZap } from "lucide-react"
import { PageLayout } from "@/components/ui-patterns/page-layout"
import { SectionCard } from "@/components/ui-patterns/section-card"
import { DataTable } from "@/components/ui-patterns/data-table"
import { StatusBadge } from "@/components/ui-patterns/status-badge"
import { ModalContainer } from "@/components/ui-patterns/modal-container"
import { FormSection } from "@/components/ui-patterns/form-section"
import { FormField } from "@/components/ui-patterns/form-field"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

// Sample data
const devices = [
  {
    id: "DEV-001",
    name: "Smart Button",
    location: "Master Cabin",
    status: "online",
    battery: 85,
    signal: 92,
    lastSeen: "2 min ago",
  },
  {
    id: "DEV-002",
    name: "Smart Watch",
    location: "VIP Suite",
    status: "online",
    battery: 72,
    signal: 88,
    lastSeen: "5 min ago",
  },
  {
    id: "DEV-003",
    name: "Repeater",
    location: "Main Deck",
    status: "offline",
    battery: 0,
    signal: 0,
    lastSeen: "2 hours ago",
  },
  {
    id: "DEV-004",
    name: "Smart Button",
    location: "Guest Cabin 1",
    status: "online",
    battery: 15,
    signal: 76,
    lastSeen: "10 min ago",
  },
]

export default function UIPatternExample() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<any>(null)

  // Filter devices based on search term and active tab
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = activeTab === "all" || device.name.toLowerCase().includes(activeTab.toLowerCase())

    return matchesSearch && matchesTab
  })

  // Configure a device
  const handleConfigureDevice = (device: any) => {
    setSelectedDevice(device)
    setIsModalOpen(true)
  }

  // Table columns configuration
  const columns = [
    {
      key: "id",
      header: "Device ID",
      cell: (device: any) => <div className="font-medium">{device.id}</div>,
    },
    {
      key: "name",
      header: "Device Type",
      cell: (device: any) => <div>{device.name}</div>,
    },
    {
      key: "location",
      header: "Location",
      cell: (device: any) => <div>{device.location}</div>,
    },
    {
      key: "status",
      header: "Status",
      cell: (device: any) => (
        <StatusBadge
          status={device.status as "online" | "offline"}
          icon={device.status === "online" ? <Signal className="h-3 w-3" /> : undefined}
        />
      ),
    },
    {
      key: "battery",
      header: "Battery",
      cell: (device: any) => (
        <div className="flex items-center">
          {device.battery > 0 ? (
            <>
              <Battery className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{device.battery}%</span>
            </>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (device: any) => (
        <Button variant="outline" size="sm" onClick={() => handleConfigureDevice(device)}>
          <Cog className="mr-2 h-4 w-4" />
          Configure
        </Button>
      ),
      className: "text-right",
    },
  ]

  return (
    <PageLayout
      title="Devices Management"
      description="View and manage all connected devices"
      action={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      }
    >
      <SectionCard title="Devices" description="All connected devices in the system">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full md:w-[250px]"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Devices</TabsTrigger>
              <TabsTrigger value="button">Smart Buttons</TabsTrigger>
              <TabsTrigger value="watch">Smart Watches</TabsTrigger>
              <TabsTrigger value="repeater">Repeaters</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <DataTable
          columns={columns}
          data={filteredDevices}
          emptyMessage="No devices found matching your search criteria."
        />
      </SectionCard>

      {/* Device Configuration Modal */}
      {selectedDevice && (
        <ModalContainer
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Configure ${selectedDevice.name}`}
          icon={<Cog className="h-5 w-5" />}
          onSave={() => setIsModalOpen(false)}
        >
          <Tabs defaultValue="general">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Cog className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="power" className="flex items-center gap-2">
                <Battery className="h-4 w-4" />
                Power
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <FormSection title="Device Information">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Device ID" htmlFor="device-id">
                    <Input id="device-id" value={selectedDevice.id} readOnly />
                  </FormField>
                  <FormField label="Device Type" htmlFor="device-type">
                    <Input id="device-type" value={selectedDevice.name} readOnly />
                  </FormField>
                </div>
                <FormField label="Location" htmlFor="device-location">
                  <Select defaultValue={selectedDevice.location}>
                    <SelectTrigger id="device-location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Master Cabin">Master Cabin</SelectItem>
                      <SelectItem value="VIP Suite">VIP Suite</SelectItem>
                      <SelectItem value="Guest Cabin 1">Guest Cabin 1</SelectItem>
                      <SelectItem value="Main Deck">Main Deck</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </FormSection>

              <FormSection title="Assigned User" description="Assign this device to a crew member">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?key=ro8m9" alt="Emma Wilson" />
                    <AvatarFallback>EW</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Emma Wilson</div>
                    <div className="text-sm text-muted-foreground">Chief Stewardess</div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <User className="mr-2 h-4 w-4" />
                    Change
                  </Button>
                </div>
              </FormSection>
            </TabsContent>

            <TabsContent value="notifications">
              <FormSection title="Alert Settings">
                <FormField
                  label="Low Battery Alerts"
                  htmlFor="low-battery-alerts"
                  description="Notify when battery level is below 20%"
                >
                  <div className="flex items-center space-x-2">
                    <Switch id="low-battery-alerts" defaultChecked />
                    <Label htmlFor="low-battery-alerts">Enabled</Label>
                  </div>
                </FormField>

                <FormField
                  label="Offline Alerts"
                  htmlFor="offline-alerts"
                  description="Notify when device goes offline"
                >
                  <div className="flex items-center space-x-2">
                    <Switch id="offline-alerts" defaultChecked />
                    <Label htmlFor="offline-alerts">Enabled</Label>
                  </div>
                </FormField>
              </FormSection>
            </TabsContent>

            <TabsContent value="power">
              <FormSection title="Power Management">
                <FormField
                  label="Power Saving Mode"
                  htmlFor="power-saving"
                  tooltip="Extends battery life by reducing update frequency"
                >
                  <div className="flex items-center space-x-2">
                    <Switch id="power-saving" />
                    <Label htmlFor="power-saving">Enabled</Label>
                  </div>
                </FormField>

                <FormField label="Signal Strength" description="Current signal strength">
                  <div className="flex items-center space-x-2">
                    <Signal className="h-4 w-4 text-muted-foreground" />
                    <div className="w-full">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{selectedDevice.signal}%</span>
                      </div>
                      <Slider value={[selectedDevice.signal]} min={0} max={100} step={1} disabled />
                    </div>
                  </div>
                </FormField>

                <FormField label="Charging Status">
                  <div className="flex items-center space-x-2">
                    <PlugZap className="h-4 w-4 text-muted-foreground" />
                    <span>Not charging</span>
                  </div>
                </FormField>
              </FormSection>
            </TabsContent>
          </Tabs>
        </ModalContainer>
      )}
    </PageLayout>
  )
}
