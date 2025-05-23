import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Coins, BarChart3, Wallet, ArrowRightLeft, Shield, Globe, Zap } from "lucide-react"
import { HomepageChatbot } from "@/components/homepage/chatbot"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Chrononomic Finance
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                The future of time-based financial instruments
              </p>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Whitepaper v2.0 Now Available
          </div>
          <h2 className="text-3xl font-bold tracking-tighter mb-4">
            The Future of <span className="text-primary">Time-Based Assets</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mb-8">
            Chrononomic Finance v2.0 introduces enhanced Temporal Density Protocols, cross-chain compatibility, and
            improved ritual participation mechanisms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/connect">Connect Wallet</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/whitepaper">
                Read Whitepaper <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Key Features</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Discover the innovative features that make Chrononomic Finance a revolutionary platform
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col p-6 bg-primary/5 rounded-lg">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure Time-Locking</h3>
              <p className="text-muted-foreground">
                Military-grade encryption and smart contract security ensure your time-based assets remain protected.
              </p>
            </div>

            <div className="flex flex-col p-6 bg-primary/5 rounded-lg">
              <Globe className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Cross-Chain Compatibility</h3>
              <p className="text-muted-foreground">
                Seamlessly transfer your Chronons across multiple blockchains with our advanced bridge technology.
              </p>
            </div>

            <div className="flex flex-col p-6 bg-primary/5 rounded-lg">
              <Zap className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Temporal Density Protocol</h3>
              <p className="text-muted-foreground">
                Our proprietary algorithm optimizes time value through advanced compression and expansion techniques.
              </p>
            </div>
          </div>
        </section>

        {/* Products Overview */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Our Products</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              A comprehensive suite of time-based financial products with performance-driven returns.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Shared-Revenue Time Pools */}
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <Coins className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Shared-Revenue Time Pools</h3>
              <p className="text-muted-foreground mb-4">
                Commit Chronons into communal pools tied to real-world revenue streams.
              </p>
              <Button variant="link" asChild className="mt-auto">
                <Link href="/pools">Learn More</Link>
              </Button>
            </div>

            {/* Asset-Backed Time Certificates */}
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Asset-Backed Time Certificates</h3>
              <p className="text-muted-foreground mb-4">
                Fractional ownership certificates of time-assets with transparent yield.
              </p>
              <Button variant="link" asChild className="mt-auto">
                <Link href="/certificates">Learn More</Link>
              </Button>
            </div>

            {/* Dynamic Time-Lease Contracts */}
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <Clock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Dynamic Time-Lease Contracts</h3>
              <p className="text-muted-foreground mb-4">
                A decentralized marketplace for leasing Chronons with dynamic pricing.
              </p>
              <Button variant="link" asChild className="mt-auto">
                <Link href="/marketplace">Learn More</Link>
              </Button>
            </div>

            {/* Cost-Plus Time Financing */}
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <Wallet className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Cost-Plus Time Financing</h3>
              <p className="text-muted-foreground mb-4">
                Platform acquires time-based assets on your behalf with transparent markup.
              </p>
              <Button variant="link" asChild className="mt-auto">
                <Link href="/financing">Learn More</Link>
              </Button>
            </div>

            {/* Instant Currency Conversion */}
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <ArrowRightLeft className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Instant Currency Conversion</h3>
              <p className="text-muted-foreground mb-4">
                One-click swap between Chronons and USD/EUR/ETH via liquidity pools.
              </p>
              <Button variant="link" asChild className="mt-auto">
                <Link href="/exchange">Learn More</Link>
              </Button>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button size="lg" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Hear from people who have transformed their relationship with time
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 border rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-muted-foreground">Time Investor</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Chrononomic Finance has completely changed how I think about my time. The returns on my time
                investments have been incredible."
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  AS
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Alice Smith</h4>
                  <p className="text-sm text-muted-foreground">Bond Creator</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Creating time bonds has allowed me to leverage my future time in ways I never thought possible. The
                platform is intuitive and powerful."
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  RJ
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Robert Johnson</h4>
                  <p className="text-sm text-muted-foreground">Ritual Participant</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The ritual participation mechanisms are revolutionary. I've seen my time density increase by 35% in
                just three months."
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground p-8 rounded-lg">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
                <p className="text-primary-foreground/80">
                  Connect your wallet and start exploring the Chrononomic Finance ecosystem.
                </p>
              </div>
              <div className="flex gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/connect">Connect Wallet</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10" asChild>
                  <Link href="/whitepaper">Read Whitepaper</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Chatbot */}
        <HomepageChatbot />
      </main>
    </div>
  )
}
