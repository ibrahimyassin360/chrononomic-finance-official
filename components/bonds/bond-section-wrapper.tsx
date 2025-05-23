"use client"

import dynamic from "next/dynamic"

// Dynamically import components with no SSR
const BondSection = dynamic(() => import("@/components/bonds/bond-section"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
      <p className="text-muted-foreground">Loading bond information...</p>
    </div>
  ),
})

export default function BondSectionWrapper() {
  return <BondSection />
}
