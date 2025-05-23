import { isPreviewMode, isBrowser } from "@/lib/environment"

// Types
export type BondType = "fixed" | "ritual"

export interface Bond {
  id: string
  name: string
  type: BondType
  amount: number
  value: number
  interestRate: number
  maturityDate: Date
  purchaseDate: Date
  status: "active" | "matured" | "claimed"
  nextRitualDate?: Date
  ritualParticipation?: number
}

export interface BondProduct {
  id: string
  name: string
  type: BondType
  minAmount: number
  interestRate: number
  term: number
  description: string
  ritualFrequency?: number
  ritualBonus?: number
}

// Mock data
const MOCK_BONDS: Bond[] = [
  {
    id: "bond-1",
    name: "Short-Term Fixed Bond",
    type: "fixed",
    amount: 0.5,
    value: 0.525,
    interestRate: 5,
    maturityDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    purchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "bond-2",
    name: "Dawn Ritual Bond",
    type: "ritual",
    amount: 1,
    value: 1.08,
    interestRate: 8,
    maturityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: "active",
    nextRitualDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    ritualParticipation: 85,
  },
  {
    id: "bond-3",
    name: "Medium-Term Fixed Bond",
    type: "fixed",
    amount: 2,
    value: 2.15,
    interestRate: 7.5,
    maturityDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    purchaseDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    status: "matured",
  },
]

const MOCK_BOND_PRODUCTS: BondProduct[] = [
  {
    id: "fixed-short",
    name: "Short-Term Fixed Bond",
    type: "fixed",
    minAmount: 0.1,
    interestRate: 5,
    term: 30,
    description: "A short-term fixed-rate bond with a 30-day maturity period.",
  },
  {
    id: "fixed-medium",
    name: "Medium-Term Fixed Bond",
    type: "fixed",
    minAmount: 0.5,
    interestRate: 7.5,
    term: 90,
    description: "A medium-term fixed-rate bond with a 90-day maturity period.",
  },
  {
    id: "fixed-long",
    name: "Long-Term Fixed Bond",
    type: "fixed",
    minAmount: 1,
    interestRate: 10,
    term: 180,
    description: "A long-term fixed-rate bond with a 180-day maturity period.",
  },
  {
    id: "ritual-dawn",
    name: "Dawn Ritual Bond",
    type: "ritual",
    minAmount: 0.2,
    interestRate: 8,
    term: 60,
    description: "A ritual bond that requires participation in dawn rituals for maximum returns.",
    ritualFrequency: 7,
    ritualBonus: 3,
  },
  {
    id: "ritual-dusk",
    name: "Dusk Ritual Bond",
    type: "ritual",
    minAmount: 0.5,
    interestRate: 12,
    term: 120,
    description: "A ritual bond that requires participation in dusk rituals for maximum returns.",
    ritualFrequency: 14,
    ritualBonus: 5,
  },
]

// Helper functions
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const getDaysRemaining = (maturityDate: Date): number => {
  const now = new Date()
  const diffTime = maturityDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

export const getTimeElapsedPercentage = (purchaseDate: Date, maturityDate: Date): number => {
  const now = new Date()
  const totalTime = maturityDate.getTime() - purchaseDate.getTime()
  const elapsedTime = now.getTime() - purchaseDate.getTime()
  return Math.min(Math.max((elapsedTime / totalTime) * 100, 0), 100)
}

// Service functions
export async function getUserBonds(address: string): Promise<Bond[]> {
  // Preview mode implementation
  if (isPreviewMode()) {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
    return MOCK_BONDS
  }

  // Production implementation
  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call your smart contract here
    // For now, we'll return mock data
    return MOCK_BONDS
  } catch (err) {
    console.error("Error getting user bonds:", err)
    throw err
  }
}

export async function getBondProducts(): Promise<BondProduct[]> {
  // Preview mode implementation
  if (isPreviewMode()) {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
    return MOCK_BOND_PRODUCTS
  }

  // Production implementation
  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call your smart contract here
    // For now, we'll return mock data
    return MOCK_BOND_PRODUCTS
  } catch (err) {
    console.error("Error getting bond products:", err)
    throw err
  }
}

export async function purchaseBond(address: string, productId: string, amount: number): Promise<Bond> {
  // Preview mode implementation
  if (isPreviewMode()) {
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate delay

    const product = MOCK_BOND_PRODUCTS.find((p) => p.id === productId)
    if (!product) {
      throw new Error("Bond product not found")
    }

    if (amount < product.minAmount) {
      throw new Error(`Minimum amount is ${product.minAmount} ETH`)
    }

    const newBond: Bond = {
      id: `bond-${Date.now()}`,
      name: product.name,
      type: product.type,
      amount: amount,
      value: amount * (1 + product.interestRate / 100),
      interestRate: product.interestRate,
      maturityDate: new Date(Date.now() + product.term * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(),
      status: "active",
    }

    if (product.type === "ritual") {
      newBond.nextRitualDate = new Date(Date.now() + (product.ritualFrequency || 7) * 24 * 60 * 60 * 1000)
      newBond.ritualParticipation = 0
    }

    return newBond
  }

  // Production implementation
  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call your smart contract here
    // For now, we'll return a mock bond
    const product = MOCK_BOND_PRODUCTS.find((p) => p.id === productId)
    if (!product) {
      throw new Error("Bond product not found")
    }

    if (amount < product.minAmount) {
      throw new Error(`Minimum amount is ${product.minAmount} ETH`)
    }

    // Convert amount to wei
    const weiValue = BigInt(Math.floor(amount * 1e18)).toString(16)

    // Call the smart contract (this is a simplified example)
    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: address,
          to: "0x1234567890123456789012345678901234567890", // Bond contract address
          value: `0x${weiValue}`,
          data: `0x12345678${productId}`, // Function signature + parameters
        },
      ],
    })

    // In a real implementation, you would get the bond details from the contract
    // For now, we'll return a mock bond
    const newBond: Bond = {
      id: `bond-${Date.now()}`,
      name: product.name,
      type: product.type,
      amount: amount,
      value: amount * (1 + product.interestRate / 100),
      interestRate: product.interestRate,
      maturityDate: new Date(Date.now() + product.term * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(),
      status: "active",
    }

    if (product.type === "ritual") {
      newBond.nextRitualDate = new Date(Date.now() + (product.ritualFrequency || 7) * 24 * 60 * 60 * 1000)
      newBond.ritualParticipation = 0
    }

    return newBond
  } catch (err) {
    console.error("Error purchasing bond:", err)
    throw err
  }
}

export async function claimBond(address: string, bondId: string): Promise<boolean> {
  // Preview mode implementation
  if (isPreviewMode()) {
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate delay
    return true
  }

  // Production implementation
  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call your smart contract here
    // For now, we'll return success
    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: address,
          to: "0x1234567890123456789012345678901234567890", // Bond contract address
          data: `0x87654321${bondId}`, // Function signature + parameters
        },
      ],
    })

    return true
  } catch (err) {
    console.error("Error claiming bond:", err)
    throw err
  }
}

export async function participateInRitual(address: string, bondId: string): Promise<boolean> {
  // Preview mode implementation
  if (isPreviewMode()) {
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate delay
    return true
  }

  // Production implementation
  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call your smart contract here
    // For now, we'll return success
    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: address,
          to: "0x1234567890123456789012345678901234567890", // Bond contract address
          data: `0xabcdef${bondId}`, // Function signature + parameters
        },
      ],
    })

    return true
  } catch (err) {
    console.error("Error participating in ritual:", err)
    throw err
  }
}
