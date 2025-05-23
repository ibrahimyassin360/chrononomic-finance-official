"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/contexts/wallet-provider"

export default function TokenBalance() {
  const { isConnected, balance } = useWallet()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balance</CardTitle>
          <CardDescription>Your current token balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[100px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading balance...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance</CardTitle>
        <CardDescription>Your current token balance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">ETH Balance</span>
            <span className="text-2xl font-bold">{isConnected ? balance : "0.0000"} ETH</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Chronon Balance</span>
            <span className="text-2xl font-bold">{isConnected ? "100.0000" : "0.0000"} CHRN</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
