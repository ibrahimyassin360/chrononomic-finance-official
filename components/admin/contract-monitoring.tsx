"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Activity, Clock, Users, DollarSign } from "lucide-react"
import { ethers } from "ethers"

interface ContractEvent {
  id: string
  contract: string
  event: string
  timestamp: number
  data: Record<string, any>
}

interface ContractStats {
  totalUsers: number
  totalBonds: number
  totalValue: string
  lastActivity: string
}

export function ContractMonitoring() {
  const [events, setEvents] = useState<ContractEvent[]>([])
  const [stats, setStats] = useState<ContractStats>({
    totalUsers: 0,
    totalBonds: 0,
    totalValue: "0",
    lastActivity: "Never",
  })
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [alerts, setAlerts] = useState<string[]>([])

  // Simulate fetching events
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // This would be replaced with actual contract event monitoring
        const newEvent: ContractEvent = {
          id: `event-${Date.now()}`,
          contract: "ChrononBond",
          event: "BondCreated",
          timestamp: Date.now(),
          data: {
            bondId: Math.floor(Math.random() * 1000),
            creator: `0x${Math.random().toString(16).substring(2, 42)}`,
            value: ethers.utils.parseEther((Math.random() * 10).toFixed(2)).toString(),
          },
        }

        setEvents((prev) => [newEvent, ...prev].slice(0, 50))

        // Update stats
        setStats((prev) => ({
          ...prev,
          totalBonds: prev.totalBonds + 1,
          totalValue: ethers.utils.formatEther(
            ethers.BigNumber.from(ethers.utils.parseEther(prev.totalValue)).add(
              ethers.BigNumber.from(newEvent.data.value),
            ),
          ),
          lastActivity: new Date().toISOString(),
        }))

        // Simulate alerts
        if (Math.random() > 0.8) {
          setAlerts((prev) =>
            [
              `Unusual activity detected: Large bond creation (${ethers.utils.formatEther(newEvent.data.value)} ETH)`,
              ...prev,
            ].slice(0, 10),
          )
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isMonitoring])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Contract Monitoring</h2>
        <Button onClick={() => setIsMonitoring(!isMonitoring)} variant={isMonitoring ? "destructive" : "default"}>
          {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <Users className="mr-2 h-4 w-4" />
              {stats.totalUsers}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bonds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              {stats.totalBonds}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              {stats.totalValue} ETH
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {stats.lastActivity === "Never" ? "Never" : new Date(stats.lastActivity).toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="alerts">Alerts {alerts.length > 0 && `(${alerts.length})`}</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Contract Events</CardTitle>
              <CardDescription>Real-time monitoring of contract events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No events recorded yet</div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold flex items-center">
                            <Badge variant="outline" className="mr-2">
                              {event.contract}
                            </Badge>
                            {event.event}
                          </h4>
                          <p className="text-sm text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <pre className="bg-muted p-2 rounded overflow-x-auto">
                          {JSON.stringify(event.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled={events.length === 0}>
                Export Events
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>Notifications about unusual or potentially risky activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="flex items-center justify-center p-4 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>No alerts at this time</span>
                  </div>
                ) : (
                  alerts.map((alert, index) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Alert</AlertTitle>
                      <AlertDescription>{alert}</AlertDescription>
                    </Alert>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled={alerts.length === 0}>
                Clear All Alerts
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ContractMonitoring
