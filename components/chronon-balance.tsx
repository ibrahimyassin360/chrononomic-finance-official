"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { getTokenBalance } from "@/services/contract-service"

export function ChrononBalance() {
  const { account, isConnected, provider, chainId } = useWallet()
  const [balance, setBalance] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = async () => {
    if (!account || !isConnected || !provider || !chainId) {
      setBalance(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const tokenBalance = await getTokenBalance(account, provider, chainId)
      setBalance(tokenBalance)
    } catch (err: any) {
      console.error("Error fetching token balance:", err)
      setError(err.message || "Failed to load token balance")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [account, isConnected, provider, chainId])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Chronon Balance</CardTitle>
            <CardDescription>Your current Chronon (χ) token balance</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchBalance} disabled={loading || !isConnected}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchBalance} className="mt-2">
              Retry
            </Button>
          </div>
        ) : !isConnected ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Connect your wallet to view your balance</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-4xl font-bold">{balance || "0"}</p>
            <p className="text-sm text-muted-foreground mt-1">Chronon (χ)</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
