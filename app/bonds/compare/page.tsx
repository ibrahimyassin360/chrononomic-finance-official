import { BondComparisonTool } from "@/components/bonds/comparison/bond-comparison-tool"

export const metadata = {
  title: "Bond Comparison Tool | Chrononomic Finance",
  description: "Compare different bond classes to find the best investment for your needs.",
}

export default function BondComparePage() {
  return (
    <div className="container py-8">
      <BondComparisonTool />
    </div>
  )
}
