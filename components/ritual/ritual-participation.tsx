"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import type { RitualBond } from "@/types/ritual"
import { useRitual } from "@/hooks/use-ritual"
import { RitualCountdown } from "./ritual-countdown"
import { formatDate } from "@/lib/bond-utils"

interface RitualParticipationProps {
  bond: RitualBond
  onParticipationComplete?: () => void
}

export function RitualParticipation({ bond, onParticipationComplete }: RitualParticipationProps) {
  const { ritualState, loading, error, participationResult, participateInCurrentRitual, resetResult } = useRitual(bond)

  const handleParticipate = async () => {
    await participateInCurrentRitual()
    if (onParticipationComplete) {
      onParticipationComplete()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ritual Participation</CardTitle>
        <CardDescription>
          Participate in {bond.name.includes("Dawn") ? "dawn" : "dusk"} rituals to maximize your returns
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Ritual Countdown */}
        <RitualCountdown ritualState={ritualState} />

        {/* Participation Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Ritual Participation Rate</span>
            <span className="font-medium">{bond.ritualParticipation}%</span>
          </div>
          <Progress value={bond.ritualParticipation} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {bond.ritualParticipation < 100
              ? `Participate in ${Math.ceil((100 - bond.ritualParticipation) / 10)} more rituals for maximum returns`
              : "You've achieved maximum ritual participation!"}
          </p>
        </div>

        {/* Bonus Information */}
        <div className="rounded-md bg-muted p-4">
          <h4 className="font-medium mb-2">Ritual Bonus Details</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Base Interest Rate:</div>
            <div className="text-right">{bond.baseInterestRate}%</div>

            <div>Maximum Bonus Rate:</div>
            <div className="text-right">{bond.bonusRate}%</div>

            <div>Current Effective Rate:</div>
            <div className="text-right font-medium">
              {(bond.baseInterestRate + (bond.bonusRate * bond.ritualParticipation) / 100).toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Next Ritual Information */}
        {!ritualState.isActive && (
          <div className="text-sm text-muted-foreground">
            <p>Next ritual scheduled for {formatDate(bond.nextRitualDate)}</p>
            <p className="mt-1">Each participation increases your ritual rate by 10%</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {participationResult && participationResult.success && (
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Ritual Participation Successful</AlertTitle>
            <AlertDescription>
              <p>Your participation rate is now {participationResult.newParticipationRate}%</p>
              <p>You earned a bonus of {participationResult.bonusEarned.toFixed(6)} ETH</p>
              <p>Next ritual: {formatDate(participationResult.nextRitualDate)}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter>
        {participationResult && participationResult.success ? (
          <Button onClick={resetResult} className="w-full">
            Continue
          </Button>
        ) : (
          <Button onClick={handleParticipate} disabled={loading || !ritualState.canParticipate} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Participating...
              </>
            ) : ritualState.isActive ? (
              "Participate in Ritual"
            ) : (
              "Waiting for Next Ritual"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
