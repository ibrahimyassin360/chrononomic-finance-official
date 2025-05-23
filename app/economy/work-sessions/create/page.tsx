"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useWallet } from "@/contexts/wallet-context"
import { createWorkSession } from "@/services/chronon-economy-service"
import { Loader2, AlertCircle, ArrowLeft, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateWorkSessionPage() {
  const router = useRouter()
  const { account, isConnected } = useWallet()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [ethCost, setEthCost] = useState("")
  const [duration, setDuration] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!account || !isConnected) {
      setError("Please connect your wallet first")
      return
    }

    if (!title || !description || !ethCost || !duration) {
      setError("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createWorkSession(
        account,
        title,
        description,
        Number.parseFloat(ethCost),
        Number.parseFloat(duration),
      )

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/economy")
        }, 2000)
      }
    } catch (err: any) {
      console.error("Error creating work session:", err)
      setError(err.message || "Failed to create work session")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="container py-8 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <Check className="mr-2 h-6 w-6" />
              Work Session Created
            </CardTitle>
            <CardDescription>Your work session has been successfully created</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You will earn <span className="font-bold">{ethCost} χ</span> upon completion of this work session.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/economy">Return to Economy Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-md mx-auto">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/economy">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Economy
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Work Session</CardTitle>
          <CardDescription>Create a new work session to earn χ-tokens</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Session Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Product Strategy Consultation"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose and goals of this work session"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eth-cost">ETH Cost</Label>
                <Input
                  id="eth-cost"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={ethCost}
                  onChange={(e) => setEthCost(e.target.value)}
                  placeholder="1.0"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">You will earn {ethCost ? ethCost : "0"} χ (1:1 ratio)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="2"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Work Session"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
