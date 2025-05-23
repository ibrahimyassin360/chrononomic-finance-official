"use client"

import { useState, useEffect, useCallback } from "react"
import { connectWallet, disconnectWallet, type WalletInfo } from "@/services/wallet-service"
import { isAdminWallet, isPreviewAdmin } from "@/lib/admin-utils"
import { isPreviewMode } from "@/lib/is-preview-mode"

export function useWalletConnection() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    address: null,
    chainId: null,
    balance: null,
    connectionState: "disconnected",
    error: null,
    isAdmin: false,
  })

  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Connect wallet
  const connect = useCallback(async () => {
    if (!isClient) return

    try {
      setWalletInfo((prev) => ({ ...prev, connectionState: "connecting", error: null }))

      const info = await connectWallet()

      // Check if admin
      const isAdmin = isPreviewMode() ? isPreviewAdmin(info.address) : isAdminWallet(info.address)

      setWalletInfo({ ...info, isAdmin })
    } catch (err: any) {
      console.error("Error connecting wallet:", err)
      setWalletInfo({
        address: null,
        chainId: null,
        balance: null,
        connectionState: "error",
        error: err.message || "Failed to connect wallet",
        isAdmin: false,
      })
    }
  }, [isClient])

  // Disconnect wallet
  const disconnect = useCallback(() => {
    if (!isClient) return

    const info = disconnectWallet()
    setWalletInfo(info)
  }, [isClient])

  // Setup event listeners for wallet changes
  useEffect(() => {
    if (!isClient || typeof window === "undefined") return

    const provider = window.ethereum

    if (!provider) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnect()
      } else if (accounts[0] !== walletInfo.address) {
        // Account changed, reconnect
        connect()
      }
    }

    const handleChainChanged = () => {
      // Chain changed, reconnect
      connect()
    }

    const handleDisconnect = () => {
      disconnect()
    }

    // Subscribe to wallet events
    provider.on("accountsChanged", handleAccountsChanged)
    provider.on("chainChanged", handleChainChanged)
    provider.on("disconnect", handleDisconnect)

    // Try to reconnect if previously connected
    const attemptReconnect = async () => {
      try {
        if (localStorage.getItem("wallet_connected") === "true") {
          await connect()
        }
      } catch (err) {
        console.error("Error reconnecting wallet:", err)
      }
    }

    attemptReconnect()

    // Cleanup event listeners on unmount
    return () => {
      if (provider) {
        provider.removeListener("accountsChanged", handleAccountsChanged)
        provider.removeListener("chainChanged", handleChainChanged)
        provider.removeListener("disconnect", handleDisconnect)
      }
    }
  }, [isClient, connect, disconnect, walletInfo.address])

  // Save connection status to localStorage
  useEffect(() => {
    if (!isClient) return

    try {
      if (walletInfo.connectionState === "connected") {
        localStorage.setItem("wallet_connected", "true")
      } else {
        localStorage.removeItem("wallet_connected")
      }
    } catch (err) {
      console.error("Error saving wallet connection status:", err)
    }
  }, [isClient, walletInfo.connectionState])

  return {
    ...walletInfo,
    connect,
    disconnect,
    isConnected: walletInfo.connectionState === "connected",
    isConnecting: walletInfo.connectionState === "connecting",
  }
}
