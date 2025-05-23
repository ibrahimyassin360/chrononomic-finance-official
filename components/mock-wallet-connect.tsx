"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, Info } from "lucide-react"

// This is a completely mocked version for preview mode
export default function MockWalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [hasPaid, setHasPaid] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ETH_REQUIRED = "1.0"

  // Check if payment status is stored in localStorage
  const checkPaymentStatus = () => {
    try {
      return localStorage.getItem("chrononomic_payment_complete") === "true"
    } catch (e) {
      return false
    }
  }

  // Connect wallet function - completely mocked
  const connectWallet = async () => {
    setError(null)
    setIsConnecting(true)

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a mock address
    setAccount("0x1234...5678 (Preview)")
    setIsConnecting(false)
  }

  // Pay ETH function - completely mocked
  const payEth = async () => {
    setError(null)
    setIsPaying(true)

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Set payment status
    setHasPaid(true)
    try {
      localStorage.setItem("chrononomic_payment_complete", "true")
    } catch (e) {
      console.error("Failed to save to localStorage:", e)
    }

    setIsPaying(false)
  }

  // Reset function for testing
  const resetPaymentStatus = () => {
    try {
      localStorage.removeItem("chrononomic_payment_complete")
    } catch (e) {
      console.error("Failed to remove from localStorage:", e)
    }
    setHasPaid(false)
    setAccount(null)
  }

  // Check if already paid on initial render
  useState(() => {
    setHasPaid(checkPaymentStatus())
  })

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Access Chrononomic Finance</CardTitle>
        <CardDescription>Connect your wallet and pay 1 ETH to access the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <Info className="h-4 w-4 text-yellow-600 mr-2" />
          <AlertDescription className="text-yellow-800">
            Preview Mode: Wallet interactions are simulated.
          </AlertDescription>
        </Alert>

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

            {/* For testing purposes */}
            <div className="text-center">
              <Button variant="outline" size="sm" onClick={resetPaymentStatus}>
                Reset (For Testing)
              </Button>
            </div>
          </div>
        ) : account ? (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Connected Account (Preview):</p>
              <p className="font-mono text-sm truncate">{account}</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
              <p className="text-blue-800 mb-2">
                To access Chrononomic Finance, a one-time payment of {ETH_REQUIRED} ETH is required.
              </p>
              <Button onClick={payEth} disabled={isPaying} className="w-full">
                {isPaying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ${ETH_REQUIRED} ETH (Preview)`
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="mb-4 text-gray-600">Connect your Ethereum wallet to access Chrononomic Finance</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!account && !hasPaid && (
          <Button onClick={connectWallet} disabled={isConnecting} className="w-full">
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Wallet (Preview)"
            )}
          </Button>
        )}

        {hasPaid && (
          <Button onClick={() => (window.location.href = "/dashboard")} className="w-full">
            Go to Dashboard
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
