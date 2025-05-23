import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart2 } from "lucide-react"
import { type BondClass, BOND_CLASSES } from "@/types/bond-classes"

export const metadata = {
  title: "Bond Classes | Chrononomic Finance",
  description: "Explore the different classes of bonds available in the Chrononomic Finance ecosystem.",
}

export default function BondClassesPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bond Classes</h1>
          <p className="text-muted-foreground mt-1">
            Explore the different classes of bonds available in the Chrononomic Finance ecosystem.
          </p>
        </div>

        <Link href="/bonds/compare">
          <Button className="flex items-center gap-2 hover-effect">
            <BarChart2 className="h-4 w-4" />
            Compare Bond Classes
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.keys(BOND_CLASSES) as BondClass[]).map((bondClass) => (
          <Link key={bondClass} href={`/bonds/classes/${bondClass}`} className="group">
            <div
              className={`rounded-lg border p-6 shadow-sm transition-all hover:shadow-md hover:border-${BOND_CLASSES[bondClass].color}-300 hover:bg-${BOND_CLASSES[bondClass].color}-50`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full bg-${BOND_CLASSES[bondClass].color}-100 text-${BOND_CLASSES[bondClass].color}-700`}
                >
                  <span className="text-2xl font-bold">{BOND_CLASSES[bondClass].symbol}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{BOND_CLASSES[bondClass].name}</h3>
                  <p className="text-sm text-muted-foreground">{BOND_CLASSES[bondClass].purpose}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Maturity:</span>
                  <span>{BOND_CLASSES[bondClass].maturity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk:</span>
                  <span>{BOND_CLASSES[bondClass].risk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Special Feature:</span>
                </div>
                <div>
                  <span className="text-xs">{BOND_CLASSES[bondClass].specialFeature}</span>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="ghost"
                  className={`w-full text-${BOND_CLASSES[bondClass].color}-700 hover:bg-${BOND_CLASSES[bondClass].color}-100 hover-effect`}
                >
                  View Details
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
