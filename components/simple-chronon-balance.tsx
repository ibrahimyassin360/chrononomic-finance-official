"use client"

import { useState } from "react"

export default function SimpleChrononBalance() {
  const [balance, setBalance] = useState("1,000")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate refresh delay
    setTimeout(() => {
      // Generate a random balance between 900 and 1100
      const newBalance = Math.floor(Math.random() * 200 + 900).toLocaleString()
      setBalance(newBalance)
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  // Format the last updated time
  const formatLastUpdated = () => {
    const now = new Date()
    const diffMs = now.getTime() - lastUpdated.getTime()
    const diffSec = Math.floor(diffMs / 1000)

    if (diffSec < 60) {
      return `${diffSec} seconds ago`
    } else if (diffSec < 3600) {
      return `${Math.floor(diffSec / 60)} minutes ago`
    } else {
      return lastUpdated.toLocaleTimeString()
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Chronon Balance</h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-2">Your Chronon Token Balance:</p>
      <div className="text-3xl font-bold mb-4">{balance} CHRN</div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
      </div>
      <p className="text-sm text-gray-500">Last updated: {formatLastUpdated()}</p>
    </div>
  )
}
