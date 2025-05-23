import { BondClassCard } from "@/components/bonds/bond-class-card"
import { BOND_CLASSES } from "@/types/bond-classes"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

export default function BondClassesPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bond Classes</h1>
          <p className="text-muted-foreground">Explore the six foundational bond classes of Chrononomic Finance</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/bonds">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Bonds
            </Link>
          </Button>
          <Button asChild>
            <Link href="/whitepaper/bond-classes">
              <FileText className="mr-2 h-4 w-4" />
              View Whitepaper
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(BOND_CLASSES).map((bondClass) => (
          <BondClassCard key={bondClass.symbol} bondClass={bondClass} />
        ))}
      </div>
    </div>
  )
}
