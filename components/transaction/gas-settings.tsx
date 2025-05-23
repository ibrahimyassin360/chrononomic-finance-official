"use client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface GasSettingsProps {
  selectedSpeed: "slow" | "standard" | "fast" | "rapid"
  onSpeedChange: (speed: "slow" | "standard" | "fast" | "rapid") => void
  estimatedCostEth?: string
  estimatedCostUsd?: string
  disabled?: boolean
}

export function GasSettings({
  selectedSpeed,
  onSpeedChange,
  estimatedCostEth,
  estimatedCostUsd,
  disabled = false,
}: GasSettingsProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Transaction Speed</h4>
        {estimatedCostEth ? (
          <div className="text-xs text-muted-foreground">
            Est. Gas: {estimatedCostEth} ETH (${estimatedCostUsd})
          </div>
        ) : (
          <div className="flex items-center text-xs text-muted-foreground">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Estimating gas...
          </div>
        )}
      </div>

      <RadioGroup
        value={selectedSpeed}
        onValueChange={(value) => onSpeedChange(value as "slow" | "standard" | "fast" | "rapid")}
        className="grid grid-cols-4 gap-2"
        disabled={disabled}
      >
        <div>
          <RadioGroupItem value="slow" id="slow" className="peer sr-only" />
          <Label
            htmlFor="slow"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <span className="text-xs font-semibold">Slow</span>
            <span className="text-[10px] text-muted-foreground">Cheaper</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="standard" id="standard" className="peer sr-only" />
          <Label
            htmlFor="standard"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <span className="text-xs font-semibold">Standard</span>
            <span className="text-[10px] text-muted-foreground">Recommended</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="fast" id="fast" className="peer sr-only" />
          <Label
            htmlFor="fast"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <span className="text-xs font-semibold">Fast</span>
            <span className="text-[10px] text-muted-foreground">Faster</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="rapid" id="rapid" className="peer sr-only" />
          <Label
            htmlFor="rapid"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <span className="text-xs font-semibold">Rapid</span>
            <span className="text-[10px] text-muted-foreground">Fastest</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
