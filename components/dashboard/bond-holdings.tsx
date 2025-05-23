"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { getUserBonds, redeemBond } from "@/services/contract-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

// Bond type definition
type Bond = {
  id: number
  owner: string
  amount: string
  maturity: Date
  redeemed: boolean
}

export function BondHoldings() {
  const { account, isConnected, signer, chainId, isNetworkSupported } = useWallet()
  const [bonds, setBonds] = useState<Bond[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [redeemingBondId, setRedeemingBondId] = useState<number | null>(null)
  const [redeemError, setRedeemError] = useState<string | null>(null)
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null)

  const fetchBonds = async () => {
    if (!account || !isConnected || !signer || !chainId || !isNetworkSupported) {
      setBonds([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const userBonds = await getUserBonds(account, signer, chainId)
      setBonds(userBonds)
    } catch (err: any) {
      console.error("Error fetching bonds:", err)
      setError(err.message || "Failed to load bond holdings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBonds()
  }, [account, isConnected, signer, chainId, isNetworkSupported])

  // Handle bond redemption
  const handleRedeem = async (bondId: number) => {
    if (!account || !isConnected || !signer || !chainId || !isNetworkSupported) return

    setRedeemingBondId(bondId)
    setRedeemError(null)
    setRedeemSuccess(null)

    try {
      const success = await redeemBond(bondId, signer, chainId)
      if (success) {
        setRedeemSuccess(`Successfully redeemed bond #${bondId}`)
        // Refresh bonds
        fetchBonds()
      } else {
        throw new Error("Failed to redeem bond")
      }
    } catch (err: any) {
      console.error("Error redeeming bond:", err)
      setRedeemError(err.message || "Failed to redeem bond")
    } finally {
      setRedeemingBondId(null)
    }
  }

  // Calculate days remaining until maturity
  const getDaysRemaining = (maturityDate: Date) => {
    const now = new Date()
    const diffTime = maturityDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  // Calculate percentage of time elapsed
  const getTimeElapsedPercentage = (maturityDate: Date) => {
    const now = new Date()
    const purchaseDate = new Date(maturityDate.getTime() - 30 * 24 * 60 * 60 * 1000) // Assuming 30-day bonds for now
    const totalTime = maturityDate.getTime() - purchaseDate.getTime()
    const elapsedTime = now.getTime() - purchaseDate.getTime()

    return Math.min(Math.max((elapsedTime / totalTime) * 100, 0), 100)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Bond Holdings</CardTitle>
            <CardDescription>Your active bonds and their status</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchBonds}
            disabled={loading || !isConnected || !isNetworkSupported}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Connect your wallet to view your bonds</div>
        ) : !isNetworkSupported ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please switch to a supported network to view your bonds</AlertDescription>
          </Alert>
        ) : loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button variant="outline" size="sm" onClick={fetchBonds} className="mt-4 mx-auto block">
              Retry
            </Button>
          </div>
        ) : bonds.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">No bonds found</div>
        ) : (
          <div className="space-y-4">
            {/* Redeem Status Messages */}
            {redeemError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{redeemError}</AlertDescription>
              </Alert>
            )}

            {redeemSuccess && (
              <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{redeemSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="rounded-lg bg-muted p-3">
              <div className="text-sm font-medium text-muted-foreground">Total Value</div>
              <div className="text-2xl font-bold">
                {bonds.reduce((total, bond) => total + Number(bond.amount), 0).toFixed(2)} CHRN
              </div>
            </div>

            <div className="space-y-4">
              {bonds.map((bond) => {
                const daysRemaining = getDaysRemaining(bond.maturity)
                const isMatured = new Date() >= bond.maturity
                const canRedeem = isMatured && !bond.redeemed

                return (
                  <div key={bond.id} className="space-y-2 rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Bond #{bond.id}</div>
                      <Badge variant={bond.redeemed ? "outline" : isMatured ? "success" : "default"}>
                        {bond.redeemed ? "Redeemed" : isMatured ? "Matured" : "Active"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div>Amount: {Number.parseFloat(bond.amount).toFixed(2)} CHRN</div>
                      <div>Maturity: {bond.maturity.toLocaleDateString()}</div>
                    </div>

                    {!bond.redeemed && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Progress</span>
                          <span>{isMatured ? "Matured" : `${daysRemaining} days remaining`}</span>
                        </div>
                        <Progress value={getTimeElapsedPercentage(bond.maturity)} className="h-2" />
                      </div>
                    )}

                    {canRedeem && (
                      <Button
                        size="sm"
                        onClick={() => handleRedeem(bond.id)}
                        disabled={redeemingBondId === bond.id}
                        className="w-full mt-2"
                      >
                        {redeemingBondId === bond.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Redeeming...
                          </>
                        ) : (
                          "Redeem Bond"
                        )}
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
