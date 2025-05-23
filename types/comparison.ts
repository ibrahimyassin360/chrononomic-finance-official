import type { BondClass } from "./bond-classes"

export interface SavedComparison {
  id: string
  name: string
  description?: string
  bondClasses: BondClass[]
  createdAt: string
  lastModified: string
}

export interface ComparisonSettings {
  investmentAmount: number
  timeHorizon: number
  riskTolerance: "low" | "medium" | "high"
  includeFeatures: boolean
  includeYield: boolean
  includeRisk: boolean
  includeMaturity: boolean
}

export interface FullComparisonSetup {
  id: string
  name: string
  description?: string
  bondClasses: BondClass[]
  settings: ComparisonSettings
  createdAt: string
  lastModified: string
}
