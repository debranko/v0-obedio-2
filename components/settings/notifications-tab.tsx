"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { FormSection } from "@/components/ui-patterns/form-section"
import { FormField } from "@/components/ui-patterns/form-field"

export default function NotificationsTab() {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
  })

  const handleSettingsChange = (setting: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: value,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive notifications for service requests.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormSection title="Notification Preferences">
            <FormField label="Email Notifications" description="Receive notifications via email.">
              <Switch
                id="email-notifications"
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => handleSettingsChange("emailNotifications", checked)}
              />
            </FormField>

            <FormField label="Push Notifications" description="Receive push notifications on your mobile device.">
              <Switch
                id="push-notifications"
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked) => handleSettingsChange("pushNotifications", checked)}
              />
            </FormField>

            <FormField label="SMS Notifications" description="Receive notifications via SMS.">
              <Switch
                id="sms-notifications"
                checked={notificationSettings.smsNotifications}
                onCheckedChange={(checked) => handleSettingsChange("smsNotifications", checked)}
              />
            </FormField>
          </FormSection>
        </CardContent>
      </Card>
    </div>
  )
}
\
"
