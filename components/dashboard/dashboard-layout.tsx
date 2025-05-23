"use client"

import type React from "react"

import { useWallet } from "@/hooks/use-wallet"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { account, hasPaid } = useWallet()
  const router = useRouter()

  // Redirect if not connected or hasn't paid
  useEffect(() => {
    if (!account || !hasPaid) {
      router.push("/")
    }
  }, [account, hasPaid, router])

  // Show loading state while checking authentication
  if (!account || !hasPaid) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  return <div className="container mx-auto px-4 py-8">{children}</div>
}
