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
  nextRitualDate?: Date // Only for ritual bonds
  ritualParticipation?: number // Only for ritual bonds (percentage)
}

export interface BondProduct {
  id: string
  name: string
  type: BondType
  minAmount: number
  interestRate: number
  term: number // in days
  description: string
  ritualFrequency?: number // in days, only for ritual bonds
  ritualBonus?: number // additional percentage, only for ritual bonds
}

// Mock bond products
export const mockBondProducts: BondProduct[] = [
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
    ritualFrequency: 7, // Weekly rituals
    ritualBonus: 3, // Additional 3% for full participation
  },
  {
    id: "ritual-dusk",
    name: "Dusk Ritual Bond",
    type: "ritual",
    minAmount: 0.5,
    interestRate: 12,
    term: 120,
    description: "A ritual bond that requires participation in dusk rituals for maximum returns.",
    ritualFrequency: 14, // Bi-weekly rituals
    ritualBonus: 5, // Additional 5% for full participation
  },
]

// Mock user bonds
export const mockUserBonds: Bond[] = [
  {
    id: "bond-1",
    name: "Short-Term Fixed Bond",
    type: "fixed",
    amount: 0.5,
    value: 0.525, // 5% interest
    interestRate: 5,
    maturityDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    purchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    status: "active",
  },
  {
    id: "bond-2",
    name: "Dawn Ritual Bond",
    type: "ritual",
    amount: 1,
    value: 1.08, // 8% base interest
    interestRate: 8,
    maturityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    status: "active",
    nextRitualDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    ritualParticipation: 85, // 85% participation
  },
  {
    id: "bond-3",
    name: "Medium-Term Fixed Bond",
    type: "fixed",
    amount: 2,
    value: 2.15, // 7.5% interest
    interestRate: 7.5,
    maturityDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (matured)
    purchaseDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000), // 95 days ago
    status: "matured",
  },
]

// Function to get user bonds (mock implementation)
export const getUserBonds = async (address: string): Promise<Bond[]> => {
  // In a real implementation, this would fetch from an API or blockchain
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
  return mockUserBonds
}

// Function to get bond products (mock implementation)
export const getBondProducts = async (): Promise<BondProduct[]> => {
  // In a real implementation, this would fetch from an API or blockchain
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
  return mockBondProducts
}

// Function to purchase a bond (mock implementation)
export const purchaseBond = async (address: string, productId: string, amount: number): Promise<Bond> => {
  // In a real implementation, this would call a smart contract
  await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate blockchain delay

  const product = mockBondProducts.find((p) => p.id === productId)
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

  // In a real implementation, this would be added to the blockchain
  mockUserBonds.push(newBond)

  return newBond
}

// Function to claim a matured bond (mock implementation)
export const claimBond = async (address: string, bondId: string): Promise<boolean> => {
  // In a real implementation, this would call a smart contract
  await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate blockchain delay

  const bondIndex = mockUserBonds.findIndex((b) => b.id === bondId)
  if (bondIndex === -1) {
    throw new Error("Bond not found")
  }

  const bond = mockUserBonds[bondIndex]
  if (bond.status !== "matured") {
    throw new Error("Bond is not matured yet")
  }

  // Update bond status
  mockUserBonds[bondIndex] = {
    ...bond,
    status: "claimed",
  }

  return true
}

// Function to participate in a ritual (mock implementation)
export const participateInRitual = async (address: string, bondId: string): Promise<boolean> => {
  // In a real implementation, this would call a smart contract
  await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate blockchain delay

  const bondIndex = mockUserBonds.findIndex((b) => b.id === bondId)
  if (bondIndex === -1) {
    throw new Error("Bond not found")
  }

  const bond = mockUserBonds[bondIndex]
  if (bond.type !== "ritual") {
    throw new Error("Not a ritual bond")
  }

  if (!bond.nextRitualDate || bond.nextRitualDate > new Date()) {
    throw new Error("No ritual available at this time")
  }

  // Update ritual participation
  const currentParticipation = bond.ritualParticipation || 0
  const newParticipation = Math.min(currentParticipation + 10, 100) // Increase by 10%, max 100%

  // Update next ritual date (7 days from now)
  const nextRitualDate = new Date()
  nextRitualDate.setDate(nextRitualDate.getDate() + 7)

  mockUserBonds[bondIndex] = {
    ...bond,
    ritualParticipation: newParticipation,
    nextRitualDate,
  }

  return true
}

// Calculate days remaining until maturity
export const getDaysRemaining = (maturityDate: Date): number => {
  const now = new Date()
  const diffTime = maturityDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

// Calculate percentage of time elapsed
export const getTimeElapsedPercentage = (purchaseDate: Date, maturityDate: Date): number => {
  const now = new Date()
  const totalTime = maturityDate.getTime() - purchaseDate.getTime()
  const elapsedTime = now.getTime() - purchaseDate.getTime()

  return Math.min(Math.max((elapsedTime / totalTime) * 100, 0), 100)
}

// Format date to readable string
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
