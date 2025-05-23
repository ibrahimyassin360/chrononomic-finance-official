"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function ConnectWalletWrapper() {
  // State
  const [isClient, setIsClient] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Mock connect function
  const handleConnect = async () => {
    setError(null)
    setIsConnecting(true)

    try {
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful connection
      setAccount("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
      setIsConnected(true)
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  // Mock disconnect function
  const handleDisconnect = () => {
    setAccount(null)
    setIsConnected(false)
  }

  // If not client-side yet, show loading state
  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>Loading wallet interface...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Your Wallet</CardTitle>
        <CardDescription>
          {isConnected ? "Your wallet is connected" : "Connect your wallet to access all features"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {isConnected && account ? (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-md border border-green-200">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Successfully connected!</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Connected Account:</p>
              <p className="font-mono text-sm truncate">{account}</p>
              <p className="text-sm text-gray-500 mt-2">Balance: 10.0000 ETH</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="mb-4 text-gray-600">Connect your Ethereum wallet to access Chrononomic Finance features.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isConnected ? (
          <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        ) : (
          <Button variant="outline" onClick={handleDisconnect} className="w-full">
            Disconnect Wallet
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
