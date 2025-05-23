"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/contexts/wallet-provider"
import Link from "next/link"
import { WhitepaperDownload } from "@/components/whitepaper-download"

export function DashboardContent() {
  const { isConnected, account, balance } = useWallet()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-[600px] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-muted-foreground mb-6">Please connect your wallet to access your dashboard.</p>
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-mono text-sm truncate">{account}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ETH Balance</p>
              <p className="text-2xl font-bold">{balance} ETH</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chronon Balance</p>
              <p className="text-2xl font-bold">100.0000 CHRN</p>
            </div>
          </div>
        </CardContent>
        <WhitepaperDownload variant="compact" className="mt-6" />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bond Holdings</CardTitle>
          <CardDescription>Your active bonds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You don't have any bonds yet.</p>
            <p className="text-muted-foreground">Purchase your first bond to get started.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/bonds">View Bonds</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No recent activity.</p>
            <p className="text-muted-foreground">Your transactions will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardContent
