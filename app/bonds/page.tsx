import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BondClassCard } from "@/components/bonds/bond-class-card"
import { BOND_CLASSES } from "@/types/bond-classes"
import Link from "next/link"
import { FileText, Plus } from "lucide-react"

export default function BondsPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chrononomic Bonds</h1>
          <p className="text-muted-foreground">Explore and manage your bond holdings across all bond classes</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/whitepaper/bond-classes">
              <FileText className="mr-2 h-4 w-4" />
              Whitepaper
            </Link>
          </Button>
          <Button asChild>
            <Link href="/bonds/purchase">
              <Plus className="mr-2 h-4 w-4" />
              Purchase Bond
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="holdings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="holdings">Your Holdings</TabsTrigger>
          <TabsTrigger value="classes">Bond Classes</TabsTrigger>
          <TabsTrigger value="market">Bond Market</TabsTrigger>
        </TabsList>
        <TabsContent value="holdings" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Bond Holdings</CardTitle>
              <CardDescription>View and manage your current bond investments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                You don't have any bonds yet. Purchase a bond to get started.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/bonds/purchase">Purchase Your First Bond</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(BOND_CLASSES).map((bondClass) => (
              <BondClassCard key={bondClass.symbol} bondClass={bondClass} compact />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button size="lg" asChild>
              <Link href="/bonds/classes">View All Bond Classes</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="market" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bond Market</CardTitle>
              <CardDescription>Trade bonds on the secondary market</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                The bond market is coming soon. Check back later for updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
