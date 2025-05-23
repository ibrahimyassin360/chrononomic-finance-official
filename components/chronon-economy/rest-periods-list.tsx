"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Loader2, AlertCircle } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { redeemForRest } from "@/services/chronon-economy-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { REST_PERIODS } from "@/types/chronon-economy"

export function RestPeriodsList() {
  const { account } = useWallet()
  const [redeemingId, setRedeemingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleRedeem = async (restPeriodId: string) => {
    if (!account) return

    setRedeemingId(restPeriodId)
    setError(null)
    setSuccess(null)

    try {
      const result = await redeemForRest(account, restPeriodId)
      if (result.success) {
        const restPeriod = REST_PERIODS.find((r) => r.id === restPeriodId)
        setSuccess(`Successfully redeemed ${result.chrononsSpent} χ for ${restPeriod?.description}`)
      }
    } catch (err: any) {
      console.error("Error redeeming for rest:", err)
      setError(err.message || "Failed to redeem for rest period")
    } finally {
      setRedeemingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {REST_PERIODS.map((restPeriod) => (
          <Card key={restPeriod.id} className="overflow-hidden">
            <div className="bg-primary/10 p-4">
              <h3 className="font-medium">{restPeriod.description.split(" - ")[0]}</h3>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{restPeriod.duration} days</span>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm mb-4">{restPeriod.description.split(" - ")[1]}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-lg">
                  {restPeriod.chrononsRequired} χ
                </Badge>
                <Button onClick={() => handleRedeem(restPeriod.id)} disabled={redeemingId === restPeriod.id}>
                  {redeemingId === restPeriod.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redeeming...
                    </>
                  ) : (
                    "Redeem"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
