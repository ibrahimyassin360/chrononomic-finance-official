"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { getUserWorkSessions, getUserProjectCreations, getUserBonds } from "@/services/chronon-economy-service"
import { Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"

export function ChrononEconomySummary() {
  const { account, isConnected } = useWallet()
  const [workSessions, setWorkSessions] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [bonds, setBonds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected || !account) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const [sessionsData, projectsData, bondsData] = await Promise.all([
          getUserWorkSessions(account),
          getUserProjectCreations(account),
          getUserBonds(account),
        ])

        setWorkSessions(sessionsData)
        setProjects(projectsData)
        setBonds(bondsData)
      } catch (err: any) {
        console.error("Error fetching economy data:", err)
        setError(err.message || "Failed to load economy data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [account, isConnected])

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>χ-Token Economy</CardTitle>
          <CardDescription>Connect your wallet to view your χ-token economy</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-4">
          <p className="text-center text-muted-foreground mb-4">Connect your wallet to access the χ-token economy</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>χ-Token Economy</CardTitle>
        <CardDescription>Your χ-token balance and activity</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={() => setLoading(true)}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-3xl font-bold">42 χ</p>
                <p className="text-sm text-muted-foreground mt-1">Current Balance</p>
              </div>
              <div className="mt-4 md:mt-0 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xl font-bold text-green-600">+12 χ</p>
                  <p className="text-sm text-muted-foreground">Earned (30d)</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-red-600">-7 χ</p>
                  <p className="text-sm text-muted-foreground">Spent (30d)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-md p-3">
                <p className="text-sm text-muted-foreground">Work Sessions</p>
                <p className="text-xl font-bold">{workSessions.length}</p>
              </div>
              <div className="border rounded-md p-3">
                <p className="text-sm text-muted-foreground">Projects</p>
                <p className="text-xl font-bold">{projects.length}</p>
              </div>
              <div className="border rounded-md p-3">
                <p className="text-sm text-muted-foreground">Bonds</p>
                <p className="text-xl font-bold">{bonds.length}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Recent Activity</p>
              {workSessions.length === 0 && projects.length === 0 && bonds.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              ) : (
                <ul className="space-y-1">
                  {workSessions.slice(0, 2).map((session) => (
                    <li key={session.id} className="text-sm">
                      <span className="text-green-600">+{session.chrononsEarned} χ</span> - {session.title}
                    </li>
                  ))}
                  {projects.slice(0, 1).map((project) => (
                    <li key={project.id} className="text-sm">
                      <span className="text-green-600">+{project.chrononsIssued} χ</span> - Created {project.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/economy">
            View χ-Economy
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
