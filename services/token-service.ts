import { isBrowser } from "@/lib/environment"

// Mock data for preview mode
const MOCK_TOKEN_BALANCE = "1000.0000"
const MOCK_TOKEN_SYMBOL = "CHRN"

// Get token balance
export async function getTokenBalance(
  address: string,
  isPreviewMode: boolean,
): Promise<{ balance: string; symbol: string }> {
  // Preview mode implementation
  if (isPreviewMode) {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
    return {
      balance: MOCK_TOKEN_BALANCE,
      symbol: MOCK_TOKEN_SYMBOL,
    }
  }

  // Production implementation
  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // For simplicity, we'll return mock data for now
    // In a real implementation, you would call the token contract
    return {
      balance: MOCK_TOKEN_BALANCE,
      symbol: MOCK_TOKEN_SYMBOL,
    }
  } catch (err) {
    console.error("Error getting token balance:", err)
    throw err
  }
}
