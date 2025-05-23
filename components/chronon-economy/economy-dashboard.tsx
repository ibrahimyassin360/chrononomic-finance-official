"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { getUserWorkSessions, getUserProjectCreations, getUserBonds } from "@/services/chronon-economy-service"
import { WorkSessionsList } from "@/components/chronon-economy/work-sessions-list"
import { ProjectCreationsList } from "@/components/chronon-economy/project-creations-list"
import { BondsList } from "@/components/chronon-economy/bonds-list"
import { RestPeriodsList } from "@/components/chronon-economy/rest-periods-list"
import { ContactRatesList } from "@/components/chronon-economy/contact-rates-list"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export function EconomyDashboard() {
  const { account, isConnected } = useWallet()
  const [activeTab, setActiveTab] = useState("overview")
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
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-center text-muted-foreground mb-4">
            Connect your wallet to access the χ-token economy dashboard
          </p>
          <Button asChild>
            <Link href="/connect">Connect Wallet</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>χ-Token Economy</CardTitle>
        <CardDescription>Manage your χ-tokens, bonds, and more</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="work">Work Sessions</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="bonds">Bonds</TabsTrigger>
            <TabsTrigger value="redeem">Redeem χ</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={() => setActiveTab("overview")}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Work Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{workSessions.length}</p>
                      <p className="text-sm text-muted-foreground">Total sessions completed</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("work")}>
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{projects.length}</p>
                      <p className="text-sm text-muted-foreground">Total projects created</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("projects")}>
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Bonds</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{bonds.length}</p>
                      <p className="text-sm text-muted-foreground">Total bonds issued</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("bonds")}>
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>χ-Token Balance</CardTitle>
                    <CardDescription>Your current χ-token balance and activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-4xl font-bold">42 χ</p>
                        <p className="text-sm text-muted-foreground mt-1">Current Balance</p>
                      </div>
                      <div className="mt-4 md:mt-0 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-2xl font-bold text-green-600">+12 χ</p>
                          <p className="text-sm text-muted-foreground">Earned (30d)</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-600">-7 χ</p>
                          <p className="text-sm text-muted-foreground">Spent (30d)</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full" asChild>
                        <Link href="/economy/work-sessions/create">Create Work Session</Link>
                      </Button>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/economy/projects/create">Create Project</Link>
                      </Button>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/economy/bonds/issue">Issue Bond</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {workSessions.slice(0, 3).map((session) => (
                          <li key={session.id} className="text-sm">
                            <span className="text-green-600">+{session.chrononsEarned} χ</span> - {session.title}
                          </li>
                        ))}
                        {bonds.slice(0, 2).map((bond) => (
                          <li key={bond.id} className="text-sm">
                            <span className="text-blue-600">Bond</span> - {bond.projectName} ({bond.denomination} χ)
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="link" size="sm" className="px-0">
                        View All Activity
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="work">
                <WorkSessionsList workSessions={workSessions} />
              </TabsContent>

              <TabsContent value="projects">
                <ProjectCreationsList projects={projects} />
              </TabsContent>

              <TabsContent value="bonds">
                <BondsList bonds={bonds} />
              </TabsContent>

              <TabsContent value="redeem" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Redeem χ for Rest Periods</CardTitle>
                    <CardDescription>Use your χ-tokens to secure sanctioned rest periods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RestPeriodsList />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact & Support Rates</CardTitle>
                    <CardDescription>Schedule high-value consultation sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContactRatesList />
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
