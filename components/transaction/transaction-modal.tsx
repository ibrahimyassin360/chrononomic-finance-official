"use client"

import { useState, useEffect } from "react"
import { useTransaction } from "@/hooks/use-transaction"
import type { TransactionType } from "@/types/transaction"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useWallet } from "@/contexts/wallet-provider"
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react"
import TransactionDetails from "./transaction-details"
import TransactionConfirmation from "./transaction-confirmation"
import TransactionSuccess from "./transaction-success"

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  defaultType?: TransactionType
}

export default function TransactionModal({ isOpen, onClose, defaultType = "buy" }: TransactionModalProps) {
  const { isConnected, connect } = useWallet()
  const [type, setType] = useState<TransactionType>(defaultType)
  const [amount, setAmount] = useState("")
  const [step, setStep] = useState<"input" | "confirm" | "success">("input")

  const {
    priceData,
    gasPrices,
    settings,
    details,
    state,
    calculateTransaction,
    updateSettings,
    executeTransaction,
    resetTransaction,
    refreshPrices,
  } = useTransaction()

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("input")
        setAmount("")
        resetTransaction()
      }, 200)
    }
  }, [isOpen, resetTransaction])

  // Calculate transaction details when inputs change
  useEffect(() => {
    if (amount && priceData && gasPrices) {
      calculateTransaction(type, amount, type === "buy" ? "eth" : "chronon")
    }
  }, [amount, type, calculateTransaction, settings, priceData, gasPrices])

  // Handle amount input change
  const handleAmountChange = (value: string) => {
    // Allow only numbers and a single decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  // Handle slippage tolerance change
  const handleSlippageChange = (value: number[]) => {
    updateSettings({ slippageTolerance: value[0] })
  }

  // Handle gas preset change
  const handleGasPresetChange = (value: string) => {
    updateSettings({ gasPreset: value as "standard" | "fast" | "instant" })
  }

  // Handle transaction execution
  const handleExecute = async () => {
    if (!isConnected) {
      await connect()
      return
    }

    if (step === "input") {
      setStep("confirm")
      return
    }

    const success = await executeTransaction()
    if (success) {
      setStep("success")
    }
  }

  // Handle back button
  const handleBack = () => {
    if (step === "confirm") {
      setStep("input")
    }
  }

  // Handle close
  const handleClose = () => {
    if (state.isSubmitting) return
    onClose()
  }

  // Format the last updated time
  const formatLastUpdated = () => {
    if (!priceData) return ""

    const now = new Date()
    const diff = Math.floor((now.getTime() - priceData.lastUpdated.getTime()) / 1000)

    if (diff < 60) {
      return `${diff} seconds ago`
    } else {
      return `${Math.floor(diff / 60)} minutes ago`
    }
  }

  // Determine if the execute button should be disabled
  const isExecuteDisabled =
    !amount ||
    Number.parseFloat(amount) <= 0 ||
    state.isLoading ||
    state.isSubmitting ||
    (step === "input" && !details) ||
    !priceData ||
    !gasPrices

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === "success" ? "Transaction Successful" : `${type === "buy" ? "Buy" : "Sell"} Chronon`}
          </DialogTitle>
          <DialogDescription>
            {step === "success"
              ? "Your transaction has been confirmed."
              : step === "confirm"
                ? "Review your transaction details before confirming."
                : "Enter the amount you want to trade."}
          </DialogDescription>
        </DialogHeader>

        {state.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {step === "input" && (
          <>
            {priceData && (
              <div className="flex justify-between items-center text-sm mb-4">
                <div>
                  <span className="text-gray-500">1 χ = </span>
                  <span className="font-medium">${priceData.chronon.usd.toFixed(2)}</span>
                  <span className="text-gray-500 ml-2">|</span>
                  <span className="font-medium ml-2">{priceData.chronon.eth.toFixed(6)} ETH</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 text-xs mr-2">{formatLastUpdated()}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={refreshPrices}
                    disabled={state.isLoading}
                  >
                    {state.isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            )}

            <Tabs value={type} onValueChange={(v) => setType(v as TransactionType)} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="buy">Buy Chronon</TabsTrigger>
                <TabsTrigger value="sell">Sell Chronon</TabsTrigger>
              </TabsList>

              <TabsContent value="buy" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buy-amount">Amount (ETH)</Label>
                  <div className="relative">
                    <Input
                      id="buy-amount"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="pr-16"
                      disabled={state.isLoading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-sm text-gray-500">ETH</span>
                    </div>
                  </div>
                  {details && priceData && (
                    <div className="text-sm text-gray-500">
                      ≈ {Number.parseFloat(details.outputAmount).toFixed(4)} χ
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="sell" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sell-amount">Amount (χ)</Label>
                  <div className="relative">
                    <Input
                      id="sell-amount"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="pr-16"
                      disabled={state.isLoading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-sm text-gray-500">χ</span>
                    </div>
                  </div>
                  {details && priceData && (
                    <div className="text-sm text-gray-500">
                      ≈ {Number.parseFloat(details.outputAmount).toFixed(4)} ETH
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Slippage Tolerance</Label>
                  <span className="text-sm font-medium">{settings.slippageTolerance.toFixed(1)}%</span>
                </div>
                <Slider
                  defaultValue={[settings.slippageTolerance]}
                  min={0.1}
                  max={5.0}
                  step={0.1}
                  onValueChange={handleSlippageChange}
                  disabled={state.isLoading}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0.1%</span>
                  <span>5.0%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Transaction Speed</Label>
                <RadioGroup
                  defaultValue={settings.gasPreset}
                  onValueChange={handleGasPresetChange}
                  className="flex space-x-2"
                  disabled={state.isLoading}
                >
                  <div className="flex items-center space-x-2 border rounded-md p-2 flex-1">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="cursor-pointer">
                      Standard
                      {gasPrices && <div className="text-xs text-gray-500">{gasPrices.standard} Gwei</div>}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-2 flex-1">
                    <RadioGroupItem value="fast" id="fast" />
                    <Label htmlFor="fast" className="cursor-pointer">
                      Fast
                      {gasPrices && <div className="text-xs text-gray-500">{gasPrices.fast} Gwei</div>}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-2 flex-1">
                    <RadioGroupItem value="instant" id="instant" />
                    <Label htmlFor="instant" className="cursor-pointer">
                      Instant
                      {gasPrices && <div className="text-xs text-gray-500">{gasPrices.instant} Gwei</div>}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {details && <TransactionDetails details={details} />}
            </div>
          </>
        )}

        {step === "confirm" && details && <TransactionConfirmation details={details} />}

        {step === "success" && state.hash && <TransactionSuccess hash={state.hash} details={details} />}

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {step === "confirm" && (
            <Button variant="outline" onClick={handleBack} disabled={state.isSubmitting} className="sm:mr-auto">
              Back
            </Button>
          )}

          {step !== "success" ? (
            <Button onClick={handleExecute} disabled={isExecuteDisabled} className="w-full sm:w-auto">
              {state.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {step === "confirm" ? "Confirming..." : "Processing..."}
                </>
              ) : state.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : !isConnected ? (
                "Connect Wallet"
              ) : step === "confirm" ? (
                "Confirm Transaction"
              ) : (
                "Continue"
              )}
            </Button>
          ) : (
            <Button onClick={handleClose} className="w-full sm:w-auto">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
