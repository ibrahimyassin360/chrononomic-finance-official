"use client"

import { useState, useEffect } from "react"
import WalletConnect from "@/components/wallet-connect"
import TokenBalance from "@/components/token-balance"

export default function WalletSection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-[200px] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
          <p className="text-muted-foreground">Loading wallet interface...</p>
        </div>
        <div className="h-[200px] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
          <p className="text-muted-foreground">Loading token balance...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <WalletConnect />
      <TokenBalance />
    </div>
  )
}
