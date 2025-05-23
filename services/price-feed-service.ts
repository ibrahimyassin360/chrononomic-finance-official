import { isBrowser } from "@/lib/environment"

// Cache for price data to reduce API calls
interface PriceCache {
  price: number
  timestamp: number
}

const priceCache: Record<string, PriceCache> = {}
const CACHE_DURATION = 60000 // 1 minute cache

// Mock price data for preview mode
const MOCK_PRICES = {
  "eth-usd": 2500.75,
  "chronon-usd": 125.75,
  "dai-usd": 1.0,
  "usdc-usd": 1.0,
}

/**
 * Get the latest price from a Chainlink price feed
 * This function is safe to call during rendering as it will return mock data
 * when not in a browser or when in preview mode
 */
export async function getLatestPrice(
  pair: "eth-usd" | "chronon-usd" | "dai-usd" | "usdc-usd",
  isPreviewMode: boolean,
): Promise<{ price: number; lastUpdated: Date }> {
  // Return mock data in preview mode or when not in browser
  if (isPreviewMode || !isBrowser()) {
    return {
      price: MOCK_PRICES[pair],
      lastUpdated: new Date(),
    }
  }

  // Check cache first
  const cacheKey = pair
  const now = Date.now()
  if (priceCache[cacheKey] && now - priceCache[cacheKey].timestamp < CACHE_DURATION) {
    return {
      price: priceCache[cacheKey].price,
      lastUpdated: new Date(priceCache[cacheKey].timestamp),
    }
  }

  // If we're in the browser but window.ethereum is not available, return mock data
  if (!window.ethereum) {
    console.warn("Ethereum provider not available, using mock price data")
    return {
      price: MOCK_PRICES[pair],
      lastUpdated: new Date(),
    }
  }

  // We'll implement the actual Chainlink integration in a separate function
  // that's only called from client components after they've mounted
  return {
    price: MOCK_PRICES[pair],
    lastUpdated: new Date(),
  }
}

/**
 * Calculate the CHRONON/ETH price based on USD price feeds
 */
export async function calculateChronEthPrice(isPreviewMode: boolean): Promise<number> {
  try {
    // Get both USD prices
    const ethUsd = await getLatestPrice("eth-usd", isPreviewMode)
    const chronUsd = await getLatestPrice("chronon-usd", isPreviewMode)

    // Calculate CHRONON/ETH price
    return chronUsd.price / ethUsd.price
  } catch (error) {
    console.error("Error calculating CHRONON/ETH price:", error)
    // Return a reasonable default
    return 0.05 // 1 ETH = 20 CHRONON
  }
}

/**
 * Get all price data needed for the application
 */
export async function getAllPriceData(isPreviewMode: boolean) {
  try {
    const ethUsdData = await getLatestPrice("eth-usd", isPreviewMode)
    const chronUsdData = await getLatestPrice("chronon-usd", isPreviewMode)
    const daiUsdData = await getLatestPrice("dai-usd", isPreviewMode)
    const usdcUsdData = await getLatestPrice("usdc-usd", isPreviewMode)

    const chronEthPrice = chronUsdData.price / ethUsdData.price

    return {
      chronon: {
        usd: chronUsdData.price,
        eth: chronEthPrice,
      },
      eth: {
        usd: ethUsdData.price,
      },
      dai: {
        usd: daiUsdData.price,
      },
      usdc: {
        usd: usdcUsdData.price,
      },
      lastUpdated: new Date(
        Math.max(
          chronUsdData.lastUpdated.getTime(),
          ethUsdData.lastUpdated.getTime(),
          daiUsdData.lastUpdated.getTime(),
          usdcUsdData.lastUpdated.getTime(),
        ),
      ),
    }
  } catch (error) {
    console.error("Error fetching all price data:", error)
    // Return reasonable defaults
    return {
      chronon: {
        usd: 125.75,
        eth: 0.05,
      },
      eth: {
        usd: 2500.75,
      },
      dai: {
        usd: 1.0,
      },
      usdc: {
        usd: 1.0,
      },
      lastUpdated: new Date(),
    }
  }
}

/**
 * Get gas price estimates
 */
export async function getGasPrices(isPreviewMode: boolean): Promise<{
  standard: number
  fast: number
  instant: number
}> {
  // Return mock data in preview mode or when not in browser
  if (isPreviewMode || !isBrowser()) {
    return {
      standard: 30,
      fast: 45,
      instant: 60,
    }
  }

  // If we're in the browser but window.ethereum is not available, return mock data
  if (!window.ethereum) {
    console.warn("Ethereum provider not available, using mock gas prices")
    return {
      standard: 30,
      fast: 45,
      instant: 60,
    }
  }

  // We'll implement the actual gas price fetching in a separate function
  // that's only called from client components after they've mounted
  return {
    standard: 30,
    fast: 45,
    instant: 60,
  }
}

/**
 * Convert ETH to USD
 */
export async function ethToUsd(ethAmount: number, isPreviewMode: boolean): Promise<number> {
  try {
    const ethUsdData = await getLatestPrice("eth-usd", isPreviewMode)
    return ethAmount * ethUsdData.price
  } catch (error) {
    console.error("Error converting ETH to USD:", error)
    // Return a reasonable default
    return ethAmount * 2500.75
  }
}

/**
 * Convert USD to ETH
 */
export async function usdToEth(usdAmount: number, isPreviewMode: boolean): Promise<number> {
  try {
    const ethUsdData = await getLatestPrice("eth-usd", isPreviewMode)
    return usdAmount / ethUsdData.price
  } catch (error) {
    console.error("Error converting USD to ETH:", error)
    // Return a reasonable default
    return usdAmount / 2500.75
  }
}
