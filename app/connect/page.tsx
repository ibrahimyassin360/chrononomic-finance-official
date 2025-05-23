import WalletConnect from "@/components/wallet-connect"
import { RealChrononBalance } from "@/components/real-chronon-balance"

export default function ConnectPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <WalletConnect />
        <RealChrononBalance />
      </div>
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Why Connect Your Wallet?</h2>
        <p className="mb-4">
          Connecting your wallet allows you to interact with the Chrononomic Finance ecosystem and access all features:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>View your real-time Chronon balance</li>
          <li>Participate in Shared-Revenue Time Pools</li>
          <li>Purchase Asset-Backed Time Certificates</li>
          <li>Trade on the Dynamic Time-Lease Marketplace</li>
          <li>Access Cost-Plus Time Financing options</li>
          <li>Convert between Chronons and other currencies</li>
        </ul>
      </div>
    </div>
  )
}
