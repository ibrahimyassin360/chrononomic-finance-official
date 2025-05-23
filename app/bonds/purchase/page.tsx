"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"
import { BondClassCard } from "@/components/bonds/bond-class-card"
import { BOND_CLASSES, type BondClass } from "@/types/bond-classes"

export default function BondPurchasePage() {
  const searchParams = useSearchParams()
  const initialClass = searchParams.get("class")?.toUpperCase() as BondClass | undefined

  const [selectedClass, setSelectedClass] = useState<BondClass | null>(
    initialClass && BOND_CLASSES[initialClass] ? initialClass : null,
  )

  // Set up tabs based on the selected class
  const [activeTab, setActiveTab] = useState<string>(initialClass || "select")

  useEffect(() => {
    if (initialClass && BOND_CLASSES[initialClass]) {
      setSelectedClass(initialClass)
      setActiveTab(initialClass)
    }
  }, [initialClass])

  const handleSelectClass = (bondClass: BondClass) => {
    setSelectedClass(bondClass)
    setActiveTab(bondClass)
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/bonds">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bonds
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/whitepaper/bond-classes">
            <FileText className="mr-2 h-4 w-4" />
            View Whitepaper
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Purchase Bonds</h1>
        <p className="text-muted-foreground">Select a bond class to purchase or learn more about each type</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7">
          <TabsTrigger value="select">Select</TabsTrigger>
          <TabsTrigger value="Z">ℤ</TabsTrigger>
          <TabsTrigger value="X">𝕏</TabsTrigger>
          <TabsTrigger value="CQ">ℂℚ</TabsTrigger>
          <TabsTrigger value="M">𝕄</TabsTrigger>
          <TabsTrigger value="R">ℝ</TabsTrigger>
          <TabsTrigger value="W">𝕎</TabsTrigger>
        </TabsList>

        <TabsContent value="select" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Select a Bond Class</CardTitle>
              <CardDescription>Choose from one of the six Chrononomic Finance bond classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(BOND_CLASSES).map(([key, bondClass]) => (
                  <div key={key} onClick={() => handleSelectClass(key as BondClass)} className="cursor-pointer">
                    <BondClassCard bondClass={bondClass} compact />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {Object.entries(BOND_CLASSES).map(([key, bondClass]) => (
          <TabsContent key={key} value={key} className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <BondClassCard bondClass={bondClass} />
              </div>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Purchase {bondClass.name}</CardTitle>
                  <CardDescription>Configure your bond purchase parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-6">
                    Bond purchase form would go here, with options specific to the {bondClass.symbol} bond class.
                  </p>
                  <Button className="w-full">Purchase Bond</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
