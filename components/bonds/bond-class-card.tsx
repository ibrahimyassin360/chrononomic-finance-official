import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { BondClassDetails } from "@/types/bond-classes"
import Link from "next/link"

interface BondClassCardProps {
  bondClass: BondClassDetails
  compact?: boolean
}

const getBadgeVariant = (risk: string) => {
  if (risk.includes("Low")) return "outline"
  if (risk.includes("Medium")) return "secondary"
  if (risk.includes("High")) return "destructive"
  return "default"
}

const getColorClass = (color: string) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700",
    green: "bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700",
    purple: "bg-purple-100 border-purple-300 dark:bg-purple-900 dark:border-purple-700",
    orange: "bg-orange-100 border-orange-300 dark:bg-orange-900 dark:border-orange-700",
    red: "bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700",
    teal: "bg-teal-100 border-teal-300 dark:bg-teal-900 dark:border-teal-700",
  }
  return colors[color] || "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
}

const getTextColorClass = (color: string) => {
  const textColors: Record<string, string> = {
    blue: "text-blue-900 dark:text-blue-100",
    green: "text-green-900 dark:text-green-100",
    purple: "text-purple-900 dark:text-purple-100",
    orange: "text-orange-900 dark:text-orange-100",
    red: "text-red-900 dark:text-red-100",
    teal: "text-teal-900 dark:text-teal-100",
  }
  return textColors[color] || "text-gray-900 dark:text-gray-100"
}

export function BondClassCard({ bondClass, compact = false }: BondClassCardProps) {
  if (compact) {
    return (
      <Card className={`border-2 ${getColorClass(bondClass.color)}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center font-medium">
            <CardTitle className={`text-2xl ${getTextColorClass(bondClass.color)}`}>{bondClass.symbol}</CardTitle>
            <Badge variant={getBadgeVariant(bondClass.risk)}>{bondClass.risk}</Badge>
          </div>
          <CardDescription className="text-black dark:text-white font-medium">{bondClass.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-800 dark:text-gray-200">{bondClass.purpose}</p>
          <div className="flex justify-between items-center mt-2 text-sm font-medium text-gray-800 dark:text-gray-200">
            <span>Maturity: {bondClass.maturity}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline" className="w-full" asChild>
            <Link href={`/bonds/classes/${bondClass.symbol.toLowerCase()}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className={`border-2 ${getColorClass(bondClass.color)}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className={`text-3xl ${getTextColorClass(bondClass.color)}`}>{bondClass.symbol}</CardTitle>
          <Badge variant={getBadgeVariant(bondClass.risk)}>{bondClass.risk}</Badge>
        </div>
        <CardDescription className="text-lg text-black dark:text-white font-medium">{bondClass.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-800 dark:text-gray-200">{bondClass.description}</p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="space-y-1">
            <p className="font-medium text-black dark:text-white">Purpose</p>
            <p className="text-gray-800 dark:text-gray-200">{bondClass.purpose}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-black dark:text-white">Maturity</p>
            <p className="text-gray-800 dark:text-gray-200">{bondClass.maturity}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-black dark:text-white">Collateral</p>
            <p className="text-gray-800 dark:text-gray-200">{bondClass.collateral}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-black dark:text-white">Yield Sources</p>
            <p className="text-gray-800 dark:text-gray-200">{bondClass.yieldSources}</p>
          </div>
        </div>

        <div className="pt-2">
          <p className="font-medium text-sm text-black dark:text-white">Special Feature</p>
          <p className="text-sm text-gray-800 dark:text-gray-200">{bondClass.specialFeature}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/whitepaper/bond-classes">Learn More</Link>
        </Button>
        <Button asChild>
          <Link href={`/bonds/purchase?class=${bondClass.symbol.toLowerCase()}`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
