"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, AlertCircle, Loader2 } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { redeemBond } from "@/services/chronon-economy-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import type { ChrononomicBond } from "@/types/chronon-economy"

interface BondsListProps {
  bonds: ChrononomicBond[]
}

export function BondsList({ bonds }: BondsListProps) {
  const { account } = useWallet()
  const [redeemingBondId, setRedeemingBondId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const sortedBonds = [...bonds].sort((a, b) => {
    // Sort by redeemable first, then by maturity date
    if (a.isRedeemable && !a.isRedeemed && (!b.isRedeemable || b.isRedeemed)) return -1
    if (b.isRedeemable && !b.isRedeemed && (!a.isRedeemable || a.isRedeemed)) return 1
    return new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime()
  })

  const handleRedeem = async (bondId: string) => {
    if (!account) return

    setRedeemingBondId(bondId)
    setError(null)
    setSuccess(null)

    try {
      const result = await redeemBond(account, bondId)
      if (result.success) {
        setSuccess(`Successfully redeemed bond for ${result.chrononsEarned} χ`)
      }
    } catch (err: any) {
      console.error("Error redeeming bond:", err)
      setError(err.message || "Failed to redeem bond")
    } finally {
      setRedeemingBondId(null)
    }
  }

  const getBondStatus = (bond: ChrononomicBond) => {
    if (bond.isRedeemed) {
      return { label: "Redeemed", variant: "outline" as const }
    }

    const now = new Date()
    if (now >= bond.maturityDate) {
      return { label: "Matured", variant: "success" as const }
    }

    return { label: "Active", variant: "default" as const }
  }

  const formatTimeRemaining = (maturityDate: Date) => {
    const now = new Date()
    if (now >= maturityDate) return "Matured"

    const diffMs = maturityDate.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`
    }

    return `${diffHours}h`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Chrononomic Bonds</CardTitle>
            <CardDescription>Your bond holdings and redemption status</CardDescription>
          </div>
          <Button asChild>
            <Link href="/economy/bonds/issue">Issue Bond</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {bonds.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No bonds found</p>
            <Button className="mt-4" asChild>
              <Link href="/economy/bonds/issue">Issue Your First Bond</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedBonds.map((bond) => {
              const status = getBondStatus(bond)
              const canRedeem = bond.isRedeemable && !bond.isRedeemed

              return (
                <div key={bond.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{bond.projectName}</h3>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{bond.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          Issued: {new Date(bond.issueDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          Matures: {new Date(bond.maturityDate).toLocaleDateString()}
                        </div>
                      </div>
                      {!bond.isRedeemed && (
                        <p className="text-sm mt-1">
                          Time remaining: <span className="font-medium">{formatTimeRemaining(bond.maturityDate)}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-bold">{bond.denomination} χ</span>
                      {canRedeem && (
                        <Button
                          className="mt-2"
                          onClick={() => handleRedeem(bond.id)}
                          disabled={redeemingBondId === bond.id}
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
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Total Bond Value: <span className="font-bold">{bonds.reduce((sum, b) => sum + b.denomination, 0)} χ</span>
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/economy/bonds/history">View Full History</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
