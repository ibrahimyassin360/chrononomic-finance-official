"use client"

import type { BondPreview } from "@/types/bond-creator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, getDaysRemaining } from "@/services/bond-service"
import { Progress } from "@/components/ui/progress"

interface BondPreviewProps {
  preview: BondPreview | null
  principal: number
  isHalal: boolean
}

export function BondPreviewComponent({ preview, principal, isHalal }: BondPreviewProps) {
  if (!preview) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Bond Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Configure your bond to see a preview</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bond Preview</CardTitle>
        {isHalal && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Halal
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Principal</p>
            <p className="text-xl font-semibold">{principal.toFixed(2)} ETH</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Return</p>
            <p className="text-xl font-semibold">{preview.totalReturn.toFixed(2)} ETH</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Maturity Date</p>
            <p className="text-xl font-semibold">{formatDate(preview.maturityDate)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Effective Yield</p>
            <p className="text-xl font-semibold">{preview.effectiveYield.toFixed(2)}%</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Bond Timeline</h4>
          <div className="relative pt-2 pb-4">
            <div className="absolute left-0 top-7 bottom-0 w-px bg-border ml-3"></div>

            {/* Issue Date */}
            <div className="relative flex items-center mb-6">
              <div className="z-10 flex items-center justify-center w-6 h-6 bg-primary rounded-full">
                <div className="w-2 h-2 bg-background rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Issue Date</p>
                <p className="text-xs text-muted-foreground">{formatDate(new Date())}</p>
              </div>
            </div>

            {/* Coupon Payments */}
            {preview.couponPayments.map((payment, index) => (
              <div key={index} className="relative flex items-center mb-6">
                <div className="z-10 flex items-center justify-center w-6 h-6 bg-muted border border-border rounded-full">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <p className="text-sm font-medium">Coupon Payment {index + 1}</p>
                    <Badge variant="outline" className="ml-2 text-xs">
                      +{payment.amount.toFixed(4)} ETH
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
                </div>
              </div>
            ))}

            {/* Maturity Date */}
            <div className="relative flex items-center">
              <div className="z-10 flex items-center justify-center w-6 h-6 bg-primary rounded-full">
                <div className="w-2 h-2 bg-background rounded-full"></div>
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <p className="text-sm font-medium">Maturity Date</p>
                  <Badge variant="outline" className="ml-2 text-xs">
                    +{principal.toFixed(2)} ETH
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(preview.maturityDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Today</span>
            <span>Maturity</span>
          </div>
          <Progress value={0} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {getDaysRemaining(preview.maturityDate)} days remaining
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
