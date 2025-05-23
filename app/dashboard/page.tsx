import { Suspense } from "react"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { DashboardContentWrapper } from "@/components/dashboard/dashboard-content-wrapper"
import { GrokChatWidget } from "@/components/dashboard/grok-chat-widget"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <DashboardContentWrapper>
              <DashboardContent />
            </DashboardContentWrapper>
          </Suspense>
        </div>

        <div>
          <GrokChatWidget />
        </div>
      </div>
    </div>
  )
}
