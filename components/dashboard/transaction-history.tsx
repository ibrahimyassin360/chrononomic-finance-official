"use client"

import { useWallet } from "@/hooks/use-wallet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { ExternalLink, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Transaction type definition
type Transaction = {
  hash: string
  timestamp: number
  from: string
  to: string
  value: string
  status: "confirmed" | "pending" | "failed"
  type: "send" | "receive" | "contract" | "other"
}

export function TransactionHistory() {
  const { account, chainId } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!account || !chainId) return

      setLoading(true)
      setError(null)

      try {
        // In a real implementation, you would fetch transactions from an API or blockchain explorer
        // For this example, we'll use mock data

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock transactions data
        const mockTransactions: Transaction[] = [
          {
            hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            timestamp: Date.now() - 3600000, // 1 hour ago
            from: account,
            to: "0x0000000000000000000000000000000000000000",
            value: "1.0",
            status: "confirmed",
            type: "send",
          },
          {
            hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            timestamp: Date.now() - 86400000, // 1 day ago
            from: "0x1111111111111111111111111111111111111111",
            to: account,
            value: "5.0",
            status: "confirmed",
            type: "receive",
          },
          {
            hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
            timestamp: Date.now() - 172800000, // 2 days ago
            from: account,
            to: "0x2222222222222222222222222222222222222222",
            value: "0.5",
            status: "confirmed",
            type: "contract",
          },
          {
            hash: "0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
            timestamp: Date.now() - 259200000, // 3 days ago
            from: "0x3333333333333333333333333333333333333333",
            to: account,
            value: "2.5",
            status: "confirmed",
            type: "receive",
          },
          {
            hash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
            timestamp: Date.now() - 345600000, // 4 days ago
            from: account,
            to: "0x4444444444444444444444444444444444444444",
            value: "0.1",
            status: "failed",
            type: "send",
          },
        ]

        setTransactions(mockTransactions)
      } catch (err) {
        console.error("Error fetching transactions:", err)
        setError("Failed to load transaction history")
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [account, chainId])

  // Format account address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Get etherscan URL for the current network
  const getExplorerUrl = (id: number | null, hash: string) => {
    if (!id || !hash) return "#"

    const explorers: Record<number, string> = {
      1: "https://etherscan.io",
      5: "https://goerli.etherscan.io",
      11155111: "https://sepolia.etherscan.io",
      137: "https://polygonscan.com",
      80001: "https://mumbai.polygonscan.com",
      42161: "https://arbiscan.io",
      421613: "https://goerli.arbiscan.io",
    }

    const baseUrl = explorers[id] || "https://etherscan.io"
    return `${baseUrl}/tx/${hash}`
  }

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  // Get badge variant based on transaction type
  const getTypeBadgeVariant = (type: Transaction["type"]) => {
    switch (type) {
      case "send":
        return "destructive"
      case "receive":
        return "success"
      case "contract":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Get badge variant based on transaction status
  const getStatusBadgeVariant = (status: Transaction["status"]) => {
    switch (status) {
      case "confirmed":
        return "success"
      case "pending":
        return "warning"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="py-8 text-center text-sm text-red-500">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No transactions found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>From/To</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.hash}>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(tx.type)}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(tx.timestamp)}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {tx.type === "send" ? formatAddress(tx.to) : formatAddress(tx.from)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {tx.type === "send" ? "-" : "+"}
                    {tx.value} ETH
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(tx.status)}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={getExplorerUrl(chainId, tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      View <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
