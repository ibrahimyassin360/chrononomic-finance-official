import type { TransactionDetails } from "@/types/transaction"
import { CheckCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TransactionSuccessProps {
  hash: string
  details?: TransactionDetails | null
}

export default function TransactionSuccess({ hash, details }: TransactionSuccessProps) {
  // In a real app, this would be the block explorer URL for the network you're using
  const explorerUrl = `https://sepolia.etherscan.io/tx/${hash}`

  return (
    <div className="space-y-4 my-4">
      <div className="flex flex-col items-center justify-center">
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <h3 className="text-xl font-semibold text-center">Transaction Submitted</h3>

        {details && (
          <p className="text-center mt-2">
            {details.type === "buy"
              ? `You have successfully purchased ${Number.parseFloat(details.outputAmount).toFixed(6)} χ`
              : `You have successfully sold ${details.inputAmount} χ`}
          </p>
        )}
      </div>

      <div className="bg-gray-50 rounded-md p-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Transaction Hash</span>
          <span className="text-sm font-mono truncate max-w-[200px]">
            {hash.substring(0, 10)}...{hash.substring(hash.length - 8)}
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <Button variant="outline" className="flex items-center gap-2" asChild>
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            View on Explorer <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        It may take a few minutes for your transaction to be confirmed on the blockchain.
      </div>
    </div>
  )
}
