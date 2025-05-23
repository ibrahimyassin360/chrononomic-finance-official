import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, BarChart2 } from "lucide-react"

export const metadata = {
  title: "Bonds | Chrononomic Finance",
  description: "Explore and manage your Chrononomic Finance bonds.",
}

export default function BondsPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chrononomic Bonds</h1>
          <p className="text-muted-foreground mt-1">Explore and manage your time-based financial instruments.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/bonds/classes">
            <Button variant="outline" className="flex items-center gap-2 hover-effect">
              View Bond Classes
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/bonds/compare">
            <Button className="flex items-center gap-2 hover-effect">
              <BarChart2 className="h-4 w-4" />
              Compare Bonds
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Bonds</CardTitle>
            <CardDescription>View and manage your current bond holdings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/bonds/holdings">
              <Button variant="outline" className="w-full hover-effect">
                View My Bonds
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Bonds</CardTitle>
            <CardDescription>Invest in new Chrononomic bonds.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/bonds/purchase">
              <Button variant="outline" className="w-full hover-effect">
                Purchase Bonds
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bond Classes</CardTitle>
            <CardDescription>Learn about the different types of bonds available.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/bonds/classes">
              <Button variant="outline" className="w-full hover-effect">
                Explore Bond Classes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compare Bonds</CardTitle>
            <CardDescription>Compare different bond options side by side.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/bonds/compare">
              <Button variant="outline" className="w-full hover-effect">
                Compare Bonds
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Custom Bond</CardTitle>
            <CardDescription>Design and create your own custom bond.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/bonds/create">
              <Button variant="outline" className="w-full hover-effect">
                Create Bond
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bond Analytics</CardTitle>
            <CardDescription>View analytics and performance data for bonds.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/bonds/analytics">
              <Button variant="outline" className="w-full hover-effect">
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
