import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Clock, Play, RefreshCw, UserPlus } from "lucide-react"
import { SystemStatusPanel } from "@/components/dashboard/system-status-panel"

// Mock data for active requests
const activeRequests = [
  {
    id: 1,
    room: "Master Cabin",
    service: "Call for Stewardess",
    message: "Could I get some fresh towels please?",
    hasVoice: true,
    timeAgo: "3 min ago",
  },
  {
    id: 2,
    room: "Salon",
    service: "Beverage Request",
    message: "Would like to order champagne for 4 people",
    hasVoice: true,
    timeAgo: "7 min ago",
  },
  {
    id: 3,
    room: "Guest Cabin 2",
    service: "Call for Butler",
    message: null,
    hasVoice: true,
    timeAgo: "12 min ago",
    unclear: true,
  },
]

// Mock data for request history
const requestHistory = [
  {
    id: 101,
    room: "Dining Room",
    service: "Table Service",
    crew: "James Miller",
    timestamp: "Today, 10:23 AM",
  },
  {
    id: 102,
    room: "Sun Deck",
    service: "Beverage Request",
    crew: "Emma Wilson",
    timestamp: "Today, 9:45 AM",
  },
  {
    id: 103,
    room: "Master Cabin",
    service: "Room Service",
    crew: "James Miller",
    timestamp: "Yesterday, 8:15 PM",
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Active Requests Section */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Active Requests</h2>

          {activeRequests.map((request) => (
            <Card key={request.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{request.room}</CardTitle>
                    <CardDescription>{request.service}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-muted-foreground">
                    {request.timeAgo}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {request.message ? (
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    "{request.message}"
                    {request.hasVoice && (
                      <Button variant="ghost" size="icon" className="ml-2 h-6 w-6">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : request.unclear ? (
                  <div className="space-y-2">
                    <div className="bg-muted p-3 rounded-lg text-sm">
                      Incoming Message
                      {request.hasVoice && (
                        <Button variant="ghost" size="icon" className="ml-2 h-6 w-6">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Didn't Understand – On The Way
                    </Button>
                  </div>
                ) : null}

                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    <Check className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Give to Next On Duty
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign Task To...
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="pt-4">
            <h3 className="text-lg font-medium mb-4">Request History</h3>
            <div className="space-y-2">
              {requestHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-background border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="font-medium">{item.room}</div>
                    <div className="text-sm text-muted-foreground">{item.service}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm">{item.crew}</div>
                    <div className="text-xs text-muted-foreground">
                      <Clock className="inline mr-1 h-3 w-3" />
                      {item.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">System Status</h2>
          <SystemStatusPanel />
        </div>
      </div>
    </div>
  )
}
