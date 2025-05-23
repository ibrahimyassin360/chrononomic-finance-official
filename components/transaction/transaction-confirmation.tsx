import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { TransactionDetails } from "@/types/transaction"

interface TransactionConfirmationProps {
  details: TransactionDetails
}

export default function TransactionConfirmation({ details }: TransactionConfirmationProps) {
  const formatCurrency = (value: string, currency: string) => {
    switch (currency) {
      case "eth":
        return `${value} ETH`
      case "chronon":
        return `${value} χ`
      case "usd":
        return `$${value}`
      default:
        return value
    }
  }

  // Determine if slippage is high
  const isHighSlippage = details.slippage > 1.0

  // Determine if price impact is high
  const isPriceImpactHigh = details.priceImpact && details.priceImpact > 1.0
  const isPriceImpactVeryHigh = details.priceImpact && details.priceImpact > 3.0

  return (
    <div className="space-y-4 py-2">
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">You {details.type === "buy" ? "pay" : "sell"}</span>
          <span className="text-xl font-medium">{formatCurrency(details.inputAmount, details.inputCurrency)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">You {details.type === "buy" ? "receive" : "get"}</span>
          <span className="text-xl font-medium">{formatCurrency(details.outputAmount, details.outputCurrency)}</span>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-medium">Transaction Details</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Rate</span>
            <span>
              1 χ ={" "}
              {details.type === "buy"
                ? (Number(details.inputAmount) / Number(details.outputAmount)).toFixed(6)
                : (Number(details.outputAmount) / Number(details.inputAmount)).toFixed(6)}{" "}
              ETH
            </span>
          </div>

          {details.type === "buy" && details.minReceived && (
            <div className="flex justify-between">
              <span className="text-gray-500">Minimum received</span>
              <span>{formatCurrency(details.minReceived, "chronon")}</span>
            </div>
          )}

          {details.type === "sell" && details.maxSold && (
            <div className="flex justify-between">
              <span className="text-gray-500">Maximum sold</span>
              <span>{formatCurrency(details.maxSold, "eth")}</span>
            </div>
          )}

          {details.priceImpact !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-500">Price Impact</span>
              <span className={`${isPriceImpactVeryHigh ? "text-red-500" : isPriceImpactHigh ? "text-amber-500" : ""}`}>
                {details.priceImpact}%
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-500">Slippage Tolerance</span>
            <span className={isHighSlippage ? "text-amber-500" : ""}>{details.slippage}%</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Network Fee</span>
            <span>
              {details.estimatedGas.eth} ETH (${details.estimatedGas.usd})
            </span>
          </div>
        </div>
      </div>

      {isHighSlippage && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Your slippage tolerance is set to {details.slippage}%. Higher values may result in a worse rate.
          </AlertDescription>
        </Alert>
      )}

      {isPriceImpactVeryHigh && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Price impact is very high. This trade will significantly move the market price.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
