"use client"

import dynamic from "next/dynamic"

// Dynamically import components with no SSR
const DashboardContent = dynamic(() => import("@/components/dashboard/dashboard-content"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
      <p className="text-muted-foreground">Loading dashboard...</p>
    </div>
  ),
})

export function DashboardContentWrapper() {
  return <DashboardContent />
}

export default DashboardContentWrapper
