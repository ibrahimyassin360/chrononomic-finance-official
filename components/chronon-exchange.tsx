"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { buyChronons, sellChronons, getChrononPrices, getTokenBalance } from "@/services/contract-service"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ChrononExchange() {
  const { account, isConnected, provider, signer, chainId, balance, isNetworkSupported } = useWallet()
  const [buyAmount, setBuyAmount] = useState<string>("")
  const [sellAmount, setSellAmount] = useState<string>("")
  const [chrononBalance, setChrononBalance] = useState<string | null>(null)
  const [prices, setPrices] = useState<{ buyPrice: string; sellPrice: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [pricesLoading, setPricesLoading] = useState(false)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch prices and balances
  const fetchData = async () => {
    if (!isConnected || !provider || !chainId || !isNetworkSupported) {
      setPrices(null)
      setChrononBalance(null)
      return
    }

    setPricesLoading(true)
    setBalanceLoading(true)

    try {
      // Fetch prices
      const priceData = await getChrononPrices(provider, chainId)
      setPrices(priceData)

      // Fetch Chronon balance if account is connected
      if (account) {
        const tokenBalance = await getTokenBalance(account, provider, chainId)
        setChrononBalance(tokenBalance)
      }
    } catch (err: any) {
      console.error("Error fetching data:", err)
      setError(err.message || "Failed to fetch data")
    } finally {
      setPricesLoading(false)
      setBalanceLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [isConnected, provider, chainId, account, isNetworkSupported])

  // Handle buy Chronons
  const handleBuy = async () => {
    if (!isConnected || !signer || !chainId || !isNetworkSupported) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const ethAmount = buyAmount.trim()
      if (!ethAmount || isNaN(Number.parseFloat(ethAmount)) || Number.parseFloat(ethAmount) <= 0) {
        throw new Error("Please enter a valid amount")
      }

      if (balance && Number.parseFloat(ethAmount) > Number.parseFloat(balance)) {
        throw new Error("Insufficient ETH balance")
      }

      // Buy Chronons
      const result = await buyChronons(ethAmount, signer, chainId)

      if (result) {
        setSuccess(`Successfully purchased Chronons with ${ethAmount} ETH`)
        setBuyAmount("")
        // Refresh data
        fetchData()
      } else {
        throw new Error("Transaction failed")
      }
    } catch (err: any) {
      console.error("Error buying Chronons:", err)
      setError(err.message || "Failed to buy Chronons")
    } finally {
      setLoading(false)
    }
  }

  // Handle sell Chronons
  const handleSell = async () => {
    if (!isConnected || !signer || !chainId || !isNetworkSupported) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const amount = sellAmount.trim()
      if (!amount || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount")
      }

      if (chrononBalance && Number.parseFloat(amount) > Number.parseFloat(chrononBalance)) {
        throw new Error("Insufficient Chronon balance")
      }

      // Sell Chronons
      const result = await sellChronons(amount, signer, chainId)

      if (result) {
        setSuccess(`Successfully sold ${amount} Chronons`)
        setSellAmount("")
        // Refresh data
        fetchData()
      } else {
        throw new Error("Transaction failed")
      }
    } catch (err: any) {
      console.error("Error selling Chronons:", err)
      setError(err.message || "Failed to sell Chronons")
    } finally {
      setLoading(false)
    }
  }

  // Calculate expected Chronons from ETH
  const calculateExpectedChronons = () => {
    if (!buyAmount || !prices || isNaN(Number.parseFloat(buyAmount)) || Number.parseFloat(buyAmount) <= 0) {
      return null
    }

    const ethAmount = Number.parseFloat(buyAmount)
    const buyPrice = Number.parseFloat(prices.buyPrice)

    if (buyPrice <= 0) return null

    return (ethAmount / buyPrice).toFixed(4)
  }

  // Calculate expected ETH from Chronons
  const calculateExpectedEth = () => {
    if (!sellAmount || !prices || isNaN(Number.parseFloat(sellAmount)) || Number.parseFloat(sellAmount) <= 0) {
      return null
    }

    const chrononAmount = Number.parseFloat(sellAmount)
    const sellPrice = Number.parseFloat(prices.sellPrice)

    return (chrononAmount * sellPrice).toFixed(4)
  }

  const expectedChronons = calculateExpectedChronons()
  const expectedEth = calculateExpectedEth()

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Exchange</CardTitle>
            <CardDescription>Buy and sell Chronon tokens</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchData}
            disabled={pricesLoading || !isConnected || !isNetworkSupported}
          >
            <RefreshCw className={`h-4 w-4 ${pricesLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">Connect your wallet to exchange tokens</p>
          </div>
        ) : !isNetworkSupported ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please switch to a supported network to exchange tokens</AlertDescription>
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

            {/* Balances */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ETH Balance:</span>
                  <span className="font-medium">
                    {balance ? `${Number.parseFloat(balance).toFixed(4)} ETH` : "0 ETH"}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Chronon Balance:</span>
                  {balanceLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="font-medium">
                      {chrononBalance ? `${Number.parseFloat(chrononBalance).toFixed(4)} χ` : "0 χ"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Exchange Tabs */}
            <Tabs defaultValue="buy" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="sell">Sell</TabsTrigger>
              </TabsList>

              {/* Buy Tab */}
              <TabsContent value="buy" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="buyAmount">Amount (ETH)</Label>
                  <Input
                    id="buyAmount"
                    type="text"
                    placeholder="0.0"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    disabled={loading}
                  />
                  {balance && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Balance: {Number.parseFloat(balance).toFixed(4)} ETH</span>
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => {
                          // Set to 95% of balance to account for gas
                          const maxAmount = Number.parseFloat(balance) * 0.95
                          setBuyAmount(maxAmount.toFixed(4))
                        }}
                        disabled={loading}
                      >
                        Max
                      </button>
                    </div>
                  )}
                </div>

                {pricesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : prices ? (
                  <div className="rounded-md bg-muted p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price per Chronon:</span>
                      <span>{Number.parseFloat(prices.buyPrice).toFixed(6)} ETH</span>
                    </div>
                    {expectedChronons && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">You will receive:</span>
                        <span className="font-medium">{expectedChronons} χ</span>
                      </div>
                    )}
                  </div>
                ) : null}

                <Button
                  className="w-full"
                  onClick={handleBuy}
                  disabled={
                    loading ||
                    !buyAmount ||
                    isNaN(Number.parseFloat(buyAmount)) ||
                    Number.parseFloat(buyAmount) <= 0 ||
                    (balance && Number.parseFloat(buyAmount) > Number.parseFloat(balance))
                  }
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Buy Chronons"
                  )}
                </Button>
              </TabsContent>

              {/* Sell Tab */}
              <TabsContent value="sell" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="sellAmount">Amount (χ)</Label>
                  <Input
                    id="sellAmount"
                    type="text"
                    placeholder="0.0"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    disabled={loading}
                  />
                  {chrononBalance && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Balance: {Number.parseFloat(chrononBalance).toFixed(4)} χ</span>
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => setSellAmount(chrononBalance)}
                        disabled={loading}
                      >
                        Max
                      </button>
                    </div>
                  )}
                </div>

                {pricesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : prices ? (
                  <div className="rounded-md bg-muted p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price per Chronon:</span>
                      <span>{Number.parseFloat(prices.sellPrice).toFixed(6)} ETH</span>
                    </div>
                    {expectedEth && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">You will receive:</span>
                        <span className="font-medium">{expectedEth} ETH</span>
                      </div>
                    )}
                  </div>
                ) : null}

                <Button
                  className="w-full"
                  onClick={handleSell}
                  disabled={
                    loading ||
                    !sellAmount ||
                    isNaN(Number.parseFloat(sellAmount)) ||
                    Number.parseFloat(sellAmount) <= 0 ||
                    (chrononBalance && Number.parseFloat(sellAmount) > Number.parseFloat(chrononBalance))
                  }
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Sell Chronons"
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
