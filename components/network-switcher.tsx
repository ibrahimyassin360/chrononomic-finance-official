"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/contexts/wallet-context"
import { Loader2, AlertCircle, Check } from "lucide-react"
import { NETWORK_NAMES, SUPPORTED_NETWORKS } from "@/config/contracts"

export function NetworkSwitcher() {
  const { chainId, isConnected, switchNetwork } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSwitchNetwork = async (networkId: number) => {
    if (!isConnected) return

    setLoading(true)
    setError(null)

    try {
      // This is a simplified version - in reality, you'd need to implement
      // network-specific switching logic in the wallet context
      await switchNetwork()
    } catch (err: any) {
      console.error("Error switching network:", err)
      setError(err.message || "Failed to switch network")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network</CardTitle>
        <CardDescription>Select a blockchain network</CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Connect your wallet to switch networks</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-2">
              {SUPPORTED_NETWORKS.map((networkId) => (
                <Button
                  key={networkId}
                  variant={chainId === networkId ? "default" : "outline"}
                  className="justify-between"
                  onClick={() => handleSwitchNetwork(networkId)}
                  disabled={loading || chainId === networkId}
                >
                  <span>{NETWORK_NAMES[networkId]}</span>
                  {chainId === networkId && <Check className="h-4 w-4 ml-2" />}
                </Button>
              ))}
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-destructive">
                <div className="flex items-start">
                  <AlertCircle className="mr-2 h-4 w-4 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
