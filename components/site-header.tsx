"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { GasPriceIndicator } from "@/components/gas-price-indicator"
import { Home, Coins, FileText, BarChart2, Clock } from "lucide-react"

export function SiteHeader() {
  const { isConnected, connect, disconnect, account, balance, isConnecting } = useWallet()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="font-bold text-lg">
            Chrononomic Finance
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Home className="mr-1 h-4 w-4" />
              Home
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <BarChart2 className="mr-1 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/bonds"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Clock className="mr-1 h-4 w-4" />
              Bonds
            </Link>
            <Link
              href="/economy"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Coins className="mr-1 h-4 w-4" />
              χ-Economy
            </Link>
            <Link
              href="/whitepaper"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <FileText className="mr-1 h-4 w-4" />
              Whitepaper
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <GasPriceIndicator className="mr-2 hidden md:flex" />
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <p className="text-xs text-muted-foreground">
                  {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                </p>
                <p className="text-xs font-medium">{balance?.substring(0, 6)} ETH</p>
              </div>
              <Button variant="outline" size="sm" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={connect} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
