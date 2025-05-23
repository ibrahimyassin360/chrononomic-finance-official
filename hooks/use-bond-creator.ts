"use client"

import { useState, useEffect } from "react"
import type { BondParameters, BondPreview, BondCreationResult, CouponPayment } from "@/types/bond-creator"
import { useWallet } from "@/contexts/wallet-context"
import { createFixedRateBond } from "@/services/bond-contract-service"
import { ethToUsd } from "@/services/price-feed-service"

export function useBondCreator() {
  const { account, isPreview } = useWallet()
  const [parameters, setParameters] = useState<BondParameters>({
    principal: 1,
    tenor: 90,
    interestRate: 5,
    couponFrequency: "quarterly",
    isHalal: false,
  })
  const [preview, setPreview] = useState<BondPreview | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [principalUsd, setPrincipalUsd] = useState<number | null>(null)

  // Calculate bond preview whenever parameters change
  useEffect(() => {
    calculatePreview(parameters)
  }, [parameters])

  // Get USD value of principal
  useEffect(() => {
    const fetchUsdValue = async () => {
      try {
        const usdValue = await ethToUsd(parameters.principal, isPreview)
        setPrincipalUsd(usdValue)
      } catch (err) {
        console.error("Error fetching USD value:", err)
        setPrincipalUsd(null)
      }
    }

    fetchUsdValue()
  }, [parameters.principal, isPreview])

  // Calculate bond preview based on parameters
  const calculatePreview = (params: BondParameters) => {
    try {
      const now = new Date()
      const maturityDate = new Date(now.getTime() + params.tenor * 24 * 60 * 60 * 1000)

      // Calculate coupon payments
      const couponPayments: CouponPayment[] = []

      // Handle different coupon frequencies
      if (params.couponFrequency === "maturity") {
        // Single payment at maturity
        const amount = params.principal * (params.interestRate / 100)
        couponPayments.push({
          date: maturityDate,
          amount,
          isPaid: false,
        })
      } else {
        // Calculate payment interval in days
        let intervalDays = 0
        switch (params.couponFrequency) {
          case "monthly":
            intervalDays = 30
            break
          case "quarterly":
            intervalDays = 90
            break
          case "semi-annual":
            intervalDays = 180
            break
          case "annual":
            intervalDays = 365
            break
        }

        // Calculate number of payments
        const numPayments = Math.max(1, Math.floor(params.tenor / intervalDays))
        const paymentAmount = (params.principal * (params.interestRate / 100)) / (365 / intervalDays)

        // Create payment schedule
        for (let i = 1; i <= numPayments; i++) {
          const paymentDate = new Date(now.getTime() + i * intervalDays * 24 * 60 * 60 * 1000)
          // If payment date is after maturity, use maturity date
          const actualDate = paymentDate > maturityDate ? maturityDate : paymentDate

          couponPayments.push({
            date: actualDate,
            amount: paymentAmount,
            isPaid: false,
          })
        }
      }

      // Calculate total return
      const totalInterest = couponPayments.reduce((sum, payment) => sum + payment.amount, 0)
      const totalReturn = params.principal + totalInterest

      // Calculate effective annual yield
      const daysInYear = 365
      const effectiveYield = (totalInterest / params.principal) * (daysInYear / params.tenor) * 100

      setPreview({
        maturityDate,
        totalReturn,
        effectiveYield,
        couponPayments,
        principalReturnDate: maturityDate,
      })

      setError(null)
    } catch (err) {
      console.error("Error calculating bond preview:", err)
      setError("Failed to calculate bond preview. Please check your inputs.")
    }
  }

  // Create bond
  const createBond = async (): Promise<BondCreationResult> => {
    setIsCreating(true)
    setError(null)

    try {
      if (!account) {
        throw new Error("Wallet not connected")
      }

      if (!preview) {
        throw new Error("Bond preview not available")
      }

      // Call the contract service to create the bond
      const result = await createFixedRateBond(parameters, account)

      if (!result.success) {
        throw new Error(result.error || "Failed to create bond")
      }

      return result
    } catch (err: any) {
      console.error("Error creating bond:", err)
      setError(err.message || "Failed to create bond. Please try again.")

      return {
        success: false,
        error: err.message || "Failed to create bond. Please try again.",
      }
    } finally {
      setIsCreating(false)
    }
  }

  return {
    parameters,
    setParameters,
    preview,
    isCreating,
    error,
    createBond,
    isPreview,
    principalUsd,
  }
}
