"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import type { RitualEvent } from "@/types/ritual"
import { formatDate } from "@/lib/bond-utils"

interface RitualHistoryProps {
  ritualEvents: RitualEvent[]
}

export function RitualHistory({ ritualEvents }: RitualHistoryProps) {
  // Sort events by date, most recent first
  const sortedEvents = [...ritualEvents].sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ritual History</CardTitle>
        <CardDescription>Your past ritual participation records</CardDescription>
      </CardHeader>

      <CardContent>
        {sortedEvents.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">No ritual history yet</p>
        ) : (
          <div className="space-y-4">
            {sortedEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-3">
                  {event.participated ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}

                  <div>
                    <p className="font-medium">{event.phase === "dawn" ? "Dawn" : "Dusk"} Ritual</p>
                    <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge variant={event.participated ? "default" : "outline"}>
                    {event.participated ? "Participated" : "Missed"}
                  </Badge>

                  {event.participated && (
                    <span className="text-sm font-medium">+{event.bonusEarned.toFixed(6)} ETH</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
