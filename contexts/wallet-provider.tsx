"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"

// Types
export interface WalletContextType {
  account: string | null
  balance: string | null
  isConnecting: boolean
  isConnected: boolean
  error: string | null
  hasPaid: boolean
  inPreviewMode: boolean
  connect: () => Promise<boolean>
  disconnect: () => void
  makePayment: () => Promise<boolean>
}

// Default context values
const defaultContext: WalletContextType = {
  account: null,
  balance: null,
  isConnecting: false,
  isConnected: false,
  error: null,
  hasPaid: false,
  inPreviewMode: true,
  connect: async () => false,
  disconnect: () => {},
  makePayment: async () => false,
}

// Create context
const WalletContext = createContext<WalletContextType>(defaultContext)

// Helper function to safely check if we're in a browser
const isBrowser = (): boolean => {
  return typeof window !== "undefined"
}

const PAYMENT_KEY = "chrononomic_payment_timestamp"
const DAY_MS = 24 * 60 * 60 * 1000

const isPaymentValid = (timestamp: string | null): boolean => {
  if (!timestamp) return false
  const t = parseInt(timestamp, 10)
  if (Number.isNaN(t)) return false
  return Date.now() - t < DAY_MS
}

// Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPaid, setHasPaid] = useState(false)
  const [inPreviewMode, setInPreviewMode] = useState(true)

  // Use a ref to track if component is mounted
  const isMounted = useRef(false)
  // Use a ref to track if ethereum provider is available
  const hasProvider = useRef(false)

  // Initialize state
  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true

    // Safe check for ethereum provider
    const checkProvider = () => {
      if (isBrowser()) {
        hasProvider.current = typeof window.ethereum !== "undefined"
        setInPreviewMode(!hasProvider.current)
      }
    }

    // Check provider after a short delay to ensure window is fully available
    setTimeout(checkProvider, 100)

    // Check if payment has been made within the last 24 hours
    if (isBrowser()) {
      try {
        const ts = localStorage.getItem(PAYMENT_KEY)
        if (isPaymentValid(ts)) {
          setHasPaid(true)
        }
      } catch (err) {
        console.error("Error checking payment status:", err)
      }
    }

    // Cleanup
    return () => {
      isMounted.current = false
    }
  }, [])

  // Periodically verify payment validity
  useEffect(() => {
    const id = setInterval(() => {
      if (isBrowser()) {
        const ts = localStorage.getItem(PAYMENT_KEY)
        const valid = isPaymentValid(ts)
        setHasPaid(valid)
      }
    }, 60 * 1000)
    return () => clearInterval(id)
  }, [])

  // Check connection after provider is available
  useEffect(() => {
    if (hasProvider.current && isMounted.current) {
      checkConnection()
    }
  }, [inPreviewMode])

  // Check if wallet is already connected
  const checkConnection = async () => {
    if (!isBrowser() || !window.ethereum) return

    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts && accounts.length > 0 && isMounted.current) {
        setAccount(accounts[0])
        setIsConnected(true)
        await updateBalance(accounts[0])
      }
    } catch (err) {
      console.error("Error checking connection:", err)
    }
  }

  // Update balance
  const updateBalance = async (address: string) => {
    if (!isBrowser() || !window.ethereum || !isMounted.current) return

    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })

      // Convert from wei to ETH
      const ethBalance = Number.parseInt(balance, 16) / 1e18
      setBalance(ethBalance.toFixed(4))
    } catch (err) {
      console.error("Error getting balance:", err)
    }
  }

  // Connect wallet
  const connect = async (): Promise<boolean> => {
    setError(null)
    setIsConnecting(true)

    try {
      // Preview mode implementation
      if (inPreviewMode) {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
        setAccount("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
        setBalance("10.0000")
        setIsConnected(true)
        return true
      }

      // Production implementation
      if (!isBrowser() || !window.ethereum) {
        throw new Error("No Ethereum wallet detected. Please install MetaMask.")
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please make sure your wallet is unlocked.")
      }

      setAccount(accounts[0])
      setIsConnected(true)
      await updateBalance(accounts[0])

      // Set up event listeners
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("disconnect", handleDisconnect)

      return true
    } catch (err: any) {
      console.error("Error connecting wallet:", err)
      setError(err.message || "Failed to connect wallet")
      return false
    } finally {
      setIsConnecting(false)
    }
  }

  // Handle accounts changed
  const handleAccountsChanged = (accounts: string[]) => {
    if (!isMounted.current) return

    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnect()
    } else if (accounts[0] !== account) {
      setAccount(accounts[0])
      updateBalance(accounts[0])
    }
  }

  // Handle disconnect
  const handleDisconnect = () => {
    if (!isMounted.current) return
    disconnect()
  }

  // Disconnect wallet
  const disconnect = () => {
    setAccount(null)
    setBalance(null)
    setIsConnected(false)

    // Remove event listeners
    if (isBrowser() && window.ethereum) {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum.removeListener("disconnect", handleDisconnect)
    }
  }

  // Make payment
  const makePayment = async (): Promise<boolean> => {
    setError(null)

    try {
      // Preview mode implementation
      if (inPreviewMode) {
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate delay
        setHasPaid(true)
        try {
          localStorage.setItem(PAYMENT_KEY, Date.now().toString())
        } catch (err) {
          console.error("Error saving payment status:", err)
        }
        return true
      }

      // Production implementation
      if (!isBrowser() || !window.ethereum) {
        throw new Error("No Ethereum wallet detected. Please install MetaMask.")
      }

      if (!account) {
        throw new Error("Wallet not connected")
      }

      // Send 1 ETH
      const weiValue = "0xDE0B6B3A7640000" // 1 ETH in wei (hexadecimal)
      const recipient = "0x1234567890123456789012345678901234567890" // Replace with your actual address

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: recipient,
            value: weiValue,
          },
        ],
      })

      if (txHash) {
        setHasPaid(true)
        try {
          localStorage.setItem(PAYMENT_KEY, Date.now().toString())
        } catch (err) {
          console.error("Error saving payment status:", err)
        }
        return true
      }

      return false
    } catch (err: any) {
      console.error("Error making payment:", err)
      setError(err.message || "Failed to make payment")
      return false
    }
  }

  // Context value
  const value: WalletContextType = {
    account,
    balance,
    isConnecting,
    isConnected,
    error,
    hasPaid,
    inPreviewMode,
    connect,
    disconnect,
    makePayment,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

// Custom hook to use the wallet context
export function useWallet() {
  return useContext(WalletContext)
}
