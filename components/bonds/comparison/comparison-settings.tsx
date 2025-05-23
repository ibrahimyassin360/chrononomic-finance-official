"use client"

import { useState } from "react"
import type { ComparisonSettings } from "@/types/comparison"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ComparisonSettingsProps {
  settings: ComparisonSettings
  onSettingsChange: (settings: Partial<ComparisonSettings>) => void
}

export function ComparisonSettingsPanel({ settings, onSettingsChange }: ComparisonSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Comparison Settings</CardTitle>
          <CollapsibleTrigger asChild onClick={() => setIsOpen(!isOpen)}>
            <Button variant="ghost" size="sm" className="hover-effect">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">{isOpen ? "Close" : "Open"}</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </CardHeader>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="pt-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Investment Amount (ETH)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.investmentAmount]}
                    min={0.1}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => onSettingsChange({ investmentAmount: value[0] })}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{settings.investmentAmount.toFixed(1)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Time Horizon (years)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.timeHorizon]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => onSettingsChange({ timeHorizon: value[0] })}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{settings.timeHorizon}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Risk Tolerance</Label>
                <RadioGroup
                  value={settings.riskTolerance}
                  onValueChange={(value) => onSettingsChange({ riskTolerance: value as "low" | "medium" | "high" })}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="risk-low" />
                    <Label htmlFor="risk-low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="risk-medium" />
                    <Label htmlFor="risk-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="risk-high" />
                    <Label htmlFor="risk-high">High</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label>Display Options</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="features"
                      checked={settings.includeFeatures}
                      onCheckedChange={(checked) => onSettingsChange({ includeFeatures: checked })}
                    />
                    <Label htmlFor="features">Special Features</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="yield"
                      checked={settings.includeYield}
                      onCheckedChange={(checked) => onSettingsChange({ includeYield: checked })}
                    />
                    <Label htmlFor="yield">Yield Comparison</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="risk"
                      checked={settings.includeRisk}
                      onCheckedChange={(checked) => onSettingsChange({ includeRisk: checked })}
                    />
                    <Label htmlFor="risk">Risk Analysis</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="maturity"
                      checked={settings.includeMaturity}
                      onCheckedChange={(checked) => onSettingsChange({ includeMaturity: checked })}
                    />
                    <Label htmlFor="maturity">Maturity Timeline</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
