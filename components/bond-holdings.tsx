"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/contexts/wallet-provider"
import {
  getUserBonds,
  formatDate,
  getDaysRemaining,
  getTimeElapsedPercentage,
  claimBond,
  participateInRitual,
} from "@/services/bond-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, RefreshCw } from "lucide-react"

export default function BondHoldings() {
  const { account, isConnected } = useWallet()
  const [bonds, setBonds] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Fetch bonds
  const fetchBonds = async () => {
    if (!isConnected || !account) {
      setIsLoading(false)
      return
    }

    try {
      setError(null)
      const userBonds = await getUserBonds(account)
      setBonds(userBonds)
    } catch (err: any) {
      console.error("Error fetching bonds:", err)
      setError(err.message || "Failed to fetch bonds")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Fetch bonds on mount and when account changes
  useEffect(() => {
    fetchBonds()
  }, [account, isConnected])

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchBonds()
  }

  // Handle claim bond
  const handleClaimBond = async (bondId: string) => {
    if (!account) return

    setActionLoading(bondId)
    try {
      await claimBond(account, bondId)
      // Update bond status
      setBonds((prev) => prev.map((bond) => (bond.id === bondId ? { ...bond, status: "claimed" as const } : bond)))
    } catch (err: any) {
      console.error("Error claiming bond:", err)
      setError(err.message || "Failed to claim bond")
    } finally {
      setActionLoading(null)
    }
  }

  // Handle participate in ritual
  const handleParticipateInRitual = async (bondId: string) => {
    if (!account) return

    setActionLoading(bondId)
    try {
      await participateInRitual(account, bondId)
      // Update bond participation
      setBonds((prev) =>
        prev.map((bond) => {
          if (bond.id === bondId && bond.type === "ritual") {
            const currentParticipation = bond.ritualParticipation || 0
            const newParticipation = Math.min(currentParticipation + 10, 100)

            // Update next ritual date (7 days from now)
            const nextRitualDate = new Date()
            nextRitualDate.setDate(nextRitualDate.getDate() + 7)

            return {
              ...bond,
              ritualParticipation: newParticipation,
              nextRitualDate,
            }
          }
          return bond
        }),
      )
    } catch (err: any) {
      console.error("Error participating in ritual:", err)
      setError(err.message || "Failed to participate in ritual")
    } finally {
      setActionLoading(null)
    }
  }

  // Calculate total value
  const totalValue = bonds.reduce((total, bond) => total + bond.value, 0)

  // Get counts
  const activeBonds = bonds.filter((bond) => bond.status === "active").length
  const fixedBonds = bonds.filter((bond) => bond.type === "fixed").length
  const ritualBonds = bonds.filter((bond) => bond.type === "ritual").length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Bond Holdings</CardTitle>
            <CardDescription>Manage your fixed-rate and ritual bonds</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing || !isConnected}>
            {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">Connect your wallet to view your bond holdings</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            <p className="font-medium">Error loading bonds</p>
            <p className="text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : bonds.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <p className="text-muted-foreground">You don't have any bonds yet</p>
            <Button className="mt-2" onClick={() => (window.location.href = "/bonds/purchase")}>
              Purchase Bonds
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-muted p-3">
                <div className="text-sm font-medium text-muted-foreground">Total Value</div>
                <div className="text-2xl font-bold">{totalValue.toFixed(2)} ETH</div>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="text-sm font-medium text-muted-foreground">Active Bonds</div>
                <div className="text-2xl font-bold">{activeBonds}</div>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="text-sm font-medium text-muted-foreground">Fixed Bonds</div>
                <div className="text-2xl font-bold">{fixedBonds}</div>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="text-sm font-medium text-muted-foreground">Ritual Bonds</div>
                <div className="text-2xl font-bold">{ritualBonds}</div>
              </div>
            </div>

            {/* Bond List */}
            <div className="space-y-4">
              {bonds.map((bond) => (
                <div key={bond.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{bond.name}</h3>
                        <Badge variant={bond.type === "fixed" ? "outline" : "secondary"}>
                          {bond.type === "fixed" ? "Fixed Rate" : "Ritual"}
                        </Badge>
                        <Badge
                          variant={
                            bond.status === "active" ? "default" : bond.status === "matured" ? "destructive" : "outline"
                          }
                        >
                          {bond.status === "active"
                            ? "Active"
                            : bond.status === "matured"
                              ? "Ready to Claim"
                              : "Claimed"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">Purchased: {formatDate(bond.purchaseDate)}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{bond.value.toFixed(2)} ETH</div>
                      <p className="text-sm text-muted-foreground">
                        {bond.amount.toFixed(2)} ETH + {bond.interestRate}% interest
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Maturity: {formatDate(bond.maturityDate)}</span>
                      {bond.status === "active" && <span>{getDaysRemaining(bond.maturityDate)} days remaining</span>}
                    </div>

                    {bond.status === "active" && (
                      <Progress
                        value={getTimeElapsedPercentage(bond.purchaseDate, bond.maturityDate)}
                        className="h-2"
                      />
                    )}

                    {bond.type === "ritual" && bond.status === "active" && (
                      <div className="mt-2 rounded-md bg-muted p-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Ritual Participation: {bond.ritualParticipation}%</span>
                          {bond.nextRitualDate && <span>Next Ritual: {formatDate(bond.nextRitualDate)}</span>}
                        </div>
                        <Progress value={bond.ritualParticipation} className="mt-1 h-2" />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {bond.status === "matured" && (
                      <Button onClick={() => handleClaimBond(bond.id)} disabled={actionLoading === bond.id}>
                        {actionLoading === bond.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Claiming...
                          </>
                        ) : (
                          "Claim Bond"
                        )}
                      </Button>
                    )}

                    {bond.type === "ritual" &&
                      bond.status === "active" &&
                      bond.nextRitualDate &&
                      bond.nextRitualDate <= new Date() && (
                        <Button
                          variant="outline"
                          onClick={() => handleParticipateInRitual(bond.id)}
                          disabled={actionLoading === bond.id}
                        >
                          {actionLoading === bond.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Participating...
                            </>
                          ) : (
                            "Participate in Ritual"
                          )}
                        </Button>
                      )}

                    <Button variant="outline" onClick={() => (window.location.href = `/bonds/${bond.id}`)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
