import { format } from "date-fns"

// Types for notifications
export interface Notification {
  id: string
  userId: number
  type: "duty-change" | "system" | "alert" | "duty-reminder"
  title: string
  message: string
  date: Date
  read: boolean
  data?: Record<string, any>
}

// Mock storage for web notifications
const webNotifications: Notification[] = []

// Function to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Function to notify smartwatch via LoRa or Bluetooth
export function notifySmartwatch(userId: number, date: Date, shift: string): void {
  console.log(`[SMARTWATCH] Sending notification to user ${userId}'s smartwatch:`)
  console.log(`📅 New Duty Assigned: ${format(date, "MMM d")}, ${shift} Shift`)
  console.log("Triggering vibration pattern...")

  // In a real implementation, this would trigger a LoRa message or Bluetooth command
  // to the user's smartwatch device
}

// Function to send push notification to mobile app
export function notifyMobileApp(userId: number, date: Date, shift: string): void {
  console.log(`[MOBILE] Sending push notification to user ${userId}'s mobile app:`)
  console.log("Title: Duty Assignment Update")
  console.log("Body: Your shift schedule has been updated.")
  console.log(`Data: { date: "${format(date, "yyyy-MM-dd")}", shift: "${shift}" }`)

  // In a real implementation, this would call a push notification service API
  // like Firebase Cloud Messaging, OneSignal, etc.
}

// Function to store web notification for display in the web app
export function storeWebNotification(userId: number, date: Date, shift: string): Notification {
  const notification: Notification = {
    id: generateId(),
    userId,
    type: "duty-change",
    title: "Duty Assignment",
    message: `You have been assigned to ${shift} Shift on ${format(date, "MMMM d")}.`,
    date: new Date(),
    read: false,
    data: {
      dutyDate: format(date, "yyyy-MM-dd"),
      shift,
    },
  }

  webNotifications.push(notification)
  console.log(`[WEB] Stored web notification for user ${userId}:`, notification.message)

  return notification
}

// Function to get all web notifications for a user
export function getUserNotifications(userId: number): Notification[] {
  return webNotifications.filter((notification) => notification.userId === userId)
}

// Function to mark a notification as read
export function markNotificationAsRead(notificationId: string): void {
  const notification = webNotifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

// Main function to send duty change notification to all channels
export function sendDutyChangeNotification(
  userId: number,
  date: Date,
  shift: string,
  previousShift: string | null,
): void {
  // Only send notification if the assignment is new or updated
  if (previousShift !== shift) {
    // Send to all channels
    notifySmartwatch(userId, date, shift)
    notifyMobileApp(userId, date, shift)
    storeWebNotification(userId, date, shift)

    console.log(
      `[NOTIFICATION] Duty change notification sent to user ${userId} for ${format(date, "MMM d")} ${shift} Shift`,
    )
  }
}

// Function to check if a notification should be sent
export function shouldSendNotification(
  crewId: number,
  date: Date,
  shift: string,
  previousAssignments: Record<string, Array<{ crewId: number; shift: string }>>,
): boolean {
  const dateString = format(date, "yyyy-MM-dd")

  // Check if the crew member was already assigned to this date
  const previousAssignment = previousAssignments[dateString]?.find((a) => a.crewId === crewId)

  // Send notification if:
  // 1. The person was not previously assigned to any shift on this date, or
  // 2. The person was assigned to a different shift on this date
  return !previousAssignment || previousAssignment.shift !== shift
}

// Function to send duty reminder notifications to all crew members on duty for a specific date
export function sendDutyReminderNotifications(
  date: Date,
  crewOnDuty: Array<{ crewId: number; shift: string }>,
  crew: Array<{ id: number; name: string }>,
): { count: number; crewNames: string[] } {
  const notifiedCrewIds: number[] = []
  const notifiedCrewNames: string[] = []

  crewOnDuty.forEach(({ crewId, shift }) => {
    // Send smartwatch notification
    console.log(`[SMARTWATCH] Sending reminder to user ${crewId}'s smartwatch:`)
    console.log(`⏰ Reminder: You are on ${shift} duty today (${format(date, "MMM d")})`)
    console.log("Triggering vibration pattern...")

    // Send mobile app notification
    console.log(`[MOBILE] Sending reminder push notification to user ${crewId}'s mobile app:`)
    console.log("Title: Duty Reminder")
    console.log(`Body: Reminder: You are on ${shift} duty today.`)
    console.log(`Data: { date: "${format(date, "yyyy-MM-dd")}", shift: "${shift}", type: "reminder" }`)

    // Store web notification
    const notification: Notification = {
      id: generateId(),
      userId: crewId,
      type: "duty-reminder",
      title: "Duty Reminder",
      message: `Reminder: You are on ${shift} Shift duty today (${format(date, "MMMM d")}).`,
      date: new Date(),
      read: false,
      data: {
        dutyDate: format(date, "yyyy-MM-dd"),
        shift,
        type: "reminder",
      },
    }

    webNotifications.push(notification)
    console.log(`[WEB] Stored reminder notification for user ${crewId}:`, notification.message)

    // Track notified crew
    notifiedCrewIds.push(crewId)
    const crewMember = crew.find((member) => member.id === crewId)
    if (crewMember) {
      notifiedCrewNames.push(crewMember.name)
    }
  })

  return {
    count: notifiedCrewIds.length,
    crewNames: notifiedCrewNames,
  }
}
