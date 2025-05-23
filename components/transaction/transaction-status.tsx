"use client"

import { AlertCircle, CheckCircle, Loader2, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"

type TransactionState = {
  status: "pending" | "mining" | "success" | "failed"
  hash?: string
  error?: string
  confirmation?: number
}

interface TransactionStatusProps {
  transaction: TransactionState
  onDismiss?: () => void
}

export function TransactionStatus({ transaction, onDismiss }: TransactionStatusProps) {
  const { chainId } = useWallet()

  const getExplorerUrl = (hash: string) => {
    if (!chainId || !hash) return "#"

    let baseUrl = "https://etherscan.io"

    if (chainId === 5) {
      baseUrl = "https://goerli.etherscan.io"
    } else if (chainId === 11155111) {
      baseUrl = "https://sepolia.etherscan.io"
    } else if (chainId === 80001) {
      baseUrl = "https://mumbai.polygonscan.com"
    }

    return `${baseUrl}/tx/${hash}`
  }

  if (transaction.status === "pending") {
    return (
      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <AlertTitle>Waiting for confirmation</AlertTitle>
        <AlertDescription>Please confirm the transaction in your wallet...</AlertDescription>
      </Alert>
    )
  }

  if (transaction.status === "mining") {
    return (
      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <AlertTitle>Transaction in progress</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <span>Your transaction is being processed on the blockchain...</span>
          {transaction.hash && (
            <a
              href={getExplorerUrl(transaction.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              View on Explorer <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  if (transaction.status === "success") {
    return (
      <Alert className="bg-green-50 text-green-800 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>Transaction successful</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <span>Your transaction has been confirmed on the blockchain.</span>
          {transaction.hash && (
            <a
              href={getExplorerUrl(transaction.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-green-600 hover:text-green-800 text-sm"
            >
              View on Explorer <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
          {onDismiss && (
            <Button variant="outline" size="sm" onClick={onDismiss} className="mt-2 self-end">
              Dismiss
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  if (transaction.status === "failed") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Transaction failed</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <span>{transaction.error || "There was an error processing your transaction."}</span>
          {transaction.hash && (
            <a
              href={getExplorerUrl(transaction.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-red-300 hover:text-red-200 text-sm"
            >
              View on Explorer <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
          {onDismiss && (
            <Button variant="outline" size="sm" onClick={onDismiss} className="mt-2 self-end">
              Dismiss
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
