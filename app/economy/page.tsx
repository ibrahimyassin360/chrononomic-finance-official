import { EconomyDashboard } from "@/components/chronon-economy/economy-dashboard"

export default function EconomyPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">χ-Token Economy</h1>
      </div>
      <EconomyDashboard />
    </div>
  )
}
