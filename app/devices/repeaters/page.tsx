"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, SortAsc } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageLayout } from "@/components/ui-patterns/page-layout"
import { SectionCard } from "@/components/ui-patterns/section-card"
import { RepeatersTable } from "@/components/devices/repeaters/repeaters-table"
import { RepeaterDetailsModal } from "@/components/devices/repeaters/repeater-details-modal"
import { AddRepeaterModal } from "@/components/devices/repeaters/add-repeater-modal"

export default function RepeatersManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("none")
  const [selectedRepeater, setSelectedRepeater] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Handle viewing repeater details
  const handleViewRepeaterDetails = (repeater: any) => {
    setSelectedRepeater(repeater)
    setIsDetailsModalOpen(true)
  }

  return (
    <PageLayout
      title="Repeaters Management"
      description="Monitor and manage all repeater devices in the system"
      action={
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Repeater
        </Button>
      }
    >
      <SectionCard title="Repeaters" description="All repeater devices in the network">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        >
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search repeaters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full md:w-[250px]"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Default</SelectItem>
                <SelectItem value="location">Location (A-Z)</SelectItem>
                <SelectItem value="devices">Connected Devices (High to Low)</SelectItem>
                <SelectItem value="signal">Signal Strength (High to Low)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <SortAsc className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <RepeatersTable searchTerm={searchTerm} sortBy={sortBy} onViewDetails={handleViewRepeaterDetails} />
      </SectionCard>

      {selectedRepeater && (
        <RepeaterDetailsModal
          repeater={selectedRepeater}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      <AddRepeaterModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </PageLayout>
  )
}
