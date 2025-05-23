"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/contexts/wallet-provider"
import Link from "next/link"

export default function BondSection() {
  const { isConnected } = useWallet()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-[400px] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
        <p className="text-muted-foreground">Loading bond information...</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your Bond Portfolio</CardTitle>
          <CardDescription>Manage your existing bonds</CardDescription>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You don't have any bonds yet.</p>
              <p className="text-muted-foreground">Purchase your first bond to get started.</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Connect your wallet to view your bonds.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild disabled={!isConnected}>
            <Link href="/bonds/portfolio">View Portfolio</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create a New Bond</CardTitle>
          <CardDescription>Purchase a new bond investment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Fixed-Rate Bond</span>
              <span className="text-primary">5-10% APY</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ritual Bond</span>
              <span className="text-primary">8-17% APY</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild disabled={!isConnected}>
            <Link href="/bonds/create">Create Bond</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
