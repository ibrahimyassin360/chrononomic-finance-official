import { Coins, BarChart3, Clock, Wallet, ArrowRightLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProductsPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Chrononomic Finance Products</h1>
        <p className="text-muted-foreground">
          Explore our suite of time-based financial products that allow you to save, invest, lend, and trade Chronons.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Shared-Revenue Time Pools */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              <CardTitle>Shared-Revenue Time Pools</CardTitle>
            </div>
            <CardDescription>
              Commit Chronons into communal pools tied to real-world lending, staking, or compute-service revenue.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Pro-rata distribution of actual revenue in time-units</li>
              <li>No fixed rates—rewards mirror performance</li>
              <li>Team sprint-funding, compute-time staking, project financing</li>
            </ul>
          </CardContent>
          <div className="p-6 pt-0 mt-auto">
            <Button asChild className="w-full">
              <Link href="/pools">Explore Pools</Link>
            </Button>
          </div>
        </Card>

        {/* Asset-Backed Time Certificates */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>Asset-Backed Time Certificates</CardTitle>
            </div>
            <CardDescription>
              Fractional ownership certificates of "time-assets" like cloud compute or consulting hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Proceeds from asset usage fees flow to certificate holders</li>
              <li>On-chain asset registry, usage logs, and revenue proofs</li>
              <li>Transparent yield based on actual asset performance</li>
            </ul>
          </CardContent>
          <div className="p-6 pt-0 mt-auto">
            <Button asChild className="w-full">
              <Link href="/certificates">View Certificates</Link>
            </Button>
          </div>
        </Card>

        {/* Dynamic Time-Lease Contracts */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Dynamic Time-Lease Contracts</CardTitle>
            </div>
            <CardDescription>
              A decentralized marketplace for leasing Chronons to service providers with dynamic pricing.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Supply-and-demand oracles adjust lease rates hourly</li>
              <li>Defined duration, payment triggers, and penalties</li>
              <li>Automated enforcement of lease agreements</li>
            </ul>
          </CardContent>
          <div className="p-6 pt-0 mt-auto">
            <Button asChild className="w-full">
              <Link href="/marketplace">Enter Marketplace</Link>
            </Button>
          </div>
        </Card>

        {/* Cost-Plus Time Financing */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <CardTitle>Cost-Plus Time Financing</CardTitle>
            </div>
            <CardDescription>
              Platform acquires time-based assets on your behalf, selling usage rights with a transparent markup.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Base cost + fixed service fee (e.g., 5%), no compounding</li>
              <li>Deferred payment option with same fee—no interest</li>
              <li>Transparent pricing and terms</li>
            </ul>
          </CardContent>
          <div className="p-6 pt-0 mt-auto">
            <Button asChild className="w-full">
              <Link href="/financing">Explore Financing</Link>
            </Button>
          </div>
        </Card>

        {/* Instant Currency Conversion */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
              <CardTitle>Instant Currency Conversion</CardTitle>
            </div>
            <CardDescription>
              One-click swap between Chronons and USD/EUR/ETH via liquidity pools and best-rate oracles.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Time liquidity unlocked without slippage</li>
              <li>No hidden fees or markups</li>
              <li>Real-time exchange rates via oracle network</li>
            </ul>
          </CardContent>
          <div className="p-6 pt-0 mt-auto">
            <Button asChild className="w-full">
              <Link href="/exchange">Exchange Now</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
