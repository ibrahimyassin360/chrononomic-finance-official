"use client"

import { useState } from "react"
import { BondCreatorForm } from "./bond-creator-form"
import { BondPreviewComponent } from "./bond-preview"
import { BondCreationConfirmation } from "./bond-creation-confirmation"
import { useBondCreator } from "@/hooks/use-bond-creator"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function BondCreator() {
  const { account, connect } = useWallet()
  const { parameters, setParameters, preview, isCreating, error: creationError, createBond } = useBondCreator()

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [creationResult, setCreationResult] = useState<{
    success: boolean
    bondId?: string
    transactionHash?: string
    error?: string
  } | null>(null)

  const handleCreateBond = async () => {
    setIsConfirmationOpen(true)
  }

  const handleConfirmCreation = async () => {
    const result = await createBond()
    setCreationResult(result)
  }

  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false)
    if (creationResult?.success) {
      // Reset form after successful creation
      setParameters({
        principal: 1,
        tenor: 90,
        interestRate: 5,
        couponFrequency: "quarterly",
        isHalal: false,
      })
      setCreationResult(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Create Temporal Bond</h2>

          {!account && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet not connected</AlertTitle>
              <AlertDescription>
                Please connect your wallet to create a bond.
                <Button variant="link" className="p-0 h-auto font-normal" onClick={connect}>
                  Connect Wallet
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <BondCreatorForm parameters={parameters} onChange={setParameters} disabled={isCreating || !account} />

          <div className="mt-6">
            <Button
              className="w-full"
              size="lg"
              onClick={handleCreateBond}
              disabled={isCreating || !account || !preview}
            >
              {isCreating ? "Creating Bond..." : "Create Bond"}
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Bond Preview</h2>
          <BondPreviewComponent preview={preview} principal={parameters.principal} isHalal={parameters.isHalal} />
        </div>
      </div>

      <BondCreationConfirmation
        isOpen={isConfirmationOpen}
        onClose={handleCloseConfirmation}
        parameters={parameters}
        preview={preview}
        onConfirm={handleConfirmCreation}
        isCreating={isCreating}
        isSuccess={creationResult?.success || false}
        error={creationResult?.error || creationError}
        transactionHash={creationResult?.transactionHash}
        bondId={creationResult?.bondId}
      />
    </div>
  )
}
