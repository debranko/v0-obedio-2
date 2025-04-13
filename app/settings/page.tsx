"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageLayout } from "@/components/ui-patterns/page-layout"
import { PageHeader } from "@/components/ui-patterns/page-header"
import { Settings, Radio, Smartphone, Bell, Users, Palette, RefreshCw, Database } from "lucide-react"
import { tabVariants, tabTransition } from "@/lib/animation-utils"

// Import tab components
import GeneralTab from "@/components/settings/general-tab"
import CommunicationTab from "@/components/settings/communication-tab"
import DevicesTab from "@/components/settings/devices-tab"
import NotificationsTab from "@/components/settings/notifications-tab"
import UsersPermissionsTab from "@/components/settings/users-permissions-tab"
import ThemesDisplayTab from "@/components/settings/themes-display-tab"
import OtaUpdatesTab from "@/components/settings/ota-updates-tab"
import BackupLogsTab from "@/components/settings/backup-logs-tab"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <PageLayout>
      <PageHeader
        title="Settings"
        description="Configure system settings and preferences"
        icon={<Settings className="h-6 w-6" />}
      />

      <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-9">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            <span className="hidden md:inline">Communication</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span className="hidden md:inline">Devices</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Users & Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden md:inline">Themes & Display</span>
          </TabsTrigger>
          <TabsTrigger value="updates" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden md:inline">OTA & Updates</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden md:inline">Backup & Logs</span>
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
            <TabsContent value="general" className="mt-0">
              <GeneralTab />
            </TabsContent>

            <TabsContent value="communication" className="mt-0">
              <CommunicationTab />
            </TabsContent>

            <TabsContent value="devices" className="mt-0">
              <DevicesTab />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <NotificationsTab />
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <UsersPermissionsTab />
            </TabsContent>

            <TabsContent value="themes" className="mt-0">
              <ThemesDisplayTab />
            </TabsContent>

            <TabsContent value="updates" className="mt-0">
              <OtaUpdatesTab />
            </TabsContent>

            <TabsContent value="backup" className="mt-0">
              <BackupLogsTab />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </PageLayout>
  )
}
