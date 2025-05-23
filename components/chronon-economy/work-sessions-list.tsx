"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import Link from "next/link"
import type { WorkSession } from "@/types/chronon-economy"

interface WorkSessionsListProps {
  workSessions: WorkSession[]
}

export function WorkSessionsList({ workSessions }: WorkSessionsListProps) {
  const [sortBy, setSortBy] = useState<"date" | "chronons">("date")

  const sortedSessions = [...workSessions].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else {
      return b.chrononsEarned - a.chrononsEarned
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Work Sessions</CardTitle>
            <CardDescription>Your work sessions and earned χ-tokens</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={sortBy === "date" ? "default" : "outline"} size="sm" onClick={() => setSortBy("date")}>
              Sort by Date
            </Button>
            <Button
              variant={sortBy === "chronons" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("chronons")}
            >
              Sort by χ
            </Button>
            <Button asChild>
              <Link href="/economy/work-sessions/create">New Session</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {workSessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No work sessions found</p>
            <Button className="mt-4" asChild>
              <Link href="/economy/work-sessions/create">Create Your First Session</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedSessions.map((session) => (
              <div key={session.id} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">{session.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {session.duration} hours
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <Badge variant={session.completed ? "default" : "outline"}>
                        {session.completed ? "Completed" : "Pending"}
                      </Badge>
                      <span className="text-lg font-bold text-green-600">+{session.chrononsEarned} χ</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{session.ethCost} ETH</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Total Earned:{" "}
          <span className="font-bold">{workSessions.reduce((sum, s) => sum + s.chrononsEarned, 0)} χ</span>
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/economy/work-sessions/history">View Full History</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
