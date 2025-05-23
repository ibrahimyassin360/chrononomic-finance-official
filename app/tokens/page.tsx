import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TokensPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Chronon Token</h1>
        <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
          The native token of the Chrononomic Finance ecosystem.
        </p>
      </section>

      <section className="mb-12">
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Connect your wallet to view and manage your tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You need to connect your wallet to access token features.</p>
            <Link href="/connect">
              <Button>Connect Wallet</Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-center text-3xl font-bold">About Chronon Token</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h3 className="mb-2 text-xl font-bold">Token Utility</h3>
            <p className="mb-4 text-muted-foreground">
              Chronon tokens (CHRN) are the native utility token of the Chrononomic Finance ecosystem. They provide
              holders with governance rights, access to premium features, and special benefits.
            </p>
            <ul className="mb-4 list-disc pl-5 text-muted-foreground">
              <li>Governance voting rights</li>
              <li>Access to premium features</li>
              <li>Staking rewards</li>
              <li>Reduced fees on transactions</li>
            </ul>
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="mb-2 text-xl font-bold">Token Economics</h3>
            <p className="mb-4 text-muted-foreground">
              The Chronon token has a fixed supply of 10 million tokens, with a carefully designed distribution model to
              ensure long-term sustainability and value.
            </p>
            <div className="mb-4 space-y-2">
              <div className="flex justify-between">
                <span>Current Price:</span>
                <span className="font-medium">$125.75 USD</span>
              </div>
              <div className="flex justify-between">
                <span>Market Cap:</span>
                <span className="font-medium">$1.26B USD</span>
              </div>
              <div className="flex justify-between">
                <span>Circulating Supply:</span>
                <span className="font-medium">10,000,000 CHRN</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
