"use client"

import { useWallet } from "@/contexts/wallet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle, ExternalLink } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export function AccountSummary() {
  const { account, chainId, balance, disconnect, isNetworkSupported } = useWallet()
  const [copied, setCopied] = useState(false)

  // Format account address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Copy address to clipboard
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Get network name from chain ID
  const getNetworkName = (id: number | null) => {
    if (!id) return "Unknown"

    const networks: Record<number, string> = {
      1: "Ethereum Mainnet",
      5: "Goerli Testnet",
      11155111: "Sepolia Testnet",
      137: "Polygon Mainnet",
      80001: "Mumbai Testnet",
      42161: "Arbitrum One",
      421613: "Arbitrum Goerli",
    }

    return networks[id] || `Chain ID: ${id}`
  }

  // Get etherscan URL for the current network
  const getExplorerUrl = (id: number | null, address: string) => {
    if (!id || !address) return "#"

    const explorers: Record<number, string> = {
      1: "https://etherscan.io",
      5: "https://goerli.etherscan.io",
      11155111: "https://sepolia.etherscan.io",
      137: "https://polygonscan.com",
      80001: "https://mumbai.polygonscan.com",
      42161: "https://arbiscan.io",
      421613: "https://goerli.arbiscan.io",
    }

    const baseUrl = explorers[id] || "https://etherscan.io"
    return `${baseUrl}/address/${address}`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Account Summary</CardTitle>
          <CardDescription>Your wallet information and balances</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={disconnect}>
          Disconnect
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Connected Account</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm">{account ? formatAddress(account) : "Not connected"}</span>
              {account && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyAddress}>
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
              {account && (
                <a
                  href={getExplorerUrl(chainId, account)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Network</span>
            <div className="flex items-center space-x-2">
              <Badge variant={isNetworkSupported ? "outline" : "destructive"}>{getNetworkName(chainId)}</Badge>
              {!isNetworkSupported && <span className="text-xs text-destructive">Network not supported</span>}
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">ETH Balance</span>
            <span className="text-2xl font-bold">{balance ? Number.parseFloat(balance).toFixed(4) : "0.0000"} ETH</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
