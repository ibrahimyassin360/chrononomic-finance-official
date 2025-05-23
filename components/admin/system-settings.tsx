"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save } from "lucide-react"

export function SystemSettings() {
  const [settings, setSettings] = useState({
    bondCreationEnabled: true,
    ritualParticipationEnabled: true,
    temporalDensityProtocolEnabled: true,
    crossChainBridgeEnabled: false,
    governanceEnabled: true,
    minBondAmount: "100",
    maxBondAmount: "10000",
    ritualBonus: "5",
    temporalDensityFactor: "1.5",
    maintenanceMode: false,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSwitchChange = (field: string) => {
    setSettings({
      ...settings,
      [field]: !settings[field as keyof typeof settings],
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      [field]: value,
    })
  }

  const handleSave = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Configure platform settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="bond-creation">Bond Creation</Label>
              <p className="text-sm text-muted-foreground">Allow users to create new bonds</p>
            </div>
            <Switch
              id="bond-creation"
              checked={settings.bondCreationEnabled}
              onCheckedChange={() => handleSwitchChange("bondCreationEnabled")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ritual-participation">Ritual Participation</Label>
              <p className="text-sm text-muted-foreground">Allow users to participate in rituals</p>
            </div>
            <Switch
              id="ritual-participation"
              checked={settings.ritualParticipationEnabled}
              onCheckedChange={() => handleSwitchChange("ritualParticipationEnabled")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="temporal-density">Temporal Density Protocol v2</Label>
              <p className="text-sm text-muted-foreground">Enable enhanced time-value calculations</p>
            </div>
            <Switch
              id="temporal-density"
              checked={settings.temporalDensityProtocolEnabled}
              onCheckedChange={() => handleSwitchChange("temporalDensityProtocolEnabled")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="cross-chain">Cross-Chain Bridge</Label>
              <p className="text-sm text-muted-foreground">Enable cross-chain time-value transfers</p>
            </div>
            <Switch
              id="cross-chain"
              checked={settings.crossChainBridgeEnabled}
              onCheckedChange={() => handleSwitchChange("crossChainBridgeEnabled")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="governance">Governance</Label>
              <p className="text-sm text-muted-foreground">Enable time-locked governance features</p>
            </div>
            <Switch
              id="governance"
              checked={settings.governanceEnabled}
              onCheckedChange={() => handleSwitchChange("governanceEnabled")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Put the platform in maintenance mode</p>
            </div>
            <Switch
              id="maintenance-mode"
              checked={settings.maintenanceMode}
              onCheckedChange={() => handleSwitchChange("maintenanceMode")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-bond-amount">Minimum Bond Amount</Label>
              <Input
                id="min-bond-amount"
                type="number"
                value={settings.minBondAmount}
                onChange={(e) => handleInputChange("minBondAmount", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-bond-amount">Maximum Bond Amount</Label>
              <Input
                id="max-bond-amount"
                type="number"
                value={settings.maxBondAmount}
                onChange={(e) => handleInputChange("maxBondAmount", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ritual-bonus">Ritual Bonus (%)</Label>
            <Input
              id="ritual-bonus"
              type="number"
              value={settings.ritualBonus}
              onChange={(e) => handleInputChange("ritualBonus", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temporal-density-factor">Temporal Density Factor</Label>
            <Input
              id="temporal-density-factor"
              type="number"
              value={settings.temporalDensityFactor}
              onChange={(e) => handleInputChange("temporalDensityFactor", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading} className="ml-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
