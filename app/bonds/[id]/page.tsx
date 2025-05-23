"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { formatDate, getDaysRemaining, getTimeElapsedPercentage } from "@/lib/bond-utils"
import type { RitualBond } from "@/types/ritual"
import { RitualParticipation } from "@/components/ritual/ritual-participation"
import { RitualHistory } from "@/components/ritual/ritual-history"
import { RitualVisualization } from "@/components/ritual/ritual-visualization"
import { useRitual } from "@/hooks/use-ritual"

export default function BondDetailPage() {
  const params = useParams()
  const { account } = useWallet()
  const [bond, setBond] = useState<RitualBond | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get the bond ID from the URL
  const bondId = params.id as string

  // Get ritual state
  const { ritualState } = useRitual(bond || undefined)

  // Fetch bond details
  useEffect(() => {
    const fetchBond = async () => {
      if (!account) return

      setLoading(true)
      setError(null)

      try {
        // In a real implementation, this would fetch from an API or blockchain
        // For now, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock ritual bond data
        const mockBond: RitualBond = {
          id: bondId,
          name: "Dawn Ritual Bond",
          amount: 1.5,
          value: 1.65,
          interestRate: 10,
          baseInterestRate: 8,
          bonusRate: 3,
          maturityDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          purchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          status: "active",
          ritualParticipation: 60,
          nextRitualDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          ritualFrequency: 7, // Weekly rituals
          ritualHistory: [
            {
              id: "ritual-1",
              bondId: bondId,
              date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
              participated: true,
              bonusEarned: 0.004,
              phase: "dawn",
              status: "completed",
            },
            {
              id: "ritual-2",
              bondId: bondId,
              date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
              participated: true,
              bonusEarned: 0.004,
              phase: "dawn",
              status: "completed",
            },
            {
              id: "ritual-3",
              bondId: bondId,
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              participated: false,
              bonusEarned: 0,
              phase: "dawn",
              status: "missed",
            },
            {
              id: "ritual-4",
              bondId: bondId,
              date: new Date(Date.now()),
              participated: true,
              bonusEarned: 0.004,
              phase: "dawn",
              status: "completed",
            },
            {
              id: "ritual-5",
              bondId: bondId,
              date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              participated: false,
              bonusEarned: 0,
              phase: "dawn",
              status: "upcoming",
            },
          ],
        }

        setBond(mockBond)
      } catch (err: any) {
        console.error("Error fetching bond:", err)
        setError(err.message || "Failed to load bond details")
      } finally {
        setLoading(false)
      }
    }

    fetchBond()
  }, [account, bondId])

  // Handle refresh after participation
  const handleParticipationComplete = () => {
    // In a real implementation, this would refetch the bond data
    if (bond) {
      setBond({
        ...bond,
        ritualParticipation: Math.min(bond.ritualParticipation + 10, 100),
        nextRitualDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !bond) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-lg text-muted-foreground">{error || "Bond not found"}</p>
        <Button asChild>
          <a href="/bonds">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bonds
          </a>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{bond.name}</h1>
          <p className="text-muted-foreground">Bond ID: {bond.id}</p>
        </div>

        <Button variant="outline" asChild>
          <a href="/bonds">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bonds
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bond Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Bond Summary</CardTitle>
            <CardDescription>Overview of your ritual bond</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Principal Amount</p>
                <p className="text-lg font-medium">{bond.amount.toFixed(2)} ETH</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-lg font-medium">{bond.value.toFixed(2)} ETH</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Base Interest Rate</p>
                <p className="text-lg font-medium">{bond.baseInterestRate}%</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Maximum Bonus</p>
                <p className="text-lg font-medium">+{bond.bonusRate}%</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Purchase Date</p>
                <p className="text-lg font-medium">{formatDate(bond.purchaseDate)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Maturity Date</p>
                <p className="text-lg font-medium">{formatDate(bond.maturityDate)}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Time to Maturity</span>
                <span className="text-sm font-medium">{getDaysRemaining(bond.maturityDate)} days remaining</span>
              </div>

              <Progress value={getTimeElapsedPercentage(bond.purchaseDate, bond.maturityDate)} className="h-2" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Badge variant={bond.status === "active" ? "default" : "outline"}>
                  {bond.status === "active" ? "Active" : bond.status === "matured" ? "Matured" : "Claimed"}
                </Badge>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">Effective Interest Rate</p>
                <p className="text-lg font-medium">
                  {(bond.baseInterestRate + (bond.bonusRate * bond.ritualParticipation) / 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ritual Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Ritual Visualization</CardTitle>
            <CardDescription>{bond.name.includes("Dawn") ? "Dawn" : "Dusk"} ritual visualization</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <RitualVisualization
              ritualState={ritualState}
              phase={bond.name.toLowerCase().includes("dawn") ? "dawn" : "dusk"}
            />

            <div className="text-center">
              <p className="text-sm font-medium">
                {ritualState.isActive ? "Ritual is active now!" : `Next ritual in ${formatDate(bond.nextRitualDate)}`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="participate" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="participate">Participate</TabsTrigger>
          <TabsTrigger value="history">Ritual History</TabsTrigger>
        </TabsList>

        <TabsContent value="participate" className="mt-6">
          <RitualParticipation bond={bond} onParticipationComplete={handleParticipationComplete} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <RitualHistory ritualEvents={bond.ritualHistory} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
