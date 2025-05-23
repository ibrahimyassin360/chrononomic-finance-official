"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { Loader2 } from "lucide-react"

// Mock data type
type AnalyticsData = {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
  }[]
}

export function AnalyticsChart() {
  const { account } = useWallet()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!account) return

      setLoading(true)
      setError(null)

      try {
        // In a real implementation, you would fetch analytics data from an API
        // For this example, we'll use mock data

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1200))

        // Mock analytics data
        const mockData: AnalyticsData = {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Portfolio Value",
              data: [1200, 1900, 3000, 5000, 4000, 6500],
              borderColor: "rgb(99, 102, 241)",
              backgroundColor: "rgba(99, 102, 241, 0.5)",
            },
          ],
        }

        setData(mockData)
      } catch (err) {
        console.error("Error fetching analytics:", err)
        setError("Failed to load analytics data")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [account])

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Portfolio Analytics</CardTitle>
        <CardDescription>Your portfolio performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-500">{error}</div>
        ) : !data ? (
          <div className="py-16 text-center text-sm text-muted-foreground">No analytics data available</div>
        ) : (
          <div className="h-80 w-full">
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-center text-sm text-muted-foreground">
                Chart visualization would be rendered here using a library like Chart.js or Recharts.
                <br />
                For this example, we're showing a placeholder.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
