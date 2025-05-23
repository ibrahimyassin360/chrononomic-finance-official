"use client"

import { useEffect, useState } from "react"
import { Flame } from "lucide-react"
import { ethers } from "ethers"
import { useWallet } from "@/contexts/wallet-context"

export function GasPriceIndicator() {
  const { provider, isConnected } = useWallet()
  const [gasPrice, setGasPrice] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGasPrice = async () => {
      if (!provider || !isConnected) {
        setGasPrice(null)
        setLoading(false)
        return
      }

      try {
        const price = await provider.getGasPrice()
        // Convert from wei to gwei
        const priceInGwei = ethers.utils.formatUnits(price, "gwei")
        setGasPrice(Number.parseFloat(priceInGwei).toFixed(0))
      } catch (error) {
        console.error("Error fetching gas price:", error)
        setGasPrice(null)
      } finally {
        setLoading(false)
      }
    }

    fetchGasPrice()

    // Refresh every 30 seconds
    const interval = setInterval(fetchGasPrice, 30000)
    return () => clearInterval(interval)
  }, [provider, isConnected])

  if (!isConnected || loading || !gasPrice) {
    return null
  }

  // Determine color based on gas price
  const getGasPriceColor = (price: number) => {
    if (price < 20) return "text-green-500"
    if (price < 50) return "text-yellow-500"
    return "text-red-500"
  }

  const priceNum = Number.parseInt(gasPrice, 10)
  const colorClass = getGasPriceColor(priceNum)

  return (
    <div className="flex items-center space-x-1">
      <Flame className={`h-4 w-4 ${colorClass}`} />
      <span className="text-xs font-medium">{gasPrice} Gwei</span>
    </div>
  )
}
