"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useWallet } from "@/contexts/wallet-provider"
import type {
  TransactionType,
  PriceData,
  TransactionSettings,
  TransactionDetails,
  TransactionState,
} from "@/types/transaction"
import { isBrowser } from "@/lib/environment"
import { getAllPriceData, getGasPrices } from "@/services/price-feed-service"
import { ethers } from "ethers"

// Default transaction settings
const DEFAULT_SETTINGS: TransactionSettings = {
  slippageTolerance: 0.5,
  deadline: 20,
  gasPreset: "standard",
}

// Estimated gas used for transactions
const ESTIMATED_GAS_UNITS = 150000

export function useTransaction() {
  const { account, inPreviewMode } = useWallet()
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [gasPrices, setGasPrices] = useState<{
    standard: number
    fast: number
    instant: number
  } | null>(null)
  const [settings, setSettings] = useState<TransactionSettings>(DEFAULT_SETTINGS)
  const [details, setDetails] = useState<TransactionDetails | null>(null)
  const [state, setState] = useState<TransactionState>({
    isLoading: true,
    isSubmitting: false,
    isSuccess: false,
    error: null,
    hash: null,
  })

  // Refs for tracking mounted state and intervals
  const isMounted = useRef(true)
  const priceRefreshInterval = useRef<NodeJS.Timeout | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
      if (priceRefreshInterval.current) {
        clearInterval(priceRefreshInterval.current)
      }
    }
  }, [])

  // Fetch price data and gas prices
  const fetchPriceData = useCallback(async () => {
    if (!isMounted.current) return

    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      // Fetch price data and gas prices in parallel
      const [prices, gas] = await Promise.all([getAllPriceData(inPreviewMode), getGasPrices(inPreviewMode)])

      if (!isMounted.current) return

      setPriceData(prices)
      setGasPrices(gas)
      setState((prev) => ({ ...prev, isLoading: false, error: null }))
    } catch (error: any) {
      console.error("Error fetching data:", error)

      if (!isMounted.current) return

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Failed to fetch latest price data. Please try again.",
      }))
    }
  }, [inPreviewMode])

  // Initial data fetch and setup refresh interval
  useEffect(() => {
    fetchPriceData()

    // Refresh price data every 30 seconds
    priceRefreshInterval.current = setInterval(fetchPriceData, 30000)

    return () => {
      if (priceRefreshInterval.current) {
        clearInterval(priceRefreshInterval.current)
      }
    }
  }, [fetchPriceData])

  // Calculate transaction details
  const calculateTransaction = useCallback(
    (type: TransactionType, amount: string, inputCurrency: "eth" | "usd" | "chronon") => {
      if (!amount || isNaN(Number.parseFloat(amount)) || !priceData || !gasPrices) {
        setDetails(null)
        return
      }

      const inputAmount = Number.parseFloat(amount)
      let outputAmount = 0
      let outputCurrency: "eth" | "usd" | "chronon" = "chronon"

      // Calculate output amount based on input currency and transaction type
      if (type === "buy") {
        if (inputCurrency === "eth") {
          outputAmount = inputAmount / priceData.chronon.eth
          outputCurrency = "chronon"
        } else if (inputCurrency === "usd") {
          outputAmount = inputAmount / priceData.chronon.usd
          outputCurrency = "chronon"
        }
      } else {
        // sell
        if (inputCurrency === "chronon") {
          outputAmount = inputAmount * priceData.chronon.eth
          outputCurrency = "eth"
        }
      }

      // Calculate gas cost
      const gasPriceGwei = gasPrices[settings.gasPreset]
      const gasEth = (gasPriceGwei * ESTIMATED_GAS_UNITS) / 1e9
      const gasUsd = gasEth * priceData.eth.usd

      // Calculate slippage impact
      const slippageMultiplier = settings.slippageTolerance / 100

      // Calculate min received (for buy) or max sold (for sell) with slippage
      const minReceived = type === "buy" ? (outputAmount * (1 - slippageMultiplier)).toFixed(6) : undefined

      const maxSold = type === "sell" ? (outputAmount * (1 + slippageMultiplier)).toFixed(6) : undefined

      setDetails({
        type,
        inputAmount: amount,
        inputCurrency,
        outputAmount: outputAmount.toFixed(6),
        outputCurrency,
        slippage: settings.slippageTolerance,
        estimatedGas: {
          eth: gasEth.toFixed(6),
          usd: gasUsd.toFixed(2),
        },
        minReceived,
        maxSold,
        priceImpact: calculatePriceImpact(inputAmount, type, inputCurrency),
      })
    },
    [priceData, gasPrices, settings],
  )

  // Calculate price impact for larger orders
  const calculatePriceImpact = useCallback(
    (amount: number, type: TransactionType, currency: string): number => {
      if (!priceData) return 0

      // This is a simplified price impact calculation
      // In production, you would calculate this based on liquidity depth
      let baseAmount = 0

      if (type === "buy" && currency === "eth") {
        baseAmount = amount
      } else if (type === "buy" && currency === "usd") {
        baseAmount = amount / priceData.eth.usd
      } else if (type === "sell" && currency === "chronon") {
        baseAmount = amount * priceData.chronon.eth
      }

      // Simple formula: 0.1% impact per 1 ETH of value, capped at 5%
      const impact = Math.min(baseAmount * 0.001 * 100, 5)
      return Number(impact.toFixed(2))
    },
    [priceData],
  )

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<TransactionSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }, [])

  // Execute transaction
  const executeTransaction = useCallback(async () => {
    if (!details || !account) {
      setState((prev) => ({
        ...prev,
        error: "Transaction details or account not available",
      }))
      return false
    }

    setState((prev) => ({ ...prev, isSubmitting: true, error: null }))

    try {
      // In preview mode, simulate transaction
      if (inPreviewMode) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          isSuccess: true,
          hash: `0x${Array(64)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join("")}`,
        }))
        return true
      }

      // In production, execute real transaction
      if (!isBrowser() || !window.ethereum) {
        throw new Error("No Ethereum wallet detected")
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum as any)
      const signer = provider.getSigner()

      // Contract address for Chronon token
      const chrononAddress = "0x1234567890123456789012345678901234567890" // Replace with actual address

      // ABI for the token contract (simplified)
      const tokenAbi = [
        "function transfer(address to, uint amount) returns (bool)",
        "function approve(address spender, uint amount) returns (bool)",
      ]

      let tx

      if (details.type === "buy") {
        // For buy, we would typically call a swap function on a DEX contract
        // This is a simplified example - in production, you'd integrate with a DEX

        // Mock DEX address
        const dexAddress = "0x0987654321098765432109876543210987654321"

        // Mock DEX ABI (simplified)
        const dexAbi = [
          "function swapETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory amounts)",
        ]

        const dexContract = new ethers.Contract(dexAddress, dexAbi, signer)

        // Calculate minimum amount out based on slippage
        const amountOutMin = ethers.utils.parseUnits(
          details.minReceived || "0",
          18, // Assuming 18 decimals for Chronon
        )

        // Path for the swap (ETH -> Chronon)
        const path = [
          "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH address
          chrononAddress,
        ]

        // Calculate deadline (current time + deadline minutes)
        const deadline = Math.floor(Date.now() / 1000) + settings.deadline * 60

        // Execute the swap
        tx = await dexContract.swapETHForTokens(amountOutMin, path, account, deadline, {
          value: ethers.utils.parseEther(details.inputAmount),
          gasPrice: ethers.utils.parseUnits(gasPrices ? gasPrices[settings.gasPreset].toString() : "50", "gwei"),
        })
      } else {
        // For sell, we would approve the DEX to spend our tokens, then call a swap function
        // This is a simplified example

        const tokenContract = new ethers.Contract(chrononAddress, tokenAbi, signer)

        // Mock DEX address
        const dexAddress = "0x0987654321098765432109876543210987654321"

        // First approve the DEX to spend our tokens
        const amountToSell = ethers.utils.parseUnits(
          details.inputAmount,
          18, // Assuming 18 decimals for Chronon
        )

        tx = await tokenContract.approve(dexAddress, amountToSell, {
          gasPrice: ethers.utils.parseUnits(gasPrices ? gasPrices[settings.gasPreset].toString() : "50", "gwei"),
        })
      }

      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        isSuccess: true,
        hash: tx.hash,
      }))

      return true
    } catch (error: any) {
      console.error("Transaction error:", error)
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error.message || "Transaction failed. Please try again.",
      }))
      return false
    }
  }, [details, account, inPreviewMode, settings, gasPrices])

  // Reset transaction state
  const resetTransaction = useCallback(() => {
    setState({
      isLoading: false,
      isSubmitting: false,
      isSuccess: false,
      error: null,
      hash: null,
    })
    setDetails(null)
  }, [])

  // Manual refresh for price data
  const refreshPrices = useCallback(() => {
    fetchPriceData()
  }, [fetchPriceData])

  return {
    priceData,
    gasPrices,
    settings,
    details,
    state,
    calculateTransaction,
    updateSettings,
    executeTransaction,
    resetTransaction,
    refreshPrices,
  }
}
