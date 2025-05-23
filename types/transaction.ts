export type TransactionType = "buy" | "sell"

export interface PriceData {
  chronon: {
    usd: number
    eth: number
  }
  eth: {
    usd: number
  }
  lastUpdated: Date
}

export interface TransactionSettings {
  slippageTolerance: number
  deadline: number
  gasPreset: "standard" | "fast" | "instant"
}

export interface TransactionDetails {
  type: TransactionType
  inputAmount: string
  inputCurrency: "eth" | "usd" | "chronon"
  outputAmount: string
  outputCurrency: "eth" | "usd" | "chronon"
  slippage: number
  estimatedGas: {
    eth: string
    usd: string
  }
  minReceived?: string
  maxSold?: string
  priceImpact?: number
}

export interface TransactionState {
  isLoading: boolean
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
  hash: string | null
}
