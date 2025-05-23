import { ethers } from "ethers"
import { isPreviewMode } from "@/lib/is-preview-mode"

// Types for wallet providers
type EthereumProvider = {
  request: (args: { method: string; params?: any[] }) => Promise<any>
  on: (event: string, callback: (...args: any[]) => void) => void
  removeListener: (event: string, callback: (...args: any[]) => void) => void
}

// Connection states
export type ConnectionState = "disconnected" | "connecting" | "connected" | "error"

// Wallet info
export type WalletInfo = {
  address: string | null
  chainId: number | null
  balance: string | null
  connectionState: ConnectionState
  error: string | null
  isAdmin: boolean
}

/**
 * Connect to wallet
 * @returns Promise with wallet info
 */
export async function connectWallet(): Promise<WalletInfo> {
  // In preview mode, return mock data
  if (isPreviewMode()) {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay

    return {
      address: "0x1234567890123456789012345678901234567890",
      chainId: 1, // Ethereum Mainnet
      balance: "10.0",
      connectionState: "connected",
      error: null,
      isAdmin: true, // In preview, connected wallet is admin
    }
  }

  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    throw new Error("Cannot connect wallet in server environment")
  }

  // Check if ethereum provider exists
  if (!window.ethereum) {
    throw new Error("No Ethereum wallet detected. Please install MetaMask or another wallet.")
  }

  try {
    const provider = window.ethereum as EthereumProvider

    // Request accounts
    const accounts = await provider.request({
      method: "eth_requestAccounts",
    })

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please make sure your wallet is unlocked.")
    }

    // Get chain ID
    const chainIdHex = await provider.request({ method: "eth_chainId" })
    const chainId = Number.parseInt(chainIdHex, 16)

    // Get account balance
    const browserProvider = new ethers.BrowserProvider(window.ethereum)
    const accountBalance = await browserProvider.getBalance(accounts[0])
    const balance = ethers.formatEther(accountBalance)

    // Check if admin (this will be replaced with a real check in production)
    const isAdmin = accounts[0].toLowerCase() === "0x1234567890123456789012345678901234567890"

    return {
      address: accounts[0],
      chainId,
      balance,
      connectionState: "connected",
      error: null,
      isAdmin,
    }
  } catch (err: any) {
    console.error("Wallet connection error:", err)

    let errorMessage = "Failed to connect wallet. Please try again."
    if (err.code === 4001) {
      errorMessage = "Connection rejected. Please approve the connection request in your wallet."
    } else if (err.message) {
      errorMessage = err.message
    }

    return {
      address: null,
      chainId: null,
      balance: null,
      connectionState: "error",
      error: errorMessage,
      isAdmin: false,
    }
  }
}

/**
 * Disconnect wallet
 */
export function disconnectWallet(): WalletInfo {
  return {
    address: null,
    chainId: null,
    balance: null,
    connectionState: "disconnected",
    error: null,
    isAdmin: false,
  }
}

/**
 * Get current network name
 */
export function getNetworkName(chainId: number | null): string {
  if (!chainId) return "Unknown"

  switch (chainId) {
    case 1:
      return "Ethereum Mainnet"
    case 5:
      return "Goerli Testnet"
    case 11155111:
      return "Sepolia Testnet"
    case 137:
      return "Polygon Mainnet"
    case 80001:
      return "Mumbai Testnet"
    default:
      return `Chain ID: ${chainId}`
  }
}
