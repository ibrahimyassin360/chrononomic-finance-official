"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { ethers } from "ethers"
import { NETWORK_NAMES, SUPPORTED_NETWORKS } from "@/config/contracts"

// Types
export interface WalletContextType {
  account: string | null
  balance: string | null
  chainId: number | null
  networkName: string | null
  isNetworkSupported: boolean
  isConnecting: boolean
  isConnected: boolean
  error: string | null
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
  connect: () => Promise<boolean>
  disconnect: () => void
  switchNetwork: () => Promise<boolean>
  refreshBalance: () => Promise<void>
}

// Default context values
const defaultContext: WalletContextType = {
  account: null,
  balance: null,
  chainId: null,
  networkName: null,
  isNetworkSupported: false,
  isConnecting: false,
  isConnected: false,
  error: null,
  provider: null,
  signer: null,
  connect: async () => false,
  disconnect: () => {},
  switchNetwork: async () => false,
  refreshBalance: async () => {},
}

// Create context
const WalletContext = createContext<WalletContextType>(defaultContext)

// Check if MetaMask is available
const isMetaMaskAvailable = (): boolean => {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined"
}

// Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [networkName, setNetworkName] = useState<string | null>(null)
  const [isNetworkSupported, setIsNetworkSupported] = useState<boolean>(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)

  // Use a ref to track if component is mounted
  const isMounted = useRef(false)

  // Initialize state
  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true

    // Check if MetaMask is already connected
    const checkConnection = async () => {
      if (!isMetaMaskAvailable()) {
        return
      }

      try {
        // Create provider
        const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, "any")
        setProvider(ethersProvider)

        // Get accounts
        const accounts = await window.ethereum.request({ method: "eth_accounts" })

        if (accounts && accounts.length > 0) {
          // Get network info
          const network = await ethersProvider.getNetwork()
          const currentChainId = network.chainId
          const currentNetworkName = NETWORK_NAMES[currentChainId] || "Unknown Network"

          // Check if network is supported
          const supported = SUPPORTED_NETWORKS.includes(currentChainId)

          // Set state
          setAccount(accounts[0])
          setChainId(currentChainId)
          setNetworkName(currentNetworkName)
          setIsNetworkSupported(supported)
          setIsConnected(true)

          // Get signer
          const ethersSigner = ethersProvider.getSigner()
          setSigner(ethersSigner)

          // Get balance
          const accountBalance = await ethersProvider.getBalance(accounts[0])
          setBalance(ethers.utils.formatEther(accountBalance))
        }
      } catch (err) {
        console.error("Error checking connection:", err)
      }
    }

    checkConnection()

    // Set up event listeners for MetaMask
    if (isMetaMaskAvailable()) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
      window.ethereum.on("disconnect", handleDisconnect)
    }

    // Cleanup
    return () => {
      isMounted.current = false
      if (isMetaMaskAvailable()) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
        window.ethereum.removeListener("disconnect", handleDisconnect)
      }
    }
  }, [])

  // Handle accounts changed
  const handleAccountsChanged = async (accounts: string[]) => {
    if (!isMounted.current) return

    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnect()
    } else if (accounts[0] !== account) {
      setAccount(accounts[0])
      setIsConnected(true)

      // Update balance
      try {
        if (provider) {
          const accountBalance = await provider.getBalance(accounts[0])
          setBalance(ethers.utils.formatEther(accountBalance))
        }
      } catch (err) {
        console.error("Error updating balance:", err)
      }
    }
  }

  // Handle chain changed
  const handleChainChanged = async () => {
    if (!isMounted.current || !provider) return

    try {
      // Get updated network info
      const network = await provider.getNetwork()
      const newChainId = network.chainId
      const newNetworkName = NETWORK_NAMES[newChainId] || "Unknown Network"

      // Check if network is supported
      const supported = SUPPORTED_NETWORKS.includes(newChainId)

      // Update state
      setChainId(newChainId)
      setNetworkName(newNetworkName)
      setIsNetworkSupported(supported)

      // Update balance if connected
      if (account) {
        const accountBalance = await provider.getBalance(account)
        setBalance(ethers.utils.formatEther(accountBalance))
      }
    } catch (err) {
      console.error("Error handling chain change:", err)
    }
  }

  // Handle disconnect
  const handleDisconnect = () => {
    if (!isMounted.current) return
    disconnect()
  }

  // Connect wallet
  const connect = async (): Promise<boolean> => {
    setError(null)
    setIsConnecting(true)

    try {
      if (!isMetaMaskAvailable()) {
        throw new Error("MetaMask is not installed. Please install MetaMask to connect.")
      }

      // Create provider
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, "any")
      setProvider(ethersProvider)

      // Request accounts
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please make sure your wallet is unlocked.")
      }

      // Get network info
      const network = await ethersProvider.getNetwork()
      const currentChainId = network.chainId
      const currentNetworkName = NETWORK_NAMES[currentChainId] || "Unknown Network"

      // Check if network is supported
      const supported = SUPPORTED_NETWORKS.includes(currentChainId)

      // Get signer
      const ethersSigner = ethersProvider.getSigner()
      setSigner(ethersSigner)

      // Set state
      setAccount(accounts[0])
      setChainId(currentChainId)
      setNetworkName(currentNetworkName)
      setIsNetworkSupported(supported)
      setIsConnected(true)

      // Get balance
      const accountBalance = await ethersProvider.getBalance(accounts[0])
      setBalance(ethers.utils.formatEther(accountBalance))

      return true
    } catch (err: any) {
      console.error("Error connecting wallet:", err)
      setError(err.message || "Failed to connect wallet")
      return false
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnect = () => {
    setAccount(null)
    setBalance(null)
    setIsConnected(false)
    setSigner(null)
  }

  // Switch network
  const switchNetwork = async (): Promise<boolean> => {
    if (!isMetaMaskAvailable() || !provider) return false

    try {
      // Default to Sepolia (chain ID 11155111)
      const targetChainId = "0xaa36a7" // Hex for 11155111
      const targetChainName = "Sepolia"

      try {
        // Try to switch to the network
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainId }],
        })
        return true
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: targetChainId,
                chainName: targetChainName,
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia.infura.io/v3/"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          })
          return true
        }
        throw switchError
      }
    } catch (err: any) {
      console.error("Error switching network:", err)
      setError(err.message || "Failed to switch network")
      return false
    }
  }

  // Refresh balance
  const refreshBalance = async (): Promise<void> => {
    if (!account || !provider) return

    try {
      const accountBalance = await provider.getBalance(account)
      setBalance(ethers.utils.formatEther(accountBalance))
    } catch (err) {
      console.error("Error refreshing balance:", err)
    }
  }

  // Context value
  const value: WalletContextType = {
    account,
    balance,
    chainId,
    networkName,
    isNetworkSupported,
    isConnecting,
    isConnected,
    error,
    provider,
    signer,
    connect,
    disconnect,
    switchNetwork,
    refreshBalance,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

// Custom hook to use the wallet context
export function useWallet() {
  return useContext(WalletContext)
}
