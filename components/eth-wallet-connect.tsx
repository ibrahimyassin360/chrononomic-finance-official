"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"

export default function EthWalletConnect() {
  const {
    account,
    balance,
    isConnecting,
    error,
    hasPaid,
    connect,
    makePayment,
    isCorrectNetwork,
    switchNetwork,
    isPreview,
  } = useWallet()

  const [isPaying, setIsPaying] = useState(false)
  const ETH_REQUIRED = "1.0"

  // Handle payment
  const handlePayment = async () => {
    setIsPaying(true)
    try {
      await makePayment(ETH_REQUIRED)
    } finally {
      setIsPaying(false)
    }
  }

  // Format account address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Access Chrononomic Finance</CardTitle>
        <CardDescription>Connect your wallet and pay 1 ETH to access the platform</CardDescription>
      </CardHeader>
      <CardContent>
        {isPreview && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-yellow-800">
              Running in preview mode. Wallet interactions are simulated.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {hasPaid ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-green-50 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Access granted! You can now use all platform features.</span>
            </div>

            {account && (
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Connected Account:</p>
                <p className="font-mono text-sm truncate">{account}</p>
                {balance && (
                  <p className="text-sm text-gray-500 mt-2">Balance: {Number.parseFloat(balance).toFixed(4)} ETH</p>
                )}
              </div>
            )}
          </div>
        ) : account ? (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Connected Account:</p>
              <p className="font-mono text-sm truncate">{account}</p>
              {balance && (
                <p className="text-sm text-gray-500 mt-2">Balance: {Number.parseFloat(balance).toFixed(4)} ETH</p>
              )}
            </div>

            {!isCorrectNetwork && !isPreview ? (
              <div className="p-4 bg-yellow-50 rounded-md border border-yellow-100">
                <p className="text-yellow-800 mb-2">Please switch to the Ethereum Mainnet to continue.</p>
                <Button onClick={switchNetwork} className="w-full">
                  Switch Network
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-blue-800 mb-2">
                  To access Chrononomic Finance, a daily payment of {ETH_REQUIRED} ETH is required.
                </p>
                <Button onClick={handlePayment} disabled={isPaying} className="w-full">
                  {isPaying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ${ETH_REQUIRED} ETH`
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="mb-4 text-gray-600">Connect your Ethereum wallet to access Chrononomic Finance</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {!account && (
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
        )}

        {hasPaid && (
          <Button onClick={() => (window.location.href = "/dashboard")} className="w-full">
            Go to Dashboard
          </Button>
        )}

        {!isPreview && (
          <div className="text-center text-xs text-gray-500 mt-2">
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 hover:text-gray-700"
            >
              Don't have a wallet? <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
