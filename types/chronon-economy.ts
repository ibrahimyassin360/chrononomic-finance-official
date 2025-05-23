// χ-Token Economy Types

export interface WorkSession {
  id: string
  title: string
  description: string
  ethCost: number
  chrononsEarned: number
  duration: number // in hours
  date: Date
  completed: boolean
}

export interface ProjectCreation {
  id: string
  name: string
  teamMembers: number
  chrononsIssued: number
  date: Date
}

export interface Repository {
  id: string
  name: string
  description: string
  cloneCost: number // in ETH
  leaseCostPerDay: number // in ETH
  chrononsEarned: number
}

export interface ChrononomicBond {
  id: string
  projectId: string
  projectName: string
  denomination: number // in χ
  maturityDate: Date
  description: string
  isRedeemable: boolean
  isRedeemed: boolean
  issueDate: Date
}

export interface RestPeriod {
  id: string
  type: "weekend" | "retreat" | "sabbatical"
  chrononsRequired: number
  duration: number // in days
  description: string
}

export interface ProjectType {
  id: string
  type: "weekly-onsite" | "executive-decision"
  chrononsRequired: number
  description: string
  duration: number // in days
}

export interface ContactRate {
  id: string
  contactType: "ceo" | "ai-advisor"
  chrononsRequired: number
  description: string
  duration: number // in hours
}

// Predefined values based on the specification
export const REST_PERIODS: RestPeriod[] = [
  {
    id: "weekend",
    type: "weekend",
    chrononsRequired: 1,
    duration: 2,
    description: "Weekend Reset - 2 days fully offline",
  },
  {
    id: "retreat",
    type: "retreat",
    chrononsRequired: 7,
    duration: 7,
    description: "Retreat - 1 week abroad",
  },
  {
    id: "sabbatical",
    type: "sabbatical",
    chrononsRequired: 33,
    duration: 30,
    description: "Sabbatical Cycle - 1 month, fully sponsored",
  },
]

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: "weekly-onsite",
    type: "weekly-onsite",
    chrononsRequired: 7,
    description: "Weekly Onsite - intensive weekly sprint with on-premises collaboration",
    duration: 7,
  },
  {
    id: "executive-decision",
    type: "executive-decision",
    chrononsRequired: 33,
    description: "Executive Decision-Making - senior-leader workshop for critical strategic planning",
    duration: 3,
  },
]

export const CONTACT_RATES: ContactRate[] = [
  {
    id: "ceo",
    contactType: "ceo",
    chrononsRequired: 100,
    description: "Direct executive consultation or decision session",
    duration: 1,
  },
  {
    id: "ai-advisor",
    contactType: "ai-advisor",
    chrononsRequired: 100,
    description: "Algorithmic strategy session with Chronon-AI",
    duration: 1,
  },
]
