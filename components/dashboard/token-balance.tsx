"use client"

import { useWallet } from "@/contexts/wallet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTokenBalance } from "@/services/contract-service"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function TokenBalance() {
  const { account, isConnected, provider, chainId, isNetworkSupported } = useWallet()
  const [balance, setBalance] = useState<string | null>(null)
  const [symbol, setSymbol] = useState<string>("CHRN")
  const [name, setName] = useState<string>("Chronon Token")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTokenInfo = async () => {
    if (!account || !isConnected || !provider || !chainId || !isNetworkSupported) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get token balance from contract
      const tokenBalance = await getTokenBalance(account, provider, chainId)
      setBalance(tokenBalance)

      // In a real implementation, you would also fetch token details like symbol and name
      // For now, we'll use hardcoded values
      setSymbol("CHRN")
      setName("Chronon Token")
    } catch (err: any) {
      console.error("Error fetching token balance:", err)
      setError(err.message || "Failed to load token balance")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTokenInfo()
  }, [account, isConnected, provider, chainId, isNetworkSupported])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Token Balance</CardTitle>
            <CardDescription>{name} in your wallet</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchTokenInfo} disabled={loading || !isConnected}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : !isConnected ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Connect your wallet to view your balance</div>
        ) : !isNetworkSupported ? (
          <div className="py-4 text-center text-sm text-destructive">
            Please switch to a supported network to view your balance
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold">{balance ? Number.parseFloat(balance).toFixed(4) : "0.0000"}</span>
              <span className="text-xl font-medium text-muted-foreground">{symbol}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary"
                style={{ width: `${Math.min((Number(balance || 0) / 10) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {balance ? `${Number.parseFloat(balance).toFixed(4)} ${symbol} available` : "No tokens available"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
