"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bluetooth, Watch, Wifi, Search, Plus, X } from "lucide-react"
import { SmartButtonsTab } from "@/components/devices/smart-buttons-tab"
import { SmartWatchesTab } from "@/components/devices/smart-watches-tab"
import { RepeatersTab } from "@/components/devices/repeaters-tab"
import { QrProvisioningModal } from "@/components/devices/qr-provisioning-modal"
import { tabVariants, tabTransition, buttonHoverVariants } from "@/lib/animation-utils"
import { Badge } from "@/components/ui/badge"
import { useSearchParams, useRouter } from "next/navigation"

export default function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isProvisioningOpen, setIsProvisioningOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("smart-buttons")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [activeSort, setActiveSort] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  // Process URL parameters on component mount
  useEffect(() => {
    const tab = searchParams.get("tab")
    const filter = searchParams.get("filter")
    const sort = searchParams.get("sort")

    if (tab) {
      setActiveTab(tab)
    }

    if (filter) {
      setActiveFilter(filter)
    }

    if (sort) {
      setActiveSort(sort)
    }
  }, [searchParams])

  // Clear filter and update URL
  const clearFilter = () => {
    setActiveFilter(null)
    setActiveSort(null)

    // Update URL without the filter and sort parameters
    const params = new URLSearchParams(searchParams.toString())
    params.delete("filter")
    params.delete("sort")
    router.push(`/devices?${params.toString()}`)
  }

  // Get filter label for display
  const getFilterLabel = () => {
    switch (activeFilter) {
      case "low-battery":
        return "Low Battery"
      case "online":
        return "Online"
      case "active":
        return "Active"
      case "charging":
        return "Charging"
      default:
        return ""
    }
  }

  // Get sort label for display
  const getSortLabel = () => {
    switch (activeSort) {
      case "provisioned":
        return "Recently Provisioned"
      case "last-seen":
        return "Last Seen"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.h1
          className="text-2xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Devices
        </motion.h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full md:w-[250px]"
            />
          </div>
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={buttonHoverVariants}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button onClick={() => setIsProvisioningOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Device
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Active filters display */}
      {(activeFilter || activeSort) && (
        <motion.div
          className="flex items-center gap-2 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {activeFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {getFilterLabel()}
              <button onClick={clearFilter} className="ml-1 rounded-full hover:bg-muted p-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {activeSort && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sorted by: {getSortLabel()}
              <button onClick={clearFilter} className="ml-1 rounded-full hover:bg-muted p-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </motion.div>
      )}

      <motion.div
        className="bg-white rounded-2xl shadow-sm border p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="smart-buttons" className="data-[state=active]:bg-primary/10">
              <Bluetooth className="mr-2 h-4 w-4" />
              Smart Buttons
            </TabsTrigger>
            <TabsTrigger value="smart-watches" className="data-[state=active]:bg-primary/10">
              <Watch className="mr-2 h-4 w-4" />
              Smart Watches
            </TabsTrigger>
            <TabsTrigger value="repeaters" className="data-[state=active]:bg-primary/10">
              <Wifi className="mr-2 h-4 w-4" />
              Repeaters
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
              <TabsContent value="smart-buttons" className="mt-0">
                <SmartButtonsTab searchTerm={searchTerm} activeFilter={activeFilter} activeSort={activeSort} />
              </TabsContent>

              <TabsContent value="smart-watches" className="mt-0">
                <SmartWatchesTab searchTerm={searchTerm} activeFilter={activeFilter} activeSort={activeSort} />
              </TabsContent>

              <TabsContent value="repeaters" className="mt-0">
                <RepeatersTab searchTerm={searchTerm} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>

      <QrProvisioningModal isOpen={isProvisioningOpen} onClose={() => setIsProvisioningOpen(false)} />
    </div>
  )
}
