"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

// Mock data for recent activity
const MOCK_ACTIVITIES = [
  {
    id: "1",
    type: "bond_created",
    user: "0x1a2b...3c4d",
    amount: "1,000 CHRN",
    time: "2 minutes ago",
    status: "success",
  },
  {
    id: "2",
    type: "bond_matured",
    user: "0x5e6f...7g8h",
    amount: "2,500 CHRN",
    time: "15 minutes ago",
    status: "success",
  },
  {
    id: "3",
    type: "ritual_performed",
    user: "0x9i0j...1k2l",
    amount: "500 CHRN",
    time: "1 hour ago",
    status: "success",
  },
  {
    id: "4",
    type: "bond_claimed",
    user: "0x3m4n...5o6p",
    amount: "3,200 CHRN",
    time: "3 hours ago",
    status: "success",
  },
  {
    id: "5",
    type: "transaction_failed",
    user: "0x7q8r...9s0t",
    amount: "750 CHRN",
    time: "5 hours ago",
    status: "failed",
  },
]

export function RecentActivity() {
  const [activities, setActivities] = useState<typeof MOCK_ACTIVITIES>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setActivities(MOCK_ACTIVITIES)
      setIsLoading(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  // Helper function to get activity type label
  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case "bond_created":
        return "Bond Created"
      case "bond_matured":
        return "Bond Matured"
      case "ritual_performed":
        return "Ritual Performed"
      case "bond_claimed":
        return "Bond Claimed"
      case "transaction_failed":
        return "Transaction Failed"
      default:
        return type.replace("_", " ")
    }
  }

  // Helper function to get avatar fallback
  const getAvatarFallback = (user: string) => {
    return user.substring(2, 4).toUpperCase()
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest platform activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getAvatarFallback(activity.user)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.user}</p>
                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground">
                    {getActivityTypeLabel(activity.type)} • {activity.amount}
                  </p>
                  <Badge variant={activity.status === "success" ? "default" : "destructive"} className="ml-2">
                    {activity.status}
                  </Badge>
                </div>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
