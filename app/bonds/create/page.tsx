import { BondCreator } from "@/components/bonds/bond-creator"

export const metadata = {
  title: "Create Temporal Bond | Chrononomic Finance",
  description: "Create a fixed-rate temporal bond with customizable parameters",
}

export default function BondCreatorPage() {
  return (
    <div className="container py-8">
      <BondCreator />
    </div>
  )
}
