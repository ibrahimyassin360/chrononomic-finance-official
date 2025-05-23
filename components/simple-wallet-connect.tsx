"use client"

import { useState } from "react"

export default function SimpleWalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)

    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true)
      setIsConnecting(false)
    }, 1000)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
  }

  if (isConnected) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Wallet Connected</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Connected Address:</p>
        <div className="font-mono text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded mb-4">
          0x71C7656EC7ab88b098defB751B7401B5f6d8976F
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Balance:</p>
        <div className="font-bold mb-4">10.0 ETH</div>
        <button
          onClick={handleDisconnect}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Disconnect (Preview)
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Connect your wallet to access Chrononomic Finance features and manage your assets.
      </p>
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
      >
        {isConnecting ? "Connecting..." : "Connect Wallet (Preview)"}
      </button>
    </div>
  )
}
