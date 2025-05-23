"use client"

import type React from "react"
import type { BondParameters } from "@/types/bond-creator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BondCreatorFormProps {
  parameters: BondParameters
  onChange: (parameters: BondParameters) => void
  disabled?: boolean
}

const bondTypes = [
  { value: "standard", label: "Standard Time Bond" },
  { value: "ritual", label: "Ritual Participation Bond" },
  { value: "temporal", label: "Temporal Density Bond" },
  { value: "governance", label: "Governance Time-Lock Bond" },
  { value: "cross-chain", label: "Cross-Chain Time Bond" },
]

const bondTypeDescriptions = {
  standard: "Classic time-value bond with fixed maturity and yield",
  ritual: "Bonds that earn additional rewards through ritual participation",
  temporal: "Leverages the Temporal Density Protocol v2 for enhanced yields",
  governance: "Provides governance rights proportional to time-lock duration",
  "cross-chain": "Enables time-value transfer across multiple blockchain networks",
}

export function BondCreatorForm({ parameters, onChange, disabled = false }: BondCreatorFormProps) {
  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value) && value > 0) {
      onChange({ ...parameters, principal: value })
    }
  }

  const handleTenorChange = (value: number[]) => {
    onChange({ ...parameters, tenor: value[0] })
  }

  const handleInterestRateChange = (value: number[]) => {
    onChange({ ...parameters, interestRate: value[0] })
  }

  const handleCouponFrequencyChange = (value: string) => {
    onChange({
      ...parameters,
      couponFrequency: value as "monthly" | "quarterly" | "semi-annual" | "annual" | "maturity",
    })
  }

  const handleHalalToggle = (checked: boolean) => {
    onChange({ ...parameters, isHalal: checked })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...parameters, name: e.target.value })
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Bond Name */}
          <div className="space-y-2">
            <Label htmlFor="bond-name">Bond Name (Optional)</Label>
            <Input
              id="bond-name"
              placeholder="My Temporal Bond"
              value={parameters.name || ""}
              onChange={handleNameChange}
              disabled={disabled}
            />
          </div>

          {/* Principal Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="principal">Principal Amount (ETH)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">The amount of ETH you want to invest in this bond.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="principal"
              type="number"
              min="0.1"
              step="0.1"
              value={parameters.principal}
              onChange={handlePrincipalChange}
              disabled={disabled}
            />
          </div>

          {/* Tenor (Duration) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Tenor (Days)</Label>
              <span className="text-sm font-medium">{parameters.tenor} days</span>
            </div>
            <Slider
              defaultValue={[parameters.tenor]}
              min={30}
              max={365}
              step={30}
              onValueChange={handleTenorChange}
              disabled={disabled}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30 days</span>
              <span>180 days</span>
              <span>365 days</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Interest Rate</Label>
              <span className="text-sm font-medium">{parameters.interestRate}%</span>
            </div>
            <Slider
              defaultValue={[parameters.interestRate]}
              min={1}
              max={15}
              step={0.5}
              onValueChange={handleInterestRateChange}
              disabled={disabled}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1%</span>
              <span>8%</span>
              <span>15%</span>
            </div>
          </div>

          {/* Coupon Frequency */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Coupon Frequency</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">How often interest payments are distributed.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <RadioGroup
              value={parameters.couponFrequency}
              onValueChange={handleCouponFrequencyChange}
              className="flex flex-col space-y-1"
              disabled={disabled}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="cursor-pointer">
                  Monthly
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="quarterly" id="quarterly" />
                <Label htmlFor="quarterly" className="cursor-pointer">
                  Quarterly
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="semi-annual" id="semi-annual" />
                <Label htmlFor="semi-annual" className="cursor-pointer">
                  Semi-Annual
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="annual" id="annual" />
                <Label htmlFor="annual" className="cursor-pointer">
                  Annual
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maturity" id="maturity" />
                <Label htmlFor="maturity" className="cursor-pointer">
                  At Maturity
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Halal Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="halal-toggle">Halal Compliant</Label>
              <p className="text-sm text-muted-foreground">Ensures bond follows Islamic finance principles</p>
            </div>
            <Switch
              id="halal-toggle"
              checked={parameters.isHalal}
              onCheckedChange={handleHalalToggle}
              disabled={disabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
