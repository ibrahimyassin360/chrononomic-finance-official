"use client"

import { useState, useEffect } from "react"
import { getAllPriceData } from "@/services/price-feed-service"
import { useWallet } from "@/contexts/wallet-provider"
import { Loader2, TrendingUp, TrendingDown } from "lucide-react"

interface PriceTicker {
  showUsd?: boolean
  showEth?: boolean
  className?: string
}

export default function PriceTicker({ showUsd = true, showEth = false, className = "" }: PriceTicker) {
  const { inPreviewMode } = useWallet()
  const [price, setPrice] = useState<{ usd: number; eth: number } | null>(null)
  const [previousPrice, setPreviousPrice] = useState<{ usd: number; eth: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    let intervalId: NodeJS.Timeout

    const fetchPrice = async () => {
      try {
        const data = await getAllPriceData(inPreviewMode)

        if (!isMounted) return

        setPreviousPrice(price)
        setPrice({
          usd: data.chronon.usd,
          eth: data.chronon.eth,
        })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching price:", error)
        if (!isMounted) return
        setLoading(false)
      }
    }

    fetchPrice()
    intervalId = setInterval(fetchPrice, 30000) // Update every 30 seconds

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [inPreviewMode])

  const getPriceChangeDirection = (current: number, previous: number | null) => {
    if (!previous) return null
    if (current > previous) return "up"
    if (current < previous) return "down"
    return null
  }

  const usdDirection = price && previousPrice ? getPriceChangeDirection(price.usd, previousPrice.usd) : null
  const ethDirection = price && previousPrice ? getPriceChangeDirection(price.eth, previousPrice.eth) : null

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
      ) : (
        <>
          {showUsd && price && (
            <div className="flex items-center">
              <span className="font-medium">${price.usd.toFixed(2)}</span>
              {usdDirection === "up" && <TrendingUp className="h-3 w-3 ml-1 text-green-500" />}
              {usdDirection === "down" && <TrendingDown className="h-3 w-3 ml-1 text-red-500" />}
            </div>
          )}

          {showEth && price && (
            <div className="flex items-center">
              <span className="font-medium">{price.eth.toFixed(6)} ETH</span>
              {ethDirection === "up" && <TrendingUp className="h-3 w-3 ml-1 text-green-500" />}
              {ethDirection === "down" && <TrendingDown className="h-3 w-3 ml-1 text-red-500" />}
            </div>
          )}
        </>
      )}
    </div>
  )
}
