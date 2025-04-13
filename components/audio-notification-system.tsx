"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

// Define the available notification sounds
export const NOTIFICATION_SOUNDS = [
  { id: "chime", name: "Chime", path: "/sounds/chime.mp3" },
  { id: "bell", name: "Bell", path: "/sounds/bell.mp3" },
  { id: "soft-alert", name: "Soft Alert", path: "/sounds/soft-alert.mp3" },
  { id: "urgent", name: "Urgent", path: "/sounds/urgent.mp3" },
]

// Define the notification settings interface
export interface NotificationSettings {
  enabled: boolean
  sound: string
  volume: number
  muted: boolean
  glowAnimation: boolean
  pulseEffect: boolean
  sidebarBadge: boolean
  escalationEnabled: boolean
  escalationDelay: number
}

// Default notification settings
const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  sound: "chime",
  volume: 0.5,
  muted: false,
  glowAnimation: true,
  pulseEffect: true,
  sidebarBadge: true,
  escalationEnabled: true,
  escalationDelay: 60,
}

// Create a context for notification settings
interface NotificationContextProps {
  settings: NotificationSettings
  updateSettings: (settings: Partial<NotificationSettings>) => void
  playNotificationSound: () => void
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined)

// Notification Provider Component
interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [settings, setSettings] = useLocalStorage<NotificationSettings>("notification-settings", DEFAULT_SETTINGS)
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement | null>>({})
  const [soundsLoaded, setSoundsLoaded] = useState<Record<string, boolean>>({})

  // Initialize audio elements
  useEffect(() => {
    const elements: Record<string, HTMLAudioElement> = {}
    const loaded: Record<string, boolean> = {}

    NOTIFICATION_SOUNDS.forEach((sound) => {
      const audio = new Audio(sound.path)
      audio.preload = "auto"
      audio.volume = settings.volume

      // Track when sounds are loaded
      audio.addEventListener("canplaythrough", () => {
        loaded[sound.id] = true
        setSoundsLoaded((prev) => ({ ...prev, [sound.id]: true }))
        console.log(`Sound loaded: ${sound.id}`)
      })

      // Handle loading errors
      audio.addEventListener("error", (e) => {
        console.error(`Failed to load sound: ${sound.path}`, e)
        loaded[sound.id] = false
        setSoundsLoaded((prev) => ({ ...prev, [sound.id]: false }))
      })

      elements[sound.id] = audio
    })

    setAudioElements(elements)

    // Cleanup
    return () => {
      Object.values(elements).forEach((audio) => {
        if (audio) {
          audio.pause()
          audio.src = ""
        }
      })
    }
  }, [])

  // Update audio volume when settings change
  useEffect(() => {
    Object.values(audioElements).forEach((audio) => {
      if (audio) {
        audio.volume = settings.volume
      }
    })
  }, [settings.volume, audioElements])

  // Function to update settings
  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  // Function to play notification sound
  const playNotificationSound = () => {
    if (!settings.enabled || settings.muted) return

    const soundId = settings.sound
    const audio = audioElements[soundId]

    if (audio && soundsLoaded[soundId]) {
      try {
        // Reset the audio to the beginning
        audio.currentTime = 0
        audio.play().catch((error) => {
          console.error("Error playing notification sound:", error)

          // Try to play a fallback sound
          const fallbackSoundId = Object.keys(soundsLoaded).find((id) => soundsLoaded[id])
          if (fallbackSoundId && fallbackSoundId !== soundId) {
            const fallbackAudio = audioElements[fallbackSoundId]
            if (fallbackAudio) {
              fallbackAudio.currentTime = 0
              fallbackAudio.play().catch((e) => console.error("Error playing fallback sound:", e))
            }
          }
        })
      } catch (error) {
        console.error("Error playing notification sound:", error)
      }
    } else {
      console.warn(`Sound not loaded or not found: ${soundId}`)

      // Try to play any available sound
      const availableSoundId = Object.keys(soundsLoaded).find((id) => soundsLoaded[id])
      if (availableSoundId) {
        const availableAudio = audioElements[availableSoundId]
        if (availableAudio) {
          availableAudio.currentTime = 0
          availableAudio.play().catch((e) => console.error("Error playing available sound:", e))
        }
      }
    }
  }

  const value: NotificationContextProps = {
    settings,
    updateSettings,
    playNotificationSound,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

// Hook to use the notification context
export function useNotificationSettings() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotificationSettings must be used within a NotificationProvider")
  }
  return context
}

// Hook to use just the notification sound functionality
export function useNotificationSound() {
  const { playNotificationSound } = useNotificationSettings()
  return { playNotificationSound }
}
