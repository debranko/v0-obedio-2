"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
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
import {
  Download,
  Trash2,
  FileJson,
  Calendar,
  Upload,
  RefreshCw,
  FileText,
  FileSpreadsheetIcon as FileCsv,
  AlertTriangle,
} from "lucide-react"

export default function BackupLogsTab() {
  const [logFormat, setLogFormat] = useState("csv")
  const [backupSchedule, setBackupSchedule] = useState("7")
  const [isDownloadingLogs, setIsDownloadingLogs] = useState(false)
  const [isDownloadingConfigs, setIsDownloadingConfigs] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const downloadLogs = async () => {
    setIsDownloadingLogs(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Logs downloaded",
      description: `System logs have been downloaded in ${logFormat.toUpperCase()} format.`,
    })

    setIsDownloadingLogs(false)
  }

  const downloadConfigs = async () => {
    setIsDownloadingConfigs(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Configurations downloaded",
      description: "Device configurations have been downloaded as JSON.",
    })

    setIsDownloadingConfigs(false)
  }

  const clearLogs = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    toast({
      title: "Logs cleared",
      description: "All system logs have been cleared successfully.",
    })
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    toast({
      title: "Settings saved",
      description: "Your backup and log settings have been saved successfully.",
    })

    setIsSaving(false)
  }

  return (
    <Card className="rounded-2xl shadow-md bg-white">
      <CardHeader>
        <CardTitle>Backup & Logs</CardTitle>
        <CardDescription>Manage system logs and data backups</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">System Logs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="log-format">Log Format</Label>
              <Select value={logFormat} onValueChange={setLogFormat}>
                <SelectTrigger id="log-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center">
                      <FileCsv className="mr-2 h-4 w-4" />
                      CSV
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      PDF
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={downloadLogs} disabled={isDownloadingLogs} className="flex-1">
                {isDownloadingLogs ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="mr-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </motion.div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Logs
                  </>
                )}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-destructive" />
                    Clear
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently delete all system logs. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={clearLogs}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Clear All Logs
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Device Configurations</h3>
          <Button onClick={downloadConfigs} disabled={isDownloadingConfigs} className="flex items-center gap-2">
            {isDownloadingConfigs ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="mr-2"
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
                Downloading...
              </>
            ) : (
              <>
                <FileJson className="mr-2 h-4 w-4" />
                Download Device Configs (JSON)
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Automatic Backup</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="backup-schedule">Backup Schedule</Label>
              </div>
              <Select value={backupSchedule} onValueChange={setBackupSchedule}>
                <SelectTrigger id="backup-schedule">
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Daily</SelectItem>
                  <SelectItem value="7">Weekly</SelectItem>
                  <SelectItem value="30">Monthly</SelectItem>
                  <SelectItem value="0">Never (Manual only)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                System will automatically create backups according to this schedule
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Restore Backup</h3>
          <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
            <div className="flex flex-col items-center">
              <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
              <Button variant="outline" className="mb-2">
                <Upload className="mr-2 h-4 w-4" />
                Upload Backup File (.obd)
              </Button>
              <p className="text-xs text-muted-foreground text-center max-w-md">
                Restore from a previously created backup file. This will overwrite current settings.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving} className="ml-auto">
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="mr-2"
              >
                <RefreshCw className="h-4 w-4" />
              </motion.div>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
