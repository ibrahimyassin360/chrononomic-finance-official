"use client"

import type { BondParameters, BondPreview } from "@/types/bond-creator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/services/bond-service"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface BondCreationConfirmationProps {
  isOpen: boolean
  onClose: () => void
  parameters: BondParameters
  preview: BondPreview | null
  onConfirm: () => void
  isCreating: boolean
  isSuccess: boolean
  error: string | null
  transactionHash?: string
  bondId?: string
}

export function BondCreationConfirmation({
  isOpen,
  onClose,
  parameters,
  preview,
  onConfirm,
  isCreating,
  isSuccess,
  error,
  transactionHash,
  bondId,
}: BondCreationConfirmationProps) {
  if (!preview) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {!isSuccess && !error && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Bond Creation</DialogTitle>
              <DialogDescription>Please review the details of your temporal bond before confirming.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Principal</p>
                  <p className="font-medium">{parameters.principal} ETH</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="font-medium">{parameters.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tenor</p>
                  <p className="font-medium">{parameters.tenor} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Coupon Frequency</p>
                  <p className="font-medium">{parameters.couponFrequency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Maturity Date</p>
                  <p className="font-medium">{formatDate(preview.maturityDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Return</p>
                  <p className="font-medium">{preview.totalReturn.toFixed(4)} ETH</p>
                </div>
              </div>

              <Separator />

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  By creating this bond, you are committing {parameters.principal} ETH for {parameters.tenor} days.
                  Early redemption may result in penalties.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isCreating}>
                Cancel
              </Button>
              <Button onClick={onConfirm} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Bond"}
              </Button>
            </DialogFooter>
          </>
        )}

        {isSuccess && (
          <>
            <DialogHeader>
              <DialogTitle>Bond Created Successfully</DialogTitle>
              <DialogDescription>Your temporal bond has been created and added to your portfolio.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center py-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Bond ID</p>
                <p className="font-medium font-mono text-sm bg-muted p-2 rounded">{bondId}</p>
              </div>

              {transactionHash && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Transaction Hash</p>
                  <p className="font-medium font-mono text-sm bg-muted p-2 rounded truncate">{transactionHash}</p>
                </div>
              )}

              <Alert variant="success">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your bond will start accruing interest immediately. You can view it in your bond portfolio.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button onClick={onClose}>Close</Button>
            </DialogFooter>
          </>
        )}

        {error && (
          <>
            <DialogHeader>
              <DialogTitle>Bond Creation Failed</DialogTitle>
              <DialogDescription>There was an error creating your bond.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onConfirm}>Try Again</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
