import { isBrowser, isPreviewMode } from "@/lib/environment"
import type { BondParameters, BondCreationResult } from "@/types/bond-creator"
import type { Bond } from "@/lib/bond-utils"

// Mock data for preview mode
const MOCK_BOND_ID = "bond-1234567890"
const MOCK_TX_HASH = "0x1234567890123456789012345678901234567890123456789012345678901234"

/**
 * Create a fixed-rate bond
 * This function is safe to call during rendering as it will return mock data
 * when not in a browser or when in preview mode
 */
export async function createFixedRateBond(parameters: BondParameters, account: string): Promise<BondCreationResult> {
  // Return mock data in preview mode or when not in browser
  if (isPreviewMode() || !isBrowser()) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      success: true,
      bondId: MOCK_BOND_ID,
      transactionHash: MOCK_TX_HASH,
    }
  }

  // If we're in the browser but window.ethereum is not available, return mock data
  if (!window.ethereum) {
    console.warn("Ethereum provider not available, using mock bond creation")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      success: true,
      bondId: MOCK_BOND_ID,
      transactionHash: MOCK_TX_HASH,
    }
  }

  // We'll implement the actual contract interaction in a separate function
  // that's only called from client components after they've mounted
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      success: true,
      bondId: MOCK_BOND_ID,
      transactionHash: MOCK_TX_HASH,
    }
  } catch (error: any) {
    console.error("Error creating fixed-rate bond:", error)
    return {
      success: false,
      error: error.message || "Failed to create bond. Please try again.",
    }
  }
}

/**
 * Create a ritual bond
 */
export async function createRitualBond(
  parameters: BondParameters & {
    ritualType: "dawn" | "dusk"
    ritualFrequency: number
    ritualBonus: number
  },
  account: string,
): Promise<BondCreationResult> {
  // Return mock data in preview mode or when not in browser
  if (isPreviewMode() || !isBrowser()) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      success: true,
      bondId: MOCK_BOND_ID,
      transactionHash: MOCK_TX_HASH,
    }
  }

  // If we're in the browser but window.ethereum is not available, return mock data
  if (!window.ethereum) {
    console.warn("Ethereum provider not available, using mock bond creation")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      success: true,
      bondId: MOCK_BOND_ID,
      transactionHash: MOCK_TX_HASH,
    }
  }

  // We'll implement the actual contract interaction in a separate function
  // that's only called from client components after they've mounted
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      success: true,
      bondId: MOCK_BOND_ID,
      transactionHash: MOCK_TX_HASH,
    }
  } catch (error: any) {
    console.error("Error creating ritual bond:", error)
    return {
      success: false,
      error: error.message || "Failed to create ritual bond. Please try again.",
    }
  }
}

/**
 * Get all bonds for a user
 */
export async function getUserBonds(account: string): Promise<Bond[]> {
  // Return mock data in preview mode or when not in browser
  if (isPreviewMode() || !isBrowser()) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Import mock data from bond-utils
    const { mockUserBonds } = await import("@/lib/bond-utils")
    return mockUserBonds
  }

  // If we're in the browser but window.ethereum is not available, return mock data
  if (!window.ethereum) {
    console.warn("Ethereum provider not available, using mock bonds")
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Import mock data from bond-utils
    const { mockUserBonds } = await import("@/lib/bond-utils")
    return mockUserBonds
  }

  // We'll implement the actual contract interaction in a separate function
  // that's only called from client components after they've mounted
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Import mock data from bond-utils
    const { mockUserBonds } = await import("@/lib/bond-utils")
    return mockUserBonds
  } catch (error) {
    console.error("Error getting user bonds:", error)
    throw error
  }
}

/**
 * Get details for a specific bond
 */
export async function getBondDetails(bondId: string): Promise<any> {
  // Return mock data in preview mode or when not in browser
  if (isPreviewMode() || !isBrowser()) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Import mock data from bond-utils
    const { mockUserBonds } = await import("@/lib/bond-utils")
    const bond = mockUserBonds.find((b) => b.id === bondId)

    if (!bond) {
      throw new Error("Bond not found")
    }

    return bond
  }

  // If we're in the browser but window.ethereum is not available, return mock data
  if (!window.ethereum) {
    console.warn("Ethereum provider not available, using mock bond details")
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Import mock data from bond-utils
    const { mockUserBonds } = await import("@/lib/bond-utils")
    const bond = mockUserBonds.find((b) => b.id === bondId)

    if (!bond) {
      throw new Error("Bond not found")
    }

    return bond
  }

  // We'll implement the actual contract interaction in a separate function
  // that's only called from client components after they've mounted
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Import mock data from bond-utils
    const { mockUserBonds } = await import("@/lib/bond-utils")
    const bond = mockUserBonds.find((b) => b.id === bondId)

    if (!bond) {
      throw new Error("Bond not found")
    }

    return bond
  } catch (error) {
    console.error("Error getting bond details:", error)
    throw error
  }
}

/**
 * Claim a matured bond
 */
export async function claimBond(account: string, bondId: string): Promise<boolean> {
  // Return mock data in preview mode or when not in browser
  if (isPreviewMode() || !isBrowser()) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return true
  }

  // If we're in the browser but window.ethereum is not available, return mock data
  if (!window.ethereum) {
    console.warn("Ethereum provider not available, using mock claim")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return true
  }

  // We'll implement the actual contract interaction in a separate function
  // that's only called from client components after they've mounted
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return true
  } catch (error) {
    console.error("Error claiming bond:", error)
    throw error
  }
}

/**
 * Participate in a ritual
 */
export async function participateInRitual(account: string, bondId: string): Promise<boolean> {
  // Return mock data in preview mode or when not in browser
  if (isPreviewMode() || !isBrowser()) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return true
  }

  // If we're in the browser but window.ethereum is not available, return mock data
  if (!window.ethereum) {
    console.warn("Ethereum provider not available, using mock ritual participation")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return true
  }

  // We'll implement the actual contract interaction in a separate function
  // that's only called from client components after they've mounted
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return true
  } catch (error) {
    console.error("Error participating in ritual:", error)
    throw error
  }
}
