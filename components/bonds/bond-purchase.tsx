"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, AlertCircle, Clock, RefreshCw } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { issueBond, getTokenBalance } from "@/services/contract-service"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function BondPurchase() {
  const { account, isConnected, signer, provider, chainId, isNetworkSupported } = useWallet()
  const [amount, setAmount] = useState<string>("")
  const [duration, setDuration] = useState<number>(30) // 30 days default
  const [loading, setLoading] = useState(false)
  const [chrononBalance, setChrononBalance] = useState<string | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [bondType, setBondType] = useState<"fixed" | "ritual">("fixed")

  // Fetch Chronon balance
  const fetchBalance = async () => {
    if (!isConnected || !account || !provider || !chainId || !isNetworkSupported) {
      setChrononBalance(null)
      return
    }

    setBalanceLoading(true)

    try {
      const balance = await getTokenBalance(account, provider, chainId)
      setChrononBalance(balance)
    } catch (err) {
      console.error("Error fetching Chronon balance:", err)
    } finally {
      setBalanceLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [isConnected, account, provider, chainId, isNetworkSupported])

  const handlePurchase = async () => {
    if (!account || !isConnected || !signer || !chainId || !isNetworkSupported) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const amountValue = Number.parseFloat(amount)
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Please enter a valid amount")
      }

      if (chrononBalance && amountValue > Number.parseFloat(chrononBalance)) {
        throw new Error("Insufficient Chronon balance")
      }

      // Convert duration from days to seconds
      const durationInSeconds = duration * 24 * 60 * 60

      // Issue the bond
      const result = await issueBond(amount, durationInSeconds, signer, chainId)

      if (result) {
        setSuccess(`Successfully purchased a ${bondType} bond! Bond ID: ${result.bondId}`)
        setAmount("")
        // Refresh balance
        fetchBalance()
      } else {
        throw new Error("Failed to purchase bond")
      }
    } catch (err: any) {
      console.error("Error purchasing bond:", err)
      setError(err.message || "Failed to purchase bond")
    } finally {
      setLoading(false)
    }
  }

  const calculateInterest = () => {
    // Simple interest calculation based on duration
    const baseRate = bondType === "fixed" ? 5 : 8 // 5% for fixed, 8% for ritual
    const durationFactor = duration / 30 // Normalize to 30 days
    return baseRate * durationFactor
  }

  const calculateMaturityValue = () => {
    if (!amount || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      return null
    }

    const principal = Number.parseFloat(amount)
    const interestRate = calculateInterest()
    const interestAmount = (principal * interestRate) / 100
    return (principal + interestAmount).toFixed(2)
  }

  const maturityValue = calculateMaturityValue()
  const interestRate = calculateInterest().toFixed(2)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Purchase Bond
            </CardTitle>
            <CardDescription>Lock your Chronons to earn interest</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchBalance}
            disabled={balanceLoading || !isConnected || !isNetworkSupported}
          >
            <RefreshCw className={`h-4 w-4 ${balanceLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">Connect your wallet to purchase bonds</p>
          </div>
        ) : !isNetworkSupported ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please switch to a supported network to purchase bonds</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {/* Status Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Chronon Balance Display */}
            <div className="p-3 bg-muted rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Your Chronon Balance:</span>
                {balanceLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="font-medium">
                    {chrononBalance ? `${Number.parseFloat(chrononBalance).toFixed(4)} χ` : "0 χ"}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Bond Type</Label>
                <RadioGroup
                  value={bondType}
                  onValueChange={(value) => setBondType(value as "fixed" | "ritual")}
                  className="grid grid-cols-2 gap-4 pt-2"
                >
                  <div>
                    <RadioGroupItem value="fixed" id="fixed" className="peer sr-only" disabled={loading} />
                    <Label
                      htmlFor="fixed"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-sm font-semibold">Fixed Rate</span>
                      <span className="text-xs text-muted-foreground">Lower risk, stable returns</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="ritual" id="ritual" className="peer sr-only" disabled={loading} />
                    <Label
                      htmlFor="ritual"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-sm font-semibold">Ritual Bond</span>
                      <span className="text-xs text-muted-foreground">Higher returns, requires participation</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (χ)</Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                />
                {chrononBalance && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Balance: {Number.parseFloat(chrononBalance).toFixed(4)} χ</span>
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => setAmount(chrononBalance)}
                      disabled={loading}
                    >
                      Max
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="duration">Duration</Label>
                  <span className="text-sm text-muted-foreground">{duration} days</span>
                </div>
                <Slider
                  id="duration"
                  min={7}
                  max={365}
                  step={1}
                  value={[duration]}
                  onValueChange={(values) => setDuration(values[0])}
                  disabled={loading}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>7 days</span>
                  <span>1 year</span>
                </div>
              </div>
            </div>

            {maturityValue && (
              <div className="rounded-md bg-muted p-4 space-y-2">
                <h4 className="text-sm font-medium">Bond Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Principal:</div>
                  <div className="text-right">{amount} χ</div>
                  <div className="text-muted-foreground">Interest Rate:</div>
                  <div className="text-right">{interestRate}%</div>
                  <div className="text-muted-foreground">Duration:</div>
                  <div className="text-right">{duration} days</div>
                  <div className="text-muted-foreground">Maturity Date:</div>
                  <div className="text-right">
                    {new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </div>
                  <div className="text-muted-foreground">Maturity Value:</div>
                  <div className="text-right font-medium">{maturityValue} χ</div>
                </div>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handlePurchase}
              disabled={
                loading ||
                !amount ||
                Number.parseFloat(amount) <= 0 ||
                (chrononBalance && Number.parseFloat(amount) > Number.parseFloat(chrononBalance))
              }
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Purchase Bond"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
