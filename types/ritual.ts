export interface RitualBond {
  id: string
  name: string
  amount: number
  value: number
  interestRate: number
  baseInterestRate: number
  bonusRate: number
  maturityDate: Date
  purchaseDate: Date
  status: "active" | "matured" | "claimed"
  ritualParticipation: number
  nextRitualDate: Date
  ritualHistory: RitualEvent[]
  ritualFrequency: number // in days
}

export interface RitualEvent {
  id: string
  bondId: string
  date: Date
  participated: boolean
  bonusEarned: number
  phase: "dawn" | "dusk"
  status: "upcoming" | "active" | "missed" | "completed"
}

export interface RitualParticipationResult {
  success: boolean
  newParticipationRate: number
  bonusEarned: number
  nextRitualDate: Date
  error?: string
}

export type RitualPhase = "dawn" | "dusk"

export interface RitualState {
  isActive: boolean
  currentPhase: RitualPhase | null
  nextPhase: RitualPhase
  nextRitualTime: Date
  timeRemaining: number
  canParticipate: boolean
}
