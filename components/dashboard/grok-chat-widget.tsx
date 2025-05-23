"use client"
import { useState, useEffect } from "react"
import { useWallet } from "@/contexts/wallet-context"

export function GrokChatWidget() {
  const { account } = useWallet()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return null
}
