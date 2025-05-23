"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "@/hooks/use-wallet"
import type { RitualBond, RitualParticipationResult, RitualState } from "@/types/ritual"
import { participateInRitual } from "@/lib/bond-utils"

export function useRitual(bond?: RitualBond) {
  const { account } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [participationResult, setParticipationResult] = useState<RitualParticipationResult | null>(null)
  const [ritualState, setRitualState] = useState<RitualState>({
    isActive: false,
    currentPhase: null,
    nextPhase: bond?.name.toLowerCase().includes("dawn") ? "dawn" : "dusk",
    nextRitualTime: bond?.nextRitualDate || new Date(),
    timeRemaining: 0,
    canParticipate: false,
  })

  // Calculate time remaining until next ritual
  useEffect(() => {
    if (!bond) return

    const interval = setInterval(() => {
      const now = new Date()
      const nextRitual = bond.nextRitualDate

      // Time remaining in milliseconds
      const timeRemaining = nextRitual.getTime() - now.getTime()

      // Determine if ritual is active (within 1 hour window)
      const isActive = timeRemaining <= 3600000 && timeRemaining > -3600000

      // Determine if user can participate
      const canParticipate =
        isActive &&
        bond.status === "active" &&
        bond.ritualParticipation < 100 &&
        !bond.ritualHistory.some((r) => r.date.toDateString() === now.toDateString() && r.participated)

      // Determine current phase
      const currentPhase = isActive ? (bond.name.toLowerCase().includes("dawn") ? "dawn" : "dusk") : null

      setRitualState({
        isActive,
        currentPhase,
        nextPhase: bond.name.toLowerCase().includes("dawn") ? "dawn" : "dusk",
        nextRitualTime: nextRitual,
        timeRemaining: Math.max(0, timeRemaining),
        canParticipate,
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [bond])

  // Handle ritual participation
  const participateInCurrentRitual = useCallback(async () => {
    if (!bond || !account) return

    setLoading(true)
    setError(null)

    try {
      const success = await participateInRitual(account, bond.id)

      if (success) {
        // Calculate new values based on participation
        const newParticipationRate = Math.min(bond.ritualParticipation + 10, 100)
        const bonusEarned = ((bond.amount * bond.bonusRate) / 100) * (10 / 100)

        // Calculate next ritual date (typically 7 or 14 days from now)
        const nextRitualDate = new Date()
        nextRitualDate.setDate(nextRitualDate.getDate() + bond.ritualFrequency)

        const result: RitualParticipationResult = {
          success: true,
          newParticipationRate,
          bonusEarned,
          nextRitualDate,
        }

        setParticipationResult(result)

        // Update the ritual state
        setRitualState((prev) => ({
          ...prev,
          canParticipate: false,
          nextRitualTime: nextRitualDate,
        }))
      }
    } catch (err: any) {
      console.error("Error participating in ritual:", err)
      setError(err.message || "Failed to participate in ritual")
    } finally {
      setLoading(false)
    }
  }, [bond, account])

  // Reset participation result
  const resetResult = useCallback(() => {
    setParticipationResult(null)
  }, [])

  return {
    ritualState,
    loading,
    error,
    participationResult,
    participateInCurrentRitual,
    resetResult,
  }
}

// Helper function to format time remaining
export function formatTimeRemaining(milliseconds: number): string {
  if (milliseconds <= 0) return "00:00:00"

  const seconds = Math.floor((milliseconds / 1000) % 60)
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60)
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24)
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24))

  if (days > 0) {
    return `${days}d ${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}
