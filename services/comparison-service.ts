import type { BondClass } from "@/types/bond-classes"
import type { FullComparisonSetup, SavedComparison, ComparisonSettings } from "@/types/comparison"
import { isBrowser } from "@/lib/environment"

const STORAGE_KEY = "chrononomic-saved-comparisons"

const defaultSettings: ComparisonSettings = {
  investmentAmount: 1,
  timeHorizon: 5,
  riskTolerance: "medium",
  includeFeatures: true,
  includeYield: true,
  includeRisk: true,
  includeMaturity: true,
}

export function getSavedComparisons(): SavedComparison[] {
  if (!isBrowser()) return []

  try {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (!savedData) return []

    return JSON.parse(savedData)
  } catch (error) {
    console.error("Error loading saved comparisons:", error)
    return []
  }
}

export function saveComparison(
  name: string,
  bondClasses: BondClass[],
  description?: string,
  settings?: Partial<ComparisonSettings>,
): SavedComparison {
  if (!isBrowser()) throw new Error("Cannot save comparison on server")

  const savedComparisons = getSavedComparisons()

  const newComparison: SavedComparison = {
    id: `comparison-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name,
    description,
    bondClasses,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  }

  const fullSetup: FullComparisonSetup = {
    ...newComparison,
    settings: {
      ...defaultSettings,
      ...settings,
    },
  }

  // Store the full setup in a separate key
  localStorage.setItem(`comparison-setup-${newComparison.id}`, JSON.stringify(fullSetup))

  // Add to the list of saved comparisons
  savedComparisons.push(newComparison)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedComparisons))

  return newComparison
}

export function getComparisonSetup(id: string): FullComparisonSetup | null {
  if (!isBrowser()) return null

  try {
    const setupData = localStorage.getItem(`comparison-setup-${id}`)
    if (!setupData) return null

    return JSON.parse(setupData)
  } catch (error) {
    console.error("Error loading comparison setup:", error)
    return null
  }
}

export function updateComparison(
  id: string,
  updates: Partial<SavedComparison & { settings: Partial<ComparisonSettings> }>,
): FullComparisonSetup | null {
  if (!isBrowser()) return null

  const savedComparisons = getSavedComparisons()
  const comparisonIndex = savedComparisons.findIndex((c) => c.id === id)

  if (comparisonIndex === -1) return null

  // Get the full setup
  const fullSetup = getComparisonSetup(id)
  if (!fullSetup) return null

  // Update the comparison
  const updatedComparison: SavedComparison = {
    ...savedComparisons[comparisonIndex],
    ...updates,
    lastModified: new Date().toISOString(),
  }

  // Update the full setup
  const updatedSetup: FullComparisonSetup = {
    ...fullSetup,
    ...updatedComparison,
    settings: {
      ...fullSetup.settings,
      ...(updates.settings || {}),
    },
  }

  // Save the updated setup
  localStorage.setItem(`comparison-setup-${id}`, JSON.stringify(updatedSetup))

  // Update the list of saved comparisons
  savedComparisons[comparisonIndex] = updatedComparison
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedComparisons))

  return updatedSetup
}

export function deleteComparison(id: string): boolean {
  if (!isBrowser()) return false

  const savedComparisons = getSavedComparisons()
  const filteredComparisons = savedComparisons.filter((c) => c.id !== id)

  if (filteredComparisons.length === savedComparisons.length) {
    return false // Nothing was deleted
  }

  // Remove the full setup
  localStorage.removeItem(`comparison-setup-${id}`)

  // Update the list of saved comparisons
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredComparisons))

  return true
}
