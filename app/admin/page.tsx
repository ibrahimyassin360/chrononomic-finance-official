import { AdminLayout } from "@/components/admin/admin-layout"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentActivity } from "@/components/admin/recent-activity"
import { SystemSettings } from "@/components/admin/system-settings"

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <DashboardStats />
        <div className="grid gap-8 md:grid-cols-2">
          <RecentActivity />
          <SystemSettings />
        </div>
      </div>
    </AdminLayout>
  )
}
