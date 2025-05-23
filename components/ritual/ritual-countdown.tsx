"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { formatTimeRemaining } from "@/hooks/use-ritual"
import type { RitualState } from "@/types/ritual"

interface RitualCountdownProps {
  ritualState: RitualState
}

export function RitualCountdown({ ritualState }: RitualCountdownProps) {
  const [timeDisplay, setTimeDisplay] = useState("00:00:00")
  const [pulseEffect, setPulseEffect] = useState(false)

  useEffect(() => {
    setTimeDisplay(formatTimeRemaining(ritualState.timeRemaining))

    // Add pulse effect when ritual is active or close to starting (within 1 hour)
    setPulseEffect(ritualState.isActive || ritualState.timeRemaining < 3600000)
  }, [ritualState])

  return (
    <Card className={`border-2 ${ritualState.isActive ? "border-amber-500 bg-amber-50/10" : "border-muted"}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-2">
          <h3 className="text-lg font-medium">
            {ritualState.isActive
              ? "Ritual Active Now!"
              : `Next ${ritualState.nextPhase === "dawn" ? "Dawn" : "Dusk"} Ritual`}
          </h3>

          <div
            className={`text-3xl font-bold font-mono tabular-nums ${pulseEffect ? "animate-pulse text-amber-600" : ""}`}
          >
            {timeDisplay}
          </div>

          <p className="text-sm text-muted-foreground">
            {ritualState.isActive
              ? "Participate now to increase your returns"
              : `${ritualState.nextPhase === "dawn" ? "Dawn" : "Dusk"} ritual begins in ${timeDisplay}`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
