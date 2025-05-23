"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus, Repeat, Clock, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common actions you can take</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="flex h-24 flex-col items-center justify-center space-y-2" asChild>
            <Link href="/products/fixed-rate-bonds">
              <Plus className="h-5 w-5" />
              <span className="text-xs">Buy Bonds</span>
            </Link>
          </Button>

          <Button variant="outline" className="flex h-24 flex-col items-center justify-center space-y-2" asChild>
            <Link href="/products/ritual-bonds">
              <Clock className="h-5 w-5" />
              <span className="text-xs">Ritual Bonds</span>
            </Link>
          </Button>

          <Button variant="outline" className="flex h-24 flex-col items-center justify-center space-y-2" asChild>
            <Link href="/products/chronon-token">
              <Repeat className="h-5 w-5" />
              <span className="text-xs">Swap Tokens</span>
            </Link>
          </Button>

          <Button variant="outline" className="flex h-24 flex-col items-center justify-center space-y-2" asChild>
            <Link href="/resources/documentation">
              <ArrowUpRight className="h-5 w-5" />
              <span className="text-xs">Learn More</span>
            </Link>
          </Button>
        </div>

        <div className="mt-4">
          <Button className="w-full" asChild>
            <Link href="/products">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
