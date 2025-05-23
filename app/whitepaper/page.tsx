import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, BookOpen, History, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function WhitepaperPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tighter">Chrononomic Finance Whitepaper</h1>
        <p className="text-xl text-muted-foreground max-w-[800px]">Version 2.0 - The Evolution of Time-Based Assets</p>
        <div className="flex gap-4">
          <Button size="lg">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
          <Button variant="outline" size="lg">
            <FileText className="mr-2 h-4 w-4" /> View Previous Versions
          </Button>
        </div>
      </div>

      <Card className="mb-8 border-2 border-amber-200 bg-amber-50">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-amber-600 mr-4" />
              <div>
                <h3 className="text-lg font-bold">New: Bond Classes Whitepaper</h3>
                <p className="text-muted-foreground">Explore our six new bond classes with performance-based yields</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/whitepaper/bond-classes">
                View Bond Classes <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
          <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6 py-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Introduction to Chrononomic Finance v2.0</h2>
              <p className="mb-4">
                Chrononomic Finance represents a paradigm shift in how we conceptualize, tokenize, and trade time as a
                financial asset. Version 2.0 builds upon our foundational principles while introducing enhanced
                mechanisms for time-value stability, improved ritual participation incentives, and expanded use cases
                for Chronon tokens.
              </p>
              <p className="mb-4">
                The Crystal Oasis Reserve serves as the backbone of our ecosystem, providing liquidity and stability to
                the time-based assets within our platform. With the introduction of Temporal Density Metrics in v2.0,
                we've enhanced our ability to accurately measure and price time-value across different contexts.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">Key Innovations in v2.0</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Enhanced Temporal Density Protocol with multi-chain support</li>
                <li>Improved Ritual Participation Framework with dynamic rewards</li>
                <li>Introduction of Time-Locked Governance mechanisms</li>
                <li>Expanded Bond Creation capabilities with customizable parameters</li>
                <li>Cross-chain Time-Value Oracle Network</li>
                <li>
                  <strong>Six new bond classes with performance-based yields</strong> -{" "}
                  <Link href="/whitepaper/bond-classes" className="text-primary hover:underline">
                    Learn more
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-semibold mb-2">Core Principles</h3>
                <p>
                  Our foundational philosophy remains unchanged: time is the most valuable and universal asset. Version
                  2.0 expands on how we implement this vision with improved technical architecture and economic models.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <History className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-semibold mb-2">Evolution from v1.0</h3>
                <p>
                  The transition to v2.0 represents our response to community feedback, market conditions, and
                  technological advancements. We've maintained our core vision while enhancing scalability, security,
                  and user experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technology" className="space-y-6 py-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Technical Architecture</h2>
              <p className="mb-4">
                Chrononomic Finance v2.0 introduces a multi-layered technical architecture designed for scalability,
                security, and interoperability. Our enhanced smart contract system leverages the latest advancements in
                blockchain technology to provide a robust foundation for time-based financial products.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Temporal Density Protocol v2</h3>
              <p className="mb-4">
                The upgraded Temporal Density Protocol (TDP) introduces advanced algorithms for measuring and valuing
                time across different contexts and applications. TDP v2 supports cross-chain operations, allowing for
                seamless integration with multiple blockchain ecosystems.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Smart Contract Architecture</h3>
              <p>
                Our upgraded contract system features enhanced security measures, optimized gas efficiency, and improved
                modularity. The new architecture supports dynamic parameter adjustments, allowing for more flexible bond
                creation and management.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokenomics" className="space-y-6 py-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Tokenomics & Economic Model</h2>
              <p className="mb-4">
                Version 2.0 introduces refined tokenomics with enhanced mechanisms for value accrual, stability, and
                sustainable growth. The Chronon token remains at the center of our ecosystem, with expanded utility and
                improved distribution mechanisms.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Token Distribution</h3>
              <div className="h-64 bg-muted rounded-md flex items-center justify-center mb-4">
                [Token Distribution Chart Placeholder]
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">Value Accrual Mechanisms</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ritual Participation Rewards</li>
                <li>Bond Creation and Management Fees</li>
                <li>Time-Value Oracle Service Fees</li>
                <li>Governance Participation Incentives</li>
                <li>Ecosystem Development Fund</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6 py-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Roadmap & Future Development</h2>
              <p className="mb-4">
                Our vision extends beyond the current implementation. The roadmap outlines our planned developments and
                expansions for the Chrononomic Finance ecosystem.
              </p>

              <div className="relative border-l-2 border-primary pl-6 space-y-8 my-8">
                <div className="relative">
                  <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-semibold">Q2 2025: Cross-Chain Expansion</h3>
                  <p className="text-muted-foreground">
                    Deploy Chrononomic Finance on additional EVM-compatible chains and implement cross-chain bridge for
                    Chronon tokens.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-semibold">Q3 2025: Governance DAO Launch</h3>
                  <p className="text-muted-foreground">
                    Transition to fully decentralized governance with the introduction of the Chrononomic DAO and
                    governance token.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-semibold">Q4 2025: Institutional Integration</h3>
                  <p className="text-muted-foreground">
                    Launch enterprise solutions for institutional clients and integrate with traditional finance
                    systems.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-semibold">Q1 2026: Mobile Application</h3>
                  <p className="text-muted-foreground">
                    Release mobile applications for iOS and Android with enhanced features for on-the-go time management
                    and trading.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
