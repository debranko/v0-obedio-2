"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserCog, Smartphone, MapPin, Clock, Calendar, Shield } from "lucide-react"

interface UserExpandableRowProps {
  user: any
  onEditPermissions: () => void
}

export function UserExpandableRow({ user, onEditPermissions }: UserExpandableRowProps) {
  const getPermissionSummary = (permissions: any) => {
    const sections = Object.keys(permissions)
    const accessLevels = sections.map((section) => {
      const { view, modify, assign } = permissions[section]
      if (view && modify && assign) return "full access"
      if (view && modify) return "can modify"
      if (view) return "view only"
      return "no access"
    })

    const fullAccessCount = accessLevels.filter((level) => level === "full access").length
    const modifyCount = accessLevels.filter((level) => level === "can modify").length
    const viewOnlyCount = accessLevels.filter((level) => level === "view only").length

    return `${fullAccessCount} full, ${modifyCount} modify, ${viewOnlyCount} view-only`
  }

  return (
    <Card className="m-2 bg-muted/10 border-dashed">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assigned Devices & Location */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="h-4 w-4" /> Assigned Devices
            </h4>
            {user.devices.length > 0 ? (
              <div className="space-y-2">
                {user.devices.map((device: string, index: number) => (
                  <Badge key={index} variant="outline" className="mr-2">
                    {device}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No devices assigned</p>
            )}

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Location: {user.location || "Not assigned"}</span>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" /> Account Information
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Added: {user.dateAdded}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Last login: {user.lastLogin}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>Permissions: {getPermissionSummary(user.permissions)}</span>
              </div>
            </div>
          </div>

          {/* Current Sessions */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" /> Current Sessions
            </h4>

            {user.sessions.length > 0 ? (
              <div className="space-y-2 text-sm">
                {user.sessions.map((session: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{session.device}</span>
                      <div className="text-xs text-muted-foreground">
                        {session.ip} • {session.time}
                      </div>
                    </div>
                    {session.time === "Current session" && (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active sessions</p>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Permission Summary:</span> {user.role} role with{" "}
            {Object.values(user.permissions).filter((p: any) => p.view).length} accessible sections
          </div>
          <Button size="sm" onClick={onEditPermissions}>
            <UserCog className="h-4 w-4 mr-2" />
            Edit Permissions
          </Button>
        </div>
      </div>
    </Card>
  )
}
