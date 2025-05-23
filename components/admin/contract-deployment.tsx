"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle, Check, Upload, RefreshCw } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { CONTRACT_ADDRESSES } from "@/config/contracts"

export function ContractDeployment() {
  const { account, chainId, isConnected, isNetworkSupported } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [initialSupply, setInitialSupply] = useState("1000000")
  const [buyPrice, setBuyPrice] = useState("0.001")
  const [sellPrice, setSellPrice] = useState("0.0009")

  // Mock function to simulate contract deployment
  const handleDeploy = async () => {
    if (!account || !isConnected || !isNetworkSupported || !chainId) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real implementation, this would call the deployment script
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setSuccess("Contracts deployed successfully!")
    } catch (err: any) {
      console.error("Error deploying contracts:", err)
      setError(err.message || "Failed to deploy contracts")
    } finally {
      setLoading(false)
    }
  }

  const getContractAddresses = () => {
    if (!chainId) return null
    return CONTRACT_ADDRESSES[chainId] || null
  }

  const contractAddresses = getContractAddresses()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contract Deployment</CardTitle>
        <CardDescription>Deploy and manage smart contracts</CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">Connect your wallet to deploy contracts</p>
          </div>
        ) : !isNetworkSupported ? (
          <div className="text-center py-6">
            <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
            <p className="mt-2 text-sm text-muted-foreground">Please switch to a supported network</p>
          </div>
        ) : (
          <Tabs defaultValue="deploy">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deploy">Deploy</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
            </TabsList>

            <TabsContent value="deploy" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="initialSupply">Initial Token Supply</Label>
                  <Input
                    id="initialSupply"
                    value={initialSupply}
                    onChange={(e) => setInitialSupply(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">Total supply of Chronon tokens to mint initially</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyPrice">Buy Price (ETH per Chronon)</Label>
                  <Input
                    id="buyPrice"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellPrice">Sell Price (ETH per Chronon)</Label>
                  <Input
                    id="sellPrice"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Sell price is typically lower than buy price to create a spread
                  </p>
                </div>

                <Button className="w-full" onClick={handleDeploy} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Deploy Contracts
                    </>
                  )}
                </Button>

                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-destructive">
                    <div className="flex items-start">
                      <AlertCircle className="mr-2 h-4 w-4 mt-0.5" />
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="rounded-md bg-green-100 p-3 text-green-800 dark:bg-green-900 dark:text-green-300">
                    <div className="flex items-start">
                      <Check className="mr-2 h-4 w-4 mt-0.5" />
                      <p className="text-sm">{success}</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="manage" className="space-y-4 pt-4">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="mb-2">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>

              {contractAddresses ? (
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium">ChrononToken</h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground break-all">
                      {contractAddresses.ChrononToken}
                    </p>
                  </div>

                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium">ChrononBond</h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground break-all">
                      {contractAddresses.ChrononBond}
                    </p>
                  </div>

                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium">ChrononVault</h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground break-all">
                      {contractAddresses.ChrononVault}
                    </p>
                  </div>

                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium">ChrononomicFinance</h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground break-all">
                      {contractAddresses.ChrononomicFinance}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No contracts deployed on this network</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
