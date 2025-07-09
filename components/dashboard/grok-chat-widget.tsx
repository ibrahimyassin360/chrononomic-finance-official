"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Loader2 } from "lucide-react"

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grok Chat</CardTitle>
        <CardDescription>Connect with our AI assistant</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-green-500 text-white">AI</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Grok AI</p>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Ask me anything about Chrononomic Finance, time-based assets, or the Crystal Oasis Reserve.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
