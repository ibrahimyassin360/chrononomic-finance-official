"use client"

import dynamic from "next/dynamic"

// Dynamically import components with no SSR
const WalletSection = dynamic(() => import("@/components/wallet-section"), {
  ssr: false,
  loading: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="h-[200px] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
        <p className="text-muted-foreground">Loading wallet interface...</p>
      </div>
      <div className="h-[200px] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
        <p className="text-muted-foreground">Loading token balance...</p>
      </div>
    </div>
  ),
})

export default function HomeWalletSectionWrapper() {
  return <WalletSection />
}
