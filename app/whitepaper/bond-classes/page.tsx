import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BondClassesWhitepaperPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container py-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/whitepaper">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Whitepaper
          </Link>
        </Button>
        <Button size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Chrononomic Finance Bond Classes</h1>
        <p className="text-muted-foreground">
          <span className="italic">Date: May 18, 2025</span> •{" "}
          <span className="italic">Timezone: America/Los_Angeles</span>
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Abstract</h2>
          <p className="mb-4">
            Chrononomic Finance Bond Classes redefine debt instruments by replacing fixed coupons with{" "}
            <strong>performance-based Chronon (χ) yields</strong> tied directly to real-world utility. This whitepaper
            introduces six foundational bond classes—ℤ, 𝕏, ℂℚ, 𝕄, ℝ, and 𝕎—each designed to fund distinct pillars of the
            Chrononomic ecosystem. We cover their design principles, issuance mechanics, smart-contract frameworks, risk
            management, and governance structures.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="introduction" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="introduction">1. Intro</TabsTrigger>
          <TabsTrigger value="framework">2. Framework</TabsTrigger>
          <TabsTrigger value="issuance">3. Issuance</TabsTrigger>
          <TabsTrigger value="yield">4. Yield</TabsTrigger>
          <TabsTrigger value="contracts">5. Contracts</TabsTrigger>
          <TabsTrigger value="more">More</TabsTrigger>
        </TabsList>

        <TabsContent value="introduction" className="space-y-6 py-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
              <p className="mb-4">
                Traditional bonds promise predetermined returns, decoupled from underlying economic activity. In
                contrast, Chrononomic Finance bonds accrue χ only when <strong>network infrastructure</strong>,{" "}
                <strong>liquidity</strong>, <strong>compute capacity</strong>, <strong>market-making</strong>,{" "}
                <strong>research</strong>, or <strong>oracle services</strong> generate value. This alignment ensures
                holders share in upside performance while preserving systemic resilience.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="framework" className="space-y-6 py-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">2. Bond Class Framework</h2>
              <p className="mb-4">Each bond class shares these common attributes:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>
                  <strong>Denominations:</strong> 100…10 000 χ (100 χ increments)
                </li>
                <li>
                  <strong>Token Standard:</strong> ERC-1155 multi-token for efficient minting and trading
                </li>
                <li>
                  <strong>Subscription Windows:</strong> Quarterly, 14-day windows via the Chronon Exchange portal
                </li>
                <li>
                  <strong>Redemption:</strong> On-chain <code>redeem()</code> burns tokens and disburses principal +
                  accrued yields
                </li>
              </ul>

              <p className="mb-4">Below is a summary of each class:</p>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] text-center">Class</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Maturity</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Special Feature</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold text-center">ℤ</TableCell>
                      <TableCell>Core Chronon infrastructure</TableCell>
                      <TableCell>5 χ-years</TableCell>
                      <TableCell>Low–Med</TableCell>
                      <TableCell>Early-redemption at 3 χ-years (95% consensus)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold text-center">𝕏</TableCell>
                      <TableCell>Exchange liquidity expansion</TableCell>
                      <TableCell>3 χ-years</TableCell>
                      <TableCell>Medium</TableCell>
                      <TableCell>Auto-rollover into next series</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold text-center">ℂℚ</TableCell>
                      <TableCell>Quantum-compute infrastructure funding</TableCell>
                      <TableCell>7 χ-years</TableCell>
                      <TableCell>Med–High</TableCell>
                      <TableCell>Upgrade-Swap rights on PFLOPS milestones</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold text-center">𝕄</TableCell>
                      <TableCell>Market-making & derivatives support</TableCell>
                      <TableCell>2 χ-years</TableCell>
                      <TableCell>High</TableCell>
                      <TableCell>Protective-Put coupon on market drawdowns</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold text-center">ℝ</TableCell>
                      <TableCell>R&D for new Chronon protocols</TableCell>
                      <TableCell>10 χ-years</TableCell>
                      <TableCell>Very High</TableCell>
                      <TableCell>Royalty-Swap into fixed χ tranche</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold text-center">𝕎</TableCell>
                      <TableCell>Weather & event-hedging oracle services</TableCell>
                      <TableCell>4 χ-years</TableCell>
                      <TableCell>Medium</TableCell>
                      <TableCell>Adaptive coupon tied to δₜ deviation</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issuance" className="space-y-6 py-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">3. Issuance Mechanics</h2>
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <p className="font-medium">Subscription & Allocation</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Open quarterly for 14 days.</li>
                    <li>Minimum 100 χ; oversubscription is pro-rata.</li>
                  </ul>
                </li>
                <li>
                  <p className="font-medium">On-Chain Minting</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      <code>XBondFactory</code>, <code>ZBondFactory</code>, etc., handle issuance windows and minting of
                      ERC-1155 tokens.
                    </li>
                  </ul>
                </li>
                <li>
                  <p className="font-medium">Principal Custody</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Each class vault (e.g., <code>ZBondVault</code>) holds principal χ and routes relevant revenue
                      streams into class-specific pools.
                    </li>
                  </ul>
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yield" className="space-y-6 py-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">4. Yield Calculation & Distribution</h2>
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <p className="font-medium">Frequency:</p>
                  <p>Quarterly for all classes.</p>
                </li>
                <li>
                  <p className="font-medium">Data Feeds:</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      <strong>Fee Oracle:</strong> Aggregates network, exchange, compute, or oracle fees.
                    </li>
                    <li>
                      <strong>Volatility Oracle:</strong> Supplies 30-day χ volatility.
                    </li>
                    <li>
                      <strong>Reserve Oracle:</strong> Tracks reserve levels and utilization.
                    </li>
                  </ul>
                </li>
                <li>
                  <p className="font-medium">Payout Logic:</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Each class contract computes its share of revenue and any performance bonuses.</li>
                    <li>Circuit breakers pause payouts if reserves drop below class-specific thresholds.</li>
                  </ul>
                </li>
                <li>
                  <p className="font-medium">Rollover & Redemption:</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Holders may elect rollover into next-gen series or redeem at maturity.</li>
                  </ul>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6 py-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">5. Smart-Contract Architecture</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Factory Contracts:</strong> Manage issuance schedules and subscription logic.
                </li>
                <li>
                  <strong>Vault Contracts:</strong> Secure χ principal, route inflows, and record performance metrics.
                </li>
                <li>
                  <strong>Payout Contracts:</strong> Execute yield formulas, manage rollover elections, and handle
                  redemptions.
                </li>
                <li>
                  <strong>Auditing & Verification:</strong> Continuous fuzz testing, formal proofs on core algorithms,
                  and annual third-party audits.
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="more" className="space-y-6 py-4">
          <Tabs defaultValue="market" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="market">6. Market</TabsTrigger>
              <TabsTrigger value="risk">7. Risk</TabsTrigger>
              <TabsTrigger value="governance">8. Governance</TabsTrigger>
            </TabsList>

            <TabsContent value="market" className="space-y-6 py-4">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">6. Secondary Market & Liquidity</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Peer-to-Peer Trading:</strong> ERC-1155 bonds trade on Chronon DEXes and supporting CEX
                      platforms.
                    </li>
                    <li>
                      <strong>Reinvestment Mechanism:</strong> Up to 10% of quarterly yields may be allocated to
                      on-chain liquidity pools to deepen market depth.
                    </li>
                    <li>
                      <strong>Insurance Backstop:</strong> A communal insurance pool (funded by 1% of all class fees)
                      covers up to 5% of lost payouts during extreme events.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6 py-4">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">7. Risk Management</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Circuit Breakers:</strong> Class-specific reserve thresholds trigger temporary payout
                      suspension.
                    </li>
                    <li>
                      <strong>Insurance & Backstop:</strong> Shared pool protects against smart-contract exploits or
                      catastrophic market stress.
                    </li>
                    <li>
                      <strong>Parameter Governance:</strong> On-chain votes by FNBC token holders adjust class
                      parameters (fee shares, bonus thresholds) to respond to evolving ecosystem needs.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="governance" className="space-y-6 py-4">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">8. Governance & Compliance</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>On-Chain Governance:</strong> FNBC community proposals and votes manage protocol upgrades.
                    </li>
                    <li>
                      <strong>Regulatory Alignment:</strong> Performance-based yields and transparent reporting ensure
                      compliance with global securities frameworks.
                    </li>
                    <li>
                      <strong>Transparency:</strong> All vault balances, fee inflows, payout records, and vote outcomes
                      are publicly accessible on the Chronon Analytics dashboard.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">9. Conclusion</h2>
              <p className="mb-4">
                The suite of Chrononomic Finance bond classes offers tailored, performance-aligned financing solutions
                across infrastructure, liquidity, compute, markets, research, and oracle domains. By tokenizing economic
                activity into χ-denominated yields, these instruments foster true alignment between investors and
                network growth—catalyzing a resilient, time-value-driven financial ecosystem.
              </p>
              <p className="text-sm text-muted-foreground italic">
                For technical integration details, refer to the Chrononomic Finance developer repository and
                class-specific contract documentation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
