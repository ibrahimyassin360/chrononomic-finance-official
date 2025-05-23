"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useWallet } from "@/contexts/wallet-context"
import { issueBond } from "@/services/chronon-economy-service"
import { Loader2, AlertCircle, ArrowLeft, Check, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function IssueBondPage() {
  const router = useRouter()
  const { account, isConnected } = useWallet()
  const [projectId, setProjectId] = useState("")
  const [projectName, setProjectName] = useState("")
  const [denomination, setDenomination] = useState("")
  const [maturityDate, setMaturityDate] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!account || !isConnected) {
      setError("Please connect your wallet first")
      return
    }

    if (!projectId || !projectName || !denomination || !maturityDate || !description) {
      setError("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await issueBond(
        account,
        projectId,
        projectName,
        Number.parseFloat(denomination),
        new Date(maturityDate),
        description,
      )

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/economy")
        }, 2000)
      }
    } catch (err: any) {
      console.error("Error issuing bond:", err)
      setError(err.message || "Failed to issue bond")
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
              Bond Issued
            </CardTitle>
            <CardDescription>Your bond has been successfully issued</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You have issued a bond for <span className="font-bold">{denomination} χ</span> that will mature on{" "}
              {new Date(maturityDate).toLocaleDateString()}.
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
          <CardTitle>Issue Chrononomic Bond</CardTitle>
          <CardDescription>Issue a new bond redeemable for χ-tokens upon project completion</CardDescription>
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
              <Label htmlFor="project-id">Project ID</Label>
              <Input
                id="project-id"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="e.g., project-123"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Chrononomic Dashboard"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="denomination">Denomination (χ)</Label>
              <Input
                id="denomination"
                type="number"
                min="1"
                step="1"
                value={denomination}
                onChange={(e) => setDenomination(e.target.value)}
                placeholder="10"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">The amount of χ-tokens this bond will be redeemable for</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maturity-date">Maturity Date</Label>
              <div className="relative">
                <Input
                  id="maturity-date"
                  type="date"
                  value={maturityDate}
                  onChange={(e) => setMaturityDate(e.target.value)}
                  disabled={isSubmitting}
                  min={new Date().toISOString().split("T")[0]}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-xs text-muted-foreground">The date when this bond will be redeemable</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose and conditions of this bond"
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Issuing...
                </>
              ) : (
                "Issue Bond"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
