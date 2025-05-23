"use client"

import { useParams } from "next/navigation"
import { BOND_CLASSES, type BondClass } from "@/types/bond-classes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, TrendingUp, Shield, Clock } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BondClassDetailPage() {
  const params = useParams()
  const symbol = params.symbol as string
  const upperSymbol = symbol.toUpperCase() as BondClass

  // Check if the bond class exists
  if (!BOND_CLASSES[upperSymbol]) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-4">Bond Class Not Found</h1>
        <p className="mb-6">The bond class you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/bonds/classes">View All Bond Classes</Link>
        </Button>
      </div>
    )
  }

  const bondClass = BOND_CLASSES[upperSymbol]

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-50 border-blue-200",
      green: "bg-green-50 border-green-200",
      purple: "bg-purple-50 border-purple-200",
      orange: "bg-orange-50 border-orange-200",
      red: "bg-red-50 border-red-200",
      teal: "bg-teal-50 border-teal-200",
    }
    return colors[color] || "bg-gray-50 border-gray-200"
  }

  const getBadgeVariant = (risk: string) => {
    if (risk.includes("Low")) return "outline"
    if (risk.includes("Medium")) return "secondary"
    if (risk.includes("High")) return "destructive"
    return "default"
  }

  // Mock data for yield history
  const yieldHistory = [
    { quarter: "Q1 2025", yield: "2.3%", bonus: "0.5%", total: "2.8%" },
    { quarter: "Q2 2025", yield: "2.5%", bonus: "0.7%", total: "3.2%" },
    { quarter: "Q3 2025", yield: "2.4%", bonus: "0.4%", total: "2.8%" },
    { quarter: "Q4 2025", yield: "2.6%", bonus: "0.8%", total: "3.4%" },
  ]

  // Mock data for issuance schedule
  const issuanceSchedule = [
    { series: "Series 1", openDate: "Jan 1, 2025", closeDate: "Jan 14, 2025", amount: "1,000,000 χ", status: "Closed" },
    { series: "Series 2", openDate: "Apr 1, 2025", closeDate: "Apr 14, 2025", amount: "1,500,000 χ", status: "Closed" },
    { series: "Series 3", openDate: "Jul 1, 2025", closeDate: "Jul 14, 2025", amount: "2,000,000 χ", status: "Open" },
    {
      series: "Series 4",
      openDate: "Oct 1, 2025",
      closeDate: "Oct 14, 2025",
      amount: "2,500,000 χ",
      status: "Upcoming",
    },
  ]

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/bonds/classes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bond Classes
          </Link>
        </Button>
        <Button asChild>
          <Link href="/whitepaper/bond-classes">
            <FileText className="mr-2 h-4 w-4" />
            View Whitepaper
          </Link>
        </Button>
      </div>

      <Card className={`border-2 ${getColorClass(bondClass.color)}`}>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <CardTitle className="text-4xl">{bondClass.symbol}</CardTitle>
                <Badge variant={getBadgeVariant(bondClass.risk)}>{bondClass.risk}</Badge>
              </div>
              <CardDescription className="text-xl mt-1">{bondClass.name}</CardDescription>
            </div>
            <Button size="lg" asChild>
              <Link href={`/bonds/purchase?class=${bondClass.symbol.toLowerCase()}`}>Purchase Bond</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg">{bondClass.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                  Maturity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{bondClass.maturity}</p>
                <p className="text-sm text-muted-foreground mt-1">Time until principal return</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="mr-2 h-5 w-5 text-muted-foreground" />
                  Yield Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{bondClass.yieldSources}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
                  Special Feature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{bondClass.specialFeature}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="yield">Yield History</TabsTrigger>
              <TabsTrigger value="issuance">Issuance Schedule</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h3 className="font-medium mb-2">Purpose</h3>
                  <p className="text-muted-foreground">{bondClass.purpose}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Collateral</h3>
                  <p className="text-muted-foreground">{bondClass.collateral}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Yield Sources</h3>
                  <p className="text-muted-foreground">{bondClass.yieldSources}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Risk Profile</h3>
                  <p className="text-muted-foreground">{bondClass.risk}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Contract Addresses</h3>
                <div className="space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <p className="font-medium">Bond Factory</p>
                      <p className="text-xs text-muted-foreground">Creates and issues new bonds</p>
                    </div>
                    <code className="text-xs md:text-sm bg-background p-1 rounded mt-1 md:mt-0">0x1234...5678</code>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <p className="font-medium">Bond Vault</p>
                      <p className="text-xs text-muted-foreground">Holds principal and manages yield</p>
                    </div>
                    <code className="text-xs md:text-sm bg-background p-1 rounded mt-1 md:mt-0">0x8765...4321</code>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <p className="font-medium">Payout Contract</p>
                      <p className="text-xs text-muted-foreground">Handles yield distribution</p>
                    </div>
                    <code className="text-xs md:text-sm bg-background p-1 rounded mt-1 md:mt-0">0xabcd...ef01</code>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="yield" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quarterly Yield History</CardTitle>
                  <CardDescription>Historical yield performance for {bondClass.symbol} bonds</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quarter</TableHead>
                        <TableHead>Base Yield</TableHead>
                        <TableHead>Performance Bonus</TableHead>
                        <TableHead className="text-right">Total Yield</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yieldHistory.map((item) => (
                        <TableRow key={item.quarter}>
                          <TableCell className="font-medium">{item.quarter}</TableCell>
                          <TableCell>{item.yield}</TableCell>
                          <TableCell>{item.bonus}</TableCell>
                          <TableCell className="text-right font-bold">{item.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="issuance" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Issuance Schedule</CardTitle>
                  <CardDescription>Upcoming and past issuance windows for {bondClass.symbol} bonds</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Series</TableHead>
                        <TableHead>Open Date</TableHead>
                        <TableHead>Close Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {issuanceSchedule.map((item) => (
                        <TableRow key={item.series}>
                          <TableCell className="font-medium">{item.series}</TableCell>
                          <TableCell>{item.openDate}</TableCell>
                          <TableCell>{item.closeDate}</TableCell>
                          <TableCell>{item.amount}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                item.status === "Open" ? "default" : item.status === "Closed" ? "secondary" : "outline"
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
