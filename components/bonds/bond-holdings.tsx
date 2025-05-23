"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Clock, RefreshCw, AlertCircle } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { getUserBonds, redeemBond } from "@/services/contract-service"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function BondHoldings() {
  const { account, isConnected, signer, chainId, isNetworkSupported } = useWallet()
  const [bonds, setBonds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [redeemingBondId, setRedeemingBondId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [redeemError, setRedeemError] = useState<string | null>(null)
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null)

  // Fetch user's bonds
  const fetchBonds = async () => {
    if (!isConnected || !account || !signer || !chainId || !isNetworkSupported) {
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
      setError(err.message || "Failed to load bonds")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBonds()
  }, [isConnected, account, signer, chainId, isNetworkSupported])

  const handleRedeem = async (bondId: number) => {
    if (!account || !isConnected || !signer || !chainId || !isNetworkSupported) return

    setRedeemingBondId(bondId)
    setRedeemError(null)
    setRedeemSuccess(null)

    try {
      // Redeem the bond
      const result = await redeemBond(bondId, signer, chainId)

      if (result) {
        setRedeemSuccess(`Successfully redeemed bond #${bondId}`)
        // Refresh bonds
        fetchBonds()
      }
    } catch (err: any) {
      console.error("Error redeeming bond:", err)
      setRedeemError(err.message || "Failed to redeem bond")
    } finally {
      setRedeemingBondId(null)
    }
  }

  const getBondStatus = (bond: any) => {
    if (bond.redeemed) {
      return { label: "Redeemed", variant: "outline" as const }
    }

    const now = new Date()
    if (now >= bond.maturity) {
      return { label: "Matured", variant: "success" as const }
    }

    return { label: "Active", variant: "default" as const }
  }

  const formatTimeRemaining = (maturity: Date) => {
    const now = new Date()
    if (now >= maturity) return "Matured"

    const diffMs = maturity.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`
    }

    return `${diffHours}h`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Bonds</CardTitle>
            <CardDescription>View and manage your bond holdings</CardDescription>
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
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">Connect your wallet to view your bonds</p>
          </div>
        ) : !isNetworkSupported ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please switch to a supported network to view your bonds</AlertDescription>
          </Alert>
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

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchBonds} className="mt-2">
                  Retry
                </Button>
              </div>
            ) : bonds.length === 0 ? (
              <div className="text-center py-8 border rounded-md">
                <Clock className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">You don't have any bonds yet</p>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="/bonds/purchase">Purchase a Bond</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bonds.map((bond) => {
                  const status = getBondStatus(bond)
                  const canRedeem = !bond.redeemed && new Date() >= bond.maturity

                  return (
                    <div key={bond.id} className="border rounded-md p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">Bond #{bond.id}</h3>
                            <Badge variant={status.variant} className="ml-2">
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{bond.amount} χ</p>
                        </div>
                        {canRedeem && (
                          <Button
                            size="sm"
                            onClick={() => handleRedeem(bond.id)}
                            disabled={redeemingBondId === bond.id}
                          >
                            {redeemingBondId === bond.id ? (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Redeeming...
                              </>
                            ) : (
                              "Redeem"
                            )}
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Maturity Date:</div>
                        <div>{bond.maturity.toLocaleDateString()}</div>

                        {!bond.redeemed && (
                          <>
                            <div className="text-muted-foreground">Time Remaining:</div>
                            <div>{formatTimeRemaining(bond.maturity)}</div>
                          </>
                        )}

                        {bond.redeemed && (
                          <>
                            <div className="text-muted-foreground">Redeemed:</div>
                            <div>Yes</div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
