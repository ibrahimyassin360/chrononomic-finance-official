"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ethers } from "ethers"
import { CONTRACT_ADDRESSES } from "@/config/contracts"

export function RealChrononBalance() {
  const { account, isConnected, provider, chainId, isNetworkSupported } = useWallet()
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
      // Get contract address for the current network
      const addresses = CONTRACT_ADDRESSES[chainId] || {}

      if (!addresses.ChrononToken) {
        throw new Error("Chronon Token contract not found on this network")
      }

      // Import ABI
      const ChrononTokenABI = (await import("@/contracts/ChrononToken.json")).default

      // Create contract instance
      const tokenContract = new ethers.Contract(addresses.ChrononToken, ChrononTokenABI.abi, provider)

      // Get token balance
      const tokenBalance = await tokenContract.balanceOf(account)

      // Format balance with proper decimals
      const decimals = await tokenContract.decimals()
      const formattedBalance = ethers.utils.formatUnits(tokenBalance, decimals)

      setBalance(formattedBalance)
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
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : !isConnected ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Connect your wallet to view your balance</p>
          </div>
        ) : !isNetworkSupported ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please switch to a supported network to view your balance</AlertDescription>
          </Alert>
        ) : (
          <div className="text-center py-4">
            <p className="text-4xl font-bold">{balance ? Number.parseFloat(balance).toFixed(4) : "0.0000"}</p>
            <p className="text-sm text-muted-foreground mt-1">Chronon (χ)</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
