import TransactionButton from "@/components/transaction/transaction-button"
import PriceTicker from "@/components/price-ticker"

export default function TransactionsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Chronon Exchange</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Chronon Price:</span>
            <PriceTicker showUsd showEth />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Buy Chronon</h2>
            <p className="text-gray-600 mb-6">
              Purchase Chronon tokens with ETH. Chronon is the native token of the Chrononomic Finance ecosystem.
            </p>
            <TransactionButton type="buy" className="w-full">
              Buy Chronon
            </TransactionButton>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sell Chronon</h2>
            <p className="text-gray-600 mb-6">Convert your Chronon tokens back to ETH at the current market rate.</p>
            <TransactionButton type="sell" className="w-full">
              Sell Chronon
            </TransactionButton>
          </div>
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Real-Time Price Data</h2>
          <p className="text-gray-600 mb-6">
            The transaction modal uses Chainlink price oracles to provide real-time price data for Chronon and ETH. This
            ensures you always get the most accurate and up-to-date prices for your transactions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Chronon Price (USD)</h3>
              <div className="text-2xl font-bold">
                <PriceTicker showUsd />
              </div>
              <p className="text-sm text-gray-500 mt-2">Updated every 30 seconds via Chainlink price feeds</p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Chronon Price (ETH)</h3>
              <div className="text-2xl font-bold">
                <PriceTicker showEth />
              </div>
              <p className="text-sm text-gray-500 mt-2">Calculated from ETH/USD and CHRONON/USD price feeds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
