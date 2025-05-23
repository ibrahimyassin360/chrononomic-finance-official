"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useWalletConnection } from "@/hooks/use-wallet-connection"
import { WalletConnection } from "@/components/admin/wallet-connection"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, ShieldAlert } from "lucide-react"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isConnected, isAdmin } = useWalletConnection()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <WalletConnection />
        </div>

        <div className="md:col-span-2">
          {!isConnected ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Not Connected</AlertTitle>
              <AlertDescription>Please connect your wallet to access the admin dashboard.</AlertDescription>
            </Alert>
          ) : !isAdmin ? (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                This wallet does not have admin privileges. Please connect with an admin wallet.
              </AlertDescription>
            </Alert>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  )
}
