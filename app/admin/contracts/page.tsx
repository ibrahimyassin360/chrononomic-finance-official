import { ContractDeployment } from "@/components/admin/contract-deployment"
import { NetworkSwitcher } from "@/components/network-switcher"

export default function ContractsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Contract Management</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ContractDeployment />
        </div>
        <div>
          <NetworkSwitcher />
        </div>
      </div>
    </div>
  )
}
