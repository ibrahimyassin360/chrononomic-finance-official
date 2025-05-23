"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useWallet } from "@/contexts/wallet-context"
import { createProject, createProjectWithCost } from "@/services/chronon-economy-service"
import { Loader2, AlertCircle, ArrowLeft, Check, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PROJECT_TYPES } from "@/types/chronon-economy"

export default function CreateProjectPage() {
  const router = useRouter()
  const { account, isConnected } = useWallet()
  const [name, setName] = useState("")
  const [teamMembers, setTeamMembers] = useState("")
  const [projectType, setProjectType] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [chrononsIssued, setChrononsIssued] = useState(0)
  const [chrononsSpent, setChrononsSpent] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!account || !isConnected) {
      setError("Please connect your wallet first")
      return
    }

    if (!name || !teamMembers) {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      if (projectType) {
        // Create project with cost
        const result = await createProjectWithCost(account, name, Number.parseInt(teamMembers), projectType)

        if (result.success) {
          setChrononsIssued(result.project.chrononsIssued)
          setChrononsSpent(result.chrononsSpent)
          setSuccess(true)
          setTimeout(() => {
            router.push("/economy")
          }, 3000)
        }
      } else {
        // Create standard project
        const result = await createProject(account, name, Number.parseInt(teamMembers))

        if (result.success) {
          setChrononsIssued(result.project.chrononsIssued)
          setChrononsSpent(0)
          setSuccess(true)
          setTimeout(() => {
            router.push("/economy")
          }, 3000)
        }
      }
    } catch (err: any) {
      console.error("Error creating project:", err)
      setError(err.message || "Failed to create project")
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
              Project Created
            </CardTitle>
            <CardDescription>Your project has been successfully created</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              You have earned <span className="font-bold">{chrononsIssued} χ</span> for creating this project.
            </p>
            {chrononsSpent > 0 && (
              <p className="mb-2">
                You have spent <span className="font-bold">{chrononsSpent} χ</span> for the selected project type.
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Net χ: <span className="font-medium">{chrononsIssued - chrononsSpent} χ</span>
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
          <CardTitle>Create Project</CardTitle>
          <CardDescription>Create a new project to earn χ-tokens</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Chrononomic Dashboard"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-members">Team Members</Label>
              <div className="flex items-center">
                <Input
                  id="team-members"
                  type="number"
                  min="1"
                  step="1"
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(e.target.value)}
                  placeholder="5"
                  disabled={isSubmitting}
                />
                <Users className="ml-2 h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                You will earn {teamMembers ? teamMembers : "0"} χ (1 χ per team member)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Project Type (Optional)</Label>
              <RadioGroup value={projectType || ""} onValueChange={setProjectType}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="" id="standard" />
                    <Label htmlFor="standard" className="flex-1 cursor-pointer">
                      <div className="font-medium">Standard Project</div>
                      <div className="text-sm text-muted-foreground">No additional χ cost</div>
                    </Label>
                  </div>

                  {PROJECT_TYPES.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value={type.id} id={type.id} />
                      <Label htmlFor={type.id} className="flex-1 cursor-pointer">
                        <div className="font-medium">{type.description.split(" - ")[0]}</div>
                        <div className="text-sm text-muted-foreground">{type.description.split(" - ")[1]}</div>
                        <div className="text-sm font-medium text-primary mt-1">Cost: {type.chrononsRequired} χ</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
