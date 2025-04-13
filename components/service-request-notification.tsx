"use client"

import { useEffect, useState, createContext, useContext, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Bell, X } from "lucide-react"
import { useNotificationSound } from "@/components/audio-notification-system"
import { useToast } from "@/components/ui/use-toast"

// Define the service request interface
export interface ServiceRequest {
  id: number
  timestamp: string
  room: string
  service: string
  message: string | null
  hasVoice: boolean
  assignedCrew: string | null
  status: "active" | "resolved" | "unanswered"
  responseTime: string | null
  isNew?: boolean
}

// Create a context for service requests
interface ServiceRequestContextProps {
  requests: ServiceRequest[]
  addNewServiceRequest: (request: ServiceRequest) => ServiceRequest
  markRequestAsSeen: (requestId: number) => void
}

const ServiceRequestContext = createContext<ServiceRequestContextProps | undefined>(undefined)

// Service Request Provider Component
interface ServiceRequestProviderProps {
  children: ReactNode
}

export function ServiceRequestProvider({ children }: ServiceRequestProviderProps) {
  const [requests, setRequests] = useState<ServiceRequest[]>([])

  const addNewServiceRequest = (request: ServiceRequest): ServiceRequest => {
    const newRequest = { ...request, isNew: true }
    setRequests((prev) => [...prev, newRequest])
    return newRequest
  }

  const markRequestAsSeen = (requestId: number) => {
    setRequests((prev) => prev.map((request) => (request.id === requestId ? { ...request, isNew: false } : request)))
  }

  const value: ServiceRequestContextProps = {
    requests,
    addNewServiceRequest,
    markRequestAsSeen,
  }

  return <ServiceRequestContext.Provider value={value}>{children}</ServiceRequestContext.Provider>
}

// Hook to use the service request context
export function useNewServiceRequests(): ServiceRequest[] {
  const context = useContext(ServiceRequestContext)
  if (!context) {
    throw new Error("useNewServiceRequests must be used within a ServiceRequestProvider")
  }
  return context.requests
}

// Global state for new service requests (for backward compatibility)
let newRequests: ServiceRequest[] = []
let listeners: (() => void)[] = []

// Function to add a new service request
export function addNewServiceRequest(request: ServiceRequest) {
  const newRequest = { ...request, isNew: true }
  newRequests = [...newRequests, newRequest]
  // Notify all listeners
  listeners.forEach((listener) => listener())
  return newRequest
}

// Function to mark a request as seen (not new)
export function markRequestAsSeen(requestId: number) {
  newRequests = newRequests.filter((req) => req.id !== requestId)
  // Notify all listeners
  listeners.forEach((listener) => listener())
}

// Component to handle service request notifications
export function ServiceRequestNotification() {
  const pathname = usePathname()
  const { playNotificationSound } = useNotificationSound()
  const { toast } = useToast()
  const [requests, setRequests] = useState<ServiceRequest[]>(newRequests)

  useEffect(() => {
    // Update state when new requests are added
    const updateRequests = () => {
      setRequests([...newRequests])
    }

    // Add listener
    listeners.push(updateRequests)

    // Initial update
    updateRequests()

    // Cleanup
    return () => {
      listeners = listeners.filter((listener) => listener !== updateRequests)
    }
  }, [])

  useEffect(() => {
    // Check if there are any new requests
    if (requests.length > 0) {
      // Play notification sound
      playNotificationSound()

      // Show toast notification if not on service requests page
      if (!pathname.includes("/service-requests")) {
        const latestRequest = requests[requests.length - 1]

        toast({
          title: "New Service Request",
          description: (
            <div className="flex flex-col gap-1">
              <div className="font-medium">{latestRequest.room}</div>
              <div>{latestRequest.service}</div>
              {latestRequest.message && (
                <div className="text-sm text-muted-foreground truncate">{latestRequest.message}</div>
              )}
            </div>
          ),
          action: (
            <a href="/service-requests" className="text-xs text-blue-500 hover:underline">
              View All
            </a>
          ),
        })
      }
    }
  }, [requests, pathname, playNotificationSound, toast])

  return null // This component doesn't render anything
}

// Toast component for service request notifications
export function ServiceRequestToast({
  request,
  onDismiss,
}: {
  request: ServiceRequest
  onDismiss: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg p-4 mb-2 border border-border flex items-start"
    >
      <div className="mr-3 mt-1">
        <Bell className="h-5 w-5 text-blue-500" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-sm">New Service Request</h4>
        <div className="text-sm mt-1">
          <div className="font-medium">{request.room}</div>
          <div>{request.service}</div>
          {request.message && <div className="text-muted-foreground truncate">{request.message}</div>}
        </div>
      </div>
      <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
