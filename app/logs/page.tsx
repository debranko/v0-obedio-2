"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageLayout } from "@/components/ui-patterns/page-layout"
import { PageHeader } from "@/components/ui-patterns/page-header"
import { SystemLogsTab } from "@/components/logs/system-logs-tab"
import { ServiceRequestLogsTab } from "@/components/logs/service-request-logs-tab"
import { ClearLogsModal } from "@/components/logs/clear-logs-modal"
import { GenerateReportModal } from "@/components/logs/generate-report-modal"
import { Button } from "@/components/ui/button"
import { FileText, Trash2 } from "lucide-react"
import { fadeIn } from "@/lib/animation-utils"
import { motion } from "framer-motion"

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState("system")
  const [clearLogsModalOpen, setClearLogsModalOpen] = useState(false)
  const [generateReportModalOpen, setGenerateReportModalOpen] = useState(false)

  return (
    <PageLayout>
      <motion.div className="space-y-6" {...fadeIn}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <PageHeader title="Logs" description="View and manage system and service request logs" />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setClearLogsModalOpen(true)} className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              <span>Clear Logs</span>
            </Button>
            <Button
              variant="default"
              onClick={() => setGenerateReportModalOpen(true)}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>Generate Report</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="system" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="system">System Logs</TabsTrigger>
            <TabsTrigger value="service">Service Request Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="system" className="mt-0">
            <SystemLogsTab />
          </TabsContent>
          <TabsContent value="service" className="mt-0">
            <ServiceRequestLogsTab />
          </TabsContent>
        </Tabs>
      </motion.div>

      <ClearLogsModal
        open={clearLogsModalOpen}
        onOpenChange={setClearLogsModalOpen}
        logType={activeTab === "system" ? "system" : "service"}
      />

      <GenerateReportModal
        open={generateReportModalOpen}
        onOpenChange={setGenerateReportModalOpen}
        logType={activeTab === "system" ? "system" : "service"}
      />
    </PageLayout>
  )
}
