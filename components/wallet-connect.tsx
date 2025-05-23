"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/contexts/wallet-context"
import { Loader2, AlertCircle, ExternalLink, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function WalletConnect() {
  const {
    account,
    balance,
    chainId,
    networkName,
    isNetworkSupported,
    isConnecting,
    isConnected,
    error,
    connect,
    disconnect,
    switchNetwork,
    refreshBalance,
  } = useWallet()

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
          <CardDescription>Connect your wallet to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[100px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const getExplorerUrl = () => {
    if (!account || !chainId) return "#"

    let baseUrl = "https://etherscan.io"

    if (chainId === 5) {
      baseUrl = "https://goerli.etherscan.io"
    } else if (chainId === 11155111) {
      baseUrl = "https://sepolia.etherscan.io"
    } else if (chainId === 80001) {
      baseUrl = "https://mumbai.polygonscan.com"
    }

    return `${baseUrl}/address/${account}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
        <CardDescription>Connect your wallet to interact with contracts</CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">Connected</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={refreshBalance}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm">{formatAddress(account!)}</p>
                  <a
                    href={getExplorerUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm">{networkName}</p>
                  {!isNetworkSupported && (
                    <Button variant="destructive" size="sm" onClick={switchNetwork} className="h-6 text-xs">
                      Switch Network
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-sm">{balance} ETH</p>
              </div>
            </div>

            {!isNetworkSupported && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Please switch to a supported network to use the application.</AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-muted-foreground">Connect your wallet to access Chrononomic Finance features.</p>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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
          </div>
        )}
      </CardContent>
      {isConnected && (
        <CardFooter>
          <Button variant="outline" onClick={disconnect} className="w-full">
            Disconnect
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
