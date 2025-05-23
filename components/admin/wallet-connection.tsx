"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWalletConnection } from "@/hooks/use-wallet-connection"
import { getNetworkName } from "@/services/wallet-service"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export function WalletConnection() {
  const { address, chainId, balance, isConnected, isConnecting, error, isAdmin, connect, disconnect } =
    useWalletConnection()

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[120px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        {!isConnected ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Connect Wallet</h3>
            <p className="text-sm text-muted-foreground">Connect your wallet to access the admin dashboard.</p>
            <Button onClick={connect} disabled={isConnecting} className="w-full">
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Wallet"
              )}
            </Button>
            {error && (
              <div className="text-sm text-red-500 mt-2">
                <XCircle className="inline-block mr-1 h-4 w-4" />
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Wallet Connected</h3>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-green-500">Connected</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-sm font-mono truncate">{address}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <p className="text-sm">{getNetworkName(chainId)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-sm">{balance} ETH</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Admin Status</p>
                <div className="flex items-center">
                  {isAdmin ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">Admin</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-500">Not Admin</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button onClick={disconnect} variant="outline" className="w-full">
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
