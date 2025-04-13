import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AnimationProvider } from "@/components/animation-provider"
import { NotificationProvider } from "@/components/audio-notification-system"
import { ServiceRequestProvider, ServiceRequestNotification } from "@/components/service-request-notification"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Obedio Admin",
  description: "Luxury management system",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AnimationProvider>
            <NotificationProvider>
              <ServiceRequestProvider>
                <div className="flex min-h-screen">
                  <Sidebar />
                  <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 p-6">{children}</main>
                  </div>
                </div>
                <ServiceRequestNotification />
                <Toaster />
              </ServiceRequestProvider>
            </NotificationProvider>
          </AnimationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'