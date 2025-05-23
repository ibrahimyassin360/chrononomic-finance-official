"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, RefreshCw, Clock, Sparkles, AlertCircle, CheckCircle, Info } from "lucide-react"

// Mock data types
type BondType = "fixed" | "ritual"

interface Bond {
  id: string
  name: string
  type: BondType
  amount: number
  value: number
  interestRate: number
  maturityDate: Date
  purchaseDate: Date
  status: "active" | "matured" | "claimed"
  nextRitualDate?: Date
  ritualParticipation?: number
}

interface BondProduct {
  id: string
  name: string
  type: BondType
  minAmount: number
  interestRate: number
  term: number // in days
  description: string
  ritualFrequency?: number
  ritualBonus?: number
}

// Mock data
const mockBonds: Bond[] = [
  {
    id: "bond-1",
    name: "Short-Term Fixed Bond",
    type: "fixed",
    amount: 0.5,
    value: 0.525,
    interestRate: 5,
    maturityDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    purchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "bond-2",
    name: "Dawn Ritual Bond",
    type: "ritual",
    amount: 1,
    value: 1.08,
    interestRate: 8,
    maturityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: "active",
    nextRitualDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    ritualParticipation: 85,
  },
  {
    id: "bond-3",
    name: "Medium-Term Fixed Bond",
    type: "fixed",
    amount: 2,
    value: 2.15,
    interestRate: 7.5,
    maturityDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    purchaseDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    status: "matured",
  },
]

const mockBondProducts: BondProduct[] = [
  {
    id: "fixed-short",
    name: "Short-Term Fixed Bond",
    type: "fixed",
    minAmount: 0.1,
    interestRate: 5,
    term: 30,
    description: "A short-term fixed-rate bond with a 30-day maturity period.",
  },
  {
    id: "fixed-medium",
    name: "Medium-Term Fixed Bond",
    type: "fixed",
    minAmount: 0.5,
    interestRate: 7.5,
    term: 90,
    description: "A medium-term fixed-rate bond with a 90-day maturity period.",
  },
  {
    id: "fixed-long",
    name: "Long-Term Fixed Bond",
    type: "fixed",
    minAmount: 1,
    interestRate: 10,
    term: 180,
    description: "A long-term fixed-rate bond with a 180-day maturity period.",
  },
  {
    id: "ritual-dawn",
    name: "Dawn Ritual Bond",
    type: "ritual",
    minAmount: 0.2,
    interestRate: 8,
    term: 60,
    description: "A ritual bond that requires participation in dawn rituals for maximum returns.",
    ritualFrequency: 7,
    ritualBonus: 3,
  },
  {
    id: "ritual-dusk",
    name: "Dusk Ritual Bond",
    type: "ritual",
    minAmount: 0.5,
    interestRate: 12,
    term: 120,
    description: "A ritual bond that requires participation in dusk rituals for maximum returns.",
    ritualFrequency: 14,
    ritualBonus: 5,
  },
]

