"use client"

import { useState, useEffect } from "react"
import type { BondClass } from "@/types/bond-classes"
import type { ComparisonSettings, FullComparisonSetup, SavedComparison } from "@/types/comparison"
import {
  getSavedComparisons,
  saveComparison,
  getComparisonSetup,
  updateComparison,
  deleteComparison,
} from "@/services/comparison-service"

const defaultSettings: ComparisonSettings = {
  investmentAmount: 1,
  timeHorizon: 5,
  riskTolerance: "medium",
  includeFeatures: true,
  includeYield: true,
  includeRisk: true,
  includeMaturity: true,
}

export function useComparison() {
  const [selectedBondClasses, setSelectedBondClasses] = useState<BondClass[]>([])
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([])
  const [activeComparison, setActiveComparison] = useState<FullComparisonSetup | null>(null)
  const [settings, setSettings] = useState<ComparisonSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(false)

  // Load saved comparisons on mount
  useEffect(() => {
    const comparisons = getSavedComparisons()
    setSavedComparisons(comparisons)
  }, [])

  // Save current comparison
  const saveCurrentComparison = (name: string, description?: string) => {
    if (selectedBondClasses.length === 0) {
      throw new Error("Cannot save comparison with no bond classes selected")
    }

    const savedComparison = saveComparison(name, selectedBondClasses, description, settings)
    setSavedComparisons([...savedComparisons, savedComparison])
    setActiveComparison({
      ...savedComparison,
      settings,
    })

    return savedComparison
  }

  // Load a saved comparison
  const loadComparison = (id: string) => {
    setIsLoading(true)
    try {
      const setup = getComparisonSetup(id)
      if (setup) {
        setSelectedBondClasses(setup.bondClasses)
        setSettings(setup.settings)
        setActiveComparison(setup)
      }
    } catch (error) {
      console.error("Error loading comparison:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Update a saved comparison
  const updateSavedComparison = (
    id: string,
    updates: Partial<SavedComparison & { settings: Partial<ComparisonSettings> }>,
  ) => {
    const updated = updateComparison(id, updates)
    if (updated) {
      setSavedComparisons(getSavedComparisons())
      if (activeComparison?.id === id) {
        setActiveComparison(updated)
      }
    }
    return updated
  }

  // Delete a saved comparison
  const deleteSavedComparison = (id: string) => {
    const deleted = deleteComparison(id)
    if (deleted) {
      setSavedComparisons(getSavedComparisons())
      if (activeComparison?.id === id) {
        setActiveComparison(null)
      }
    }
    return deleted
  }

  // Update settings
  const updateSettings = (newSettings: Partial<ComparisonSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)

    // If there's an active comparison, update it
    if (activeComparison) {
      updateSavedComparison(activeComparison.id, { settings: updatedSettings })
    }

    return updatedSettings
  }

  // Add a bond class to the comparison
  const addBondClass = (bondClass: BondClass) => {
    if (selectedBondClasses.includes(bondClass)) {
      return false
    }

    setSelectedBondClasses([...selectedBondClasses, bondClass])
    return true
  }

  // Remove a bond class from the comparison
  const removeBondClass = (bondClass: BondClass) => {
    setSelectedBondClasses(selectedBondClasses.filter((bc) => bc !== bondClass))
  }

  // Clear the current comparison
  const clearComparison = () => {
    setSelectedBondClasses([])
    setSettings(defaultSettings)
    setActiveComparison(null)
  }

  return {
    selectedBondClasses,
    savedComparisons,
    activeComparison,
    settings,
    isLoading,
    saveCurrentComparison,
    loadComparison,
    updateSavedComparison,
    deleteSavedComparison,
    updateSettings,
    addBondClass,
    removeBondClass,
    clearComparison,
  }
}