// Helper functions
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const getDaysRemaining = (maturityDate: Date): number => {
  const now = new Date()
  const diffTime = maturityDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

const getTimeElapsedPercentage = (purchaseDate: Date, maturityDate: Date): number => {
  const now = new Date()
  const totalTime = maturityDate.getTime() - purchaseDate.getTime()
  const elapsedTime = now.getTime() - purchaseDate.getTime()
  return Math.min(Math.max((elapsedTime / totalTime) * 100, 0), 100)
}

export function SimpleBondManagement() {
  const [bonds, setBonds] = useState<Bond[]>(mockBonds)
  const [products, setProducts] = useState<BondProduct[]>(mockBondProducts)
  const [activeTab, setActiveTab] = useState<"holdings" | "purchase">("holdings")
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<BondProduct | null>(null)
  const [amount, setAmount] = useState<string>("")
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Simulate loading bonds
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  // Handle product selection
  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      setSelectedProduct(product)
      setAmount("")
    }
  }

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "")
    setAmount(value)
  }

  // Handle max amount
  const handleMaxAmount = () => {
    setAmount("5.0") // Mock balance
  }

  // Handle purchase
  const handlePurchase = () => {
    if (!selectedProduct) return

    setPurchaseLoading(true)
    setTimeout(() => {
      setPurchaseLoading(false)
      setPurchaseSuccess(true)

      // Add new bond to the list
      const amountValue = Number.parseFloat(amount)
      const newBond: Bond = {
        id: `bond-${Date.now()}`,
        name: selectedProduct.name,
        type: selectedProduct.type,
        amount: amountValue,
        value: amountValue * (1 + selectedProduct.interestRate / 100),
        interestRate: selectedProduct.interestRate,
        maturityDate: new Date(Date.now() + selectedProduct.term * 24 * 60 * 60 * 1000),
        purchaseDate: new Date(),
        status: "active",
      }

      if (selectedProduct.type === "ritual") {
        newBond.nextRitualDate = new Date(Date.now() + (selectedProduct.ritualFrequency || 7) * 24 * 60 * 60 * 1000)
        newBond.ritualParticipation = 0
      }

      setBonds((prev) => [...prev, newBond])
    }, 2000)
  }

  // Handle claim bond
  const handleClaimBond = (bondId: string) => {
    setActionLoading(bondId)
    setTimeout(() => {
      setBonds((prev) => prev.map((bond) => (bond.id === bondId ? { ...bond, status: "claimed" as const } : bond)))
      setActionLoading(null)
    }, 1500)
  }

  // Handle participate in ritual
  const handleParticipateInRitual = (bondId: string) => {
    setActionLoading(bondId)
    setTimeout(() => {
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
      setActionLoading(null)
    }, 1500)
  }

  // Reset purchase form
  const resetPurchaseForm = () => {
    setPurchaseSuccess(false)
    setSelectedProduct(null)
    setAmount("")
  }

  // Calculate expected return
  const calculateReturn = () => {
    if (!selectedProduct || !amount || isNaN(Number.parseFloat(amount))) {
      return null
    }

    const amountValue = Number.parseFloat(amount)
    const baseReturn = amountValue * (1 + selectedProduct.interestRate / 100)

    // Add ritual bonus if applicable
    if (selectedProduct.type === "ritual" && selectedProduct.ritualBonus) {
      const maxBonus = amountValue * (selectedProduct.ritualBonus / 100)
      return {
        base: baseReturn,
        max: baseReturn + maxBonus,
      }
    }

    return {
      base: baseReturn,
      max: baseReturn,
    }
  }

  const expectedReturn = calculateReturn()

  // Calculate total value of all bonds
  const totalValue = bonds.reduce((total, bond) => total + bond.value, 0)

  // Get counts by type and status
  const activeBonds = bonds.filter((bond) => bond.status === "active").length
  const maturedBonds = bonds.filter((bond) => bond.status === "matured").length
  const fixedBonds = bonds.filter((bond) => bond.type === "fixed").length
  const ritualBonds = bonds.filter((bond) => bond.type === "ritual").length

  return (
    <div className="space-y-6">
      {/* Preview Mode Banner */}
      <div className="mb-4 rounded-md bg-amber-50 p-3 dark:bg-amber-900/30">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Preview Mode: This is a simulation using mock data. No blockchain interactions are being made.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "holdings" | "purchase")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="holdings">My Bond Holdings</TabsTrigger>
          <TabsTrigger value="purchase">Purchase New Bonds</TabsTrigger>
        </TabsList>

        {/* Bond Holdings Tab */}
        <TabsContent value="holdings" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bond Holdings</CardTitle>
                  <CardDescription>Manage your fixed-rate and ritual bonds</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                  {refreshing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : bonds.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <p className="text-sm text-muted-foreground">You don't have any bonds yet</p>
                  <Button className="mt-2" onClick={() => setActiveTab("purchase")}>
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
                                  bond.status === "active"
                                    ? "default"
                                    : bond.status === "matured"
                                      ? "destructive"
                                      : "outline"
                                }
                              >
                                {bond.status === "active"
                                  ? "Active"
                                  : bond.status === "matured"
                                    ? "Ready to Claim"
                                    : "Claimed"}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Purchased: {formatDate(bond.purchaseDate)}
                            </p>
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
                            {bond.status === "active" && (
                              <span>{getDaysRemaining(bond.maturityDate)} days remaining</span>
                            )}
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

                          <Button variant="outline">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={() => setActiveTab("purchase")}>Purchase New Bond</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase Bonds Tab */}
        <TabsContent value="purchase" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Bonds</CardTitle>
              <CardDescription>Invest in fixed-rate and ritual bonds</CardDescription>
            </CardHeader>
            <CardContent>
              {purchaseSuccess ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
                  </div>
                  <h3 className="text-xl font-semibold">Bond Purchased Successfully!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your bond has been purchased and added to your portfolio.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => setActiveTab("holdings")}>View My Bonds</Button>
                    <Button variant="outline" onClick={resetPurchaseForm}>
                      Purchase Another
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Bond Type Selection */}
                  <Tabs defaultValue="fixed" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="fixed">Fixed-Rate Bonds</TabsTrigger>
                      <TabsTrigger value="ritual">Ritual Bonds</TabsTrigger>
                    </TabsList>

                    <TabsContent value="fixed" className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {products
                          .filter((product) => product.type === "fixed")
                          .map((product) => (
                            <div
                              key={product.id}
                              className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                                selectedProduct?.id === product.id
                                  ? "border-primary bg-primary/5"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => handleProductSelect(product.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                <h3 className="font-medium">{product.name}</h3>
                              </div>
                              <div className="mt-2 text-2xl font-bold">{product.interestRate}%</div>
                              <p className="text-sm text-muted-foreground">
                                {product.term} days • Min {product.minAmount} ETH
                              </p>
                              <p className="mt-2 text-sm">{product.description}</p>
                            </div>
                          ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="ritual" className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {products
                          .filter((product) => product.type === "ritual")
                          .map((product) => (
                            <div
                              key={product.id}
                              className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                                selectedProduct?.id === product.id
                                  ? "border-primary bg-primary/5"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => handleProductSelect(product.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                <h3 className="font-medium">{product.name}</h3>
                              </div>
                              <div className="mt-2 text-2xl font-bold">
                                {product.interestRate}% + {product.ritualBonus}%
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {product.term} days • Min {product.minAmount} ETH
                              </p>
                              <p className="mt-2 text-sm">{product.description}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Rituals every {product.ritualFrequency} days
                              </p>
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Purchase Form */}
                  {selectedProduct && (
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>

                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="amount">Investment Amount (ETH)</Label>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span>Balance: 5.0000 ETH</span>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleMaxAmount}>
                                Max
                              </Button>
                            </div>
                          </div>
                          <Input
                            id="amount"
                            type="text"
                            placeholder={`Min ${selectedProduct.minAmount} ETH`}
                            value={amount}
                            onChange={handleAmountChange}
                          />
                          {amount && Number.parseFloat(amount) < selectedProduct.minAmount && (
                            <p className="text-xs text-destructive">
                              Minimum amount is {selectedProduct.minAmount} ETH
                            </p>
                          )}
                        </div>

                        {/* Expected Return */}
                        {expectedReturn && (
                          <div className="rounded-md bg-muted p-3">
                            <h4 className="font-medium">Expected Return</h4>
                            <div className="mt-2 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Principal</p>
                                <p className="font-medium">{Number.parseFloat(amount).toFixed(4)} ETH</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Interest Rate</p>
                                <p className="font-medium">
                                  {selectedProduct.interestRate}%
                                  {selectedProduct.type === "ritual" &&
                                    selectedProduct.ritualBonus &&
                                    ` + up to ${selectedProduct.ritualBonus}%`}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Maturity</p>
                                <p className="font-medium">{selectedProduct.term} days</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Total Return</p>
                                <p className="font-medium">
                                  {expectedReturn.base.toFixed(4)} ETH
                                  {expectedReturn.max > expectedReturn.base &&
                                    ` - ${expectedReturn.max.toFixed(4)} ETH`}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Ritual Info */}
                        {selectedProduct.type === "ritual" && (
                          <div className="flex items-start gap-2 rounded-md bg-blue-50 p-3 text-sm dark:bg-blue-950">
                            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                            <div>
                              <p className="font-medium text-blue-700 dark:text-blue-300">Ritual Bond Information</p>
                              <p className="mt-1 text-blue-600 dark:text-blue-400">
                                Ritual bonds require periodic participation to maximize returns. You'll need to
                                participate in rituals every {selectedProduct.ritualFrequency} days to earn the full{" "}
                                {selectedProduct.ritualBonus}% bonus.
                              </p>
                            </div>
                          </div>
                        )}

                        <Button
                          className="w-full"
                          onClick={handlePurchase}
                          disabled={
                            purchaseLoading ||
                            !amount ||
                            isNaN(Number.parseFloat(amount)) ||
                            Number.parseFloat(amount) < selectedProduct.minAmount
                          }
                        >
                          {purchaseLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Purchase Bond"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
