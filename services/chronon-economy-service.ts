import { isBrowser, isPreviewMode } from "@/lib/environment"
import type { WorkSession, ProjectCreation, Repository, ChrononomicBond } from "@/types/chronon-economy"

// Mock data for preview mode
const MOCK_WORK_SESSIONS: WorkSession[] = [
  {
    id: "ws-1",
    title: "Product Strategy Session",
    description: "Consulting session on product roadmap and strategy",
    ethCost: 1,
    chrononsEarned: 1,
    duration: 2,
    date: new Date(2025, 4, 15),
    completed: true,
  },
  {
    id: "ws-2",
    title: "Technical Architecture Review",
    description: "Review of system architecture and technical debt",
    ethCost: 2,
    chrononsEarned: 2,
    duration: 4,
    date: new Date(2025, 4, 18),
    completed: true,
  },
  {
    id: "ws-3",
    title: "UX Workshop",
    description: "User experience design workshop for new features",
    ethCost: 1.5,
    chrononsEarned: 1.5,
    duration: 3,
    date: new Date(2025, 4, 20),
    completed: false,
  },
]

const MOCK_PROJECT_CREATIONS: ProjectCreation[] = [
  {
    id: "pc-1",
    name: "Chrononomic Dashboard",
    teamMembers: 5,
    chrononsIssued: 5,
    date: new Date(2025, 3, 10),
  },
  {
    id: "pc-2",
    name: "Temporal Analytics Platform",
    teamMembers: 3,
    chrononsIssued: 3,
    date: new Date(2025, 4, 5),
  },
]

const MOCK_REPOSITORIES: Repository[] = [
  {
    id: "repo-1",
    name: "chrononomic-core",
    description: "Core repository for Chrononomic Finance",
    cloneCost: 100,
    leaseCostPerDay: 10,
    chrononsEarned: 0,
  },
  {
    id: "repo-2",
    name: "chronon-exchange",
    description: "Exchange platform for Chronon tokens",
    cloneCost: 100,
    leaseCostPerDay: 10,
    chrononsEarned: 0,
  },
]

const MOCK_BONDS: ChrononomicBond[] = [
  {
    id: "bond-1",
    projectId: "pc-1",
    projectName: "Chrononomic Dashboard",
    denomination: 10,
    maturityDate: new Date(2025, 9, 10),
    description: "Bond for Chrononomic Dashboard project completion",
    isRedeemable: false,
    isRedeemed: false,
    issueDate: new Date(2025, 3, 15),
  },
  {
    id: "bond-2",
    projectId: "pc-2",
    projectName: "Temporal Analytics Platform",
    denomination: 15,
    maturityDate: new Date(2025, 7, 5),
    description: "Bond for Temporal Analytics Platform project completion",
    isRedeemable: true,
    isRedeemed: false,
    issueDate: new Date(2025, 4, 10),
  },
]

// Constants defined in types/chronon-economy
const REST_PERIODS_CONSTANT = [
  { id: "rp-1", chrononsRequired: 5 },
  { id: "rp-2", chrononsRequired: 10 },
]

const PROJECT_TYPES_CONSTANT = [
  { id: "pt-1", chrononsRequired: 20 },
  { id: "pt-2", chrononsRequired: 30 },
]

const CONTACT_RATES_CONSTANT = [
  { id: "cr-1", chrononsRequired: 15 },
  { id: "cr-2", chrononsRequired: 25 },
]

// Get work sessions for a user
export async function getUserWorkSessions(
  account: string,
  isPreview: boolean = isPreviewMode(),
): Promise<WorkSession[]> {
  if (isPreview) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return MOCK_WORK_SESSIONS
  }

  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call the contract to get work sessions
    // For now, we'll return mock data
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return MOCK_WORK_SESSIONS
  } catch (err) {
    console.error("Error getting work sessions:", err)
    throw err
  }
}

// Get project creations for a user
export async function getUserProjectCreations(
  account: string,
  isPreview: boolean = isPreviewMode(),
): Promise<ProjectCreation[]> {
  if (isPreview) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return MOCK_PROJECT_CREATIONS
  }

  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call the contract to get project creations
    // For now, we'll return mock data
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return MOCK_PROJECT_CREATIONS
  } catch (err) {
    console.error("Error getting project creations:", err)
    throw err
  }
}

// Get available repositories
export async function getAvailableRepositories(isPreview: boolean = isPreviewMode()): Promise<Repository[]> {
  if (isPreview) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return MOCK_REPOSITORIES
  }

  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call the contract to get repositories
    // For now, we'll return mock data
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return MOCK_REPOSITORIES
  } catch (err) {
    console.error("Error getting repositories:", err)
    throw err
  }
}

// Clone a repository
export async function cloneRepository(
  account: string,
  repoId: string,
  isPreview: boolean = isPreviewMode(),
): Promise<{ success: boolean; chrononsEarned: number }> {
  if (isPreview) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const repo = MOCK_REPOSITORIES.find((r) => r.id === repoId)
    if (!repo) {
      throw new Error("Repository not found")
    }
    return { success: true, chrononsEarned: repo.cloneCost }
  }

  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call the contract to clone the repository
    // For now, we'll simulate success
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const repo = MOCK_REPOSITORIES.find((r) => r.id === repoId)
    if (!repo) {
      throw new Error("Repository not found")
    }
    return { success: true, chrononsEarned: repo.cloneCost }
  } catch (err) {
    console.error("Error cloning repository:", err)
    throw err
  }
}

// Lease a repository
export async function leaseRepository(
  account: string,
  repoId: string,
  days: number,
  isPreview: boolean = isPreviewMode(),
): Promise<{ success: boolean; chrononsEarned: number }> {
  if (isPreview) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const repo = MOCK_REPOSITORIES.find((r) => r.id === repoId)
    if (!repo) {
      throw new Error("Repository not found")
    }
    return { success: true, chrononsEarned: repo.leaseCostPerDay * days }
  }

  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call the contract to lease the repository
    // For now, we'll simulate success
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const repo = MOCK_REPOSITORIES.find((r) => r.id === repoId)
    if (!repo) {
      throw new Error("Repository not found")
    }
    return { success: true, chrononsEarned: repo.leaseCostPerDay * days }
  } catch (err) {
    console.error("Error leasing repository:", err)
    throw err
  }
}

// Get bonds for a user
export async function getUserBonds(account: string, isPreview: boolean = isPreviewMode()): Promise<ChrononomicBond[]> {
  if (isPreview) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return MOCK_BONDS
  }

  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call the contract to get bonds
    // For now, we'll return mock data
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return MOCK_BONDS
  } catch (err) {
    console.error("Error getting bonds:", err)
    throw err
  }
}

// Redeem a bond
export async function redeemBond(
  account: string,
  bondId: string,
  isPreview: boolean = isPreviewMode(),
): Promise<{ success: boolean; chrononsEarned: number }> {
  if (isPreview) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const bond = MOCK_BONDS.find((b) => b.id === bondId)
    if (!bond) {
      throw new Error("Bond not found")
    }
    if (!bond.isRedeemable) {
      throw new Error("Bond is not yet redeemable")
    }
    if (bond.isRedeemed) {
      throw new Error("Bond has already been redeemed")
    }
    return { success: true, chrononsEarned: bond.denomination }
  }

  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call the contract to redeem the bond
    // For now, we'll simulate success
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const bond = MOCK_BONDS.find((b) => b.id === bondId)
    if (!bond) {
      throw new Error("Bond not found")
    }
    if (!bond.isRedeemable) {
      throw new Error("Bond is not yet redeemable")
    }
    if (bond.isRedeemed) {
      throw new Error("Bond has already been redeemed")
    }
    return { success: true, chrononsEarned: bond.denomination }
  } catch (err) {
    console.error("Error redeeming bond:", err)
    throw err
  }
}

// Create a new work session
export async function createWorkSession(
  account: string,
  title: string,
  description: string,
  ethCost: number,
  duration: number,
  isPreview: boolean = isPreviewMode(),
): Promise<{ success: boolean; workSession: WorkSession }> {
  if (isPreview) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const newWorkSession: WorkSession = {
      id: `ws-${Date.now()}`,
      title,
      description,
      ethCost,
      chrononsEarned: ethCost, // 1:1 ratio as per specification
      duration,
      date: new Date(),
      completed: false,
    }
    return { success: true, workSession: newWorkSession }
  }

  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call the contract to create a work session
    // For now, we'll simulate success
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const newWorkSession: WorkSession = {
      id: `ws-${Date.now()}`,
      title,
      description,
      ethCost,
      chrononsEarned: ethCost, // 1:1 ratio as per specification
      duration,
      date: new Date(),
      completed: false,
    }
    return { success: true, workSession: newWorkSession }
  } catch (err) {
    console.error("Error creating work session:", err)
    throw err
  }
}

// Create a new project
export async function createProject(
  account: string,
  name: string,
  teamMembers: number,
  isPreview: boolean = isPreviewMode(),
): Promise<{ success: boolean; project: ProjectCreation }> {
  if (isPreview) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const newProject: ProjectCreation = {
      id: `pc-${Date.now()}`,
      name,
      teamMembers,
      chrononsIssued: teamMembers, // 1 χ per team member as per specification
      date: new Date(),
    }
    return { success: true, project: newProject }
  }

  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call the contract to create a project
    // For now, we'll simulate success
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const newProject: ProjectCreation = {
      id: `pc-${Date.now()}`,
      name,
      teamMembers,
      chrononsIssued: teamMembers, // 1 χ per team member as per specification
      date: new Date(),
    }
    return { success: true, project: newProject }
  } catch (err) {
    console.error("Error creating project:", err)
    throw err
  }
}

// Issue a bond for a project
export async function issueBond(
  account: string,
  projectId: string,
  projectName: string,
  denomination: number,
  maturityDate: Date,
  description: string,
  isPreview: boolean = isPreviewMode(),
): Promise<{ success: boolean; bond: ChrononomicBond }> {
  if (isPreview) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const newBond: ChrononomicBond = {
      id: `bond-${Date.now()}`,
      projectId,
      projectName,
      denomination,
      maturityDate,
      description,
      isRedeemable: false,
      isRedeemed: false,
      issueDate: new Date(),
    }
    return { success: true, bond: newBond }
  }

  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call the contract to issue a bond
    // For now, we'll simulate success
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const newBond: ChrononomicBond = {
      id: `bond-${Date.now()}`,
      projectId,
      projectName,
      denomination,
      maturityDate,
      description,
      isRedeemable: false,
      isRedeemed: false,
      issueDate: new Date(),
    }
    return { success: true, bond: newBond }
  } catch (err) {
    console.error("Error issuing bond:", err)
    throw err
  }
}

// Redeem chronons for a rest period
export async function redeemForRest(
  account: string,
  restPeriodId: string,
  isPreview: boolean = isPreviewMode(),
): Promise<{ success: boolean; chrononsSpent: number }> {
  if (isPreview) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const restPeriod = REST_PERIODS_CONSTANT.find((r) => r.id === restPeriodId)
    if (!restPeriod) {
      throw new Error("Rest period not found")
    }
    return { success: true, chrononsSpent: restPeriod.chrononsRequired }
  }

  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call the contract to redeem for rest
    // For now, we'll simulate success
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const restPeriod = REST_PERIODS_CONSTANT.find((r) => r.id === restPeriodId)
    if (!restPeriod) {
      throw new Error("Rest period not found")
    }
    return { success: true, chrononsSpent: restPeriod.chrononsRequired }
  } catch (err) {
    console.error("Error redeeming for rest:", err)
    throw err
  }
}

// Create a new project with χ cost
export async function createProjectWithCost(
  account: string,
  name: string,
  teamMembers: number,
  projectTypeId: string,
  isPreview: boolean = isPreviewMode(),
): Promise<{ success: boolean; project: ProjectCreation; chrononsSpent: number }> {
  if (isPreview) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const projectType = PROJECT_TYPES_CONSTANT.find((p) => p.id === projectTypeId)
    if (!projectType) {
      throw new Error("Project type not found")
    }
    const newProject: ProjectCreation = {
      id: `pc-${Date.now()}`,
      name,
      teamMembers,
      chrononsIssued: teamMembers, // 1 χ per team member as per specification
      date: new Date(),
    }
    return {
      success: true,
      project: newProject,
      chrononsSpent: projectType.chrononsRequired,
    }
  }

  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call the contract to create a project with cost
    // For now, we'll simulate success
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const projectType = PROJECT_TYPES_CONSTANT.find((p) => p.id === projectTypeId)
    if (!projectType) {
      throw new Error("Project type not found")
    }
    const newProject: ProjectCreation = {
      id: `pc-${Date.now()}`,
      name,
      teamMembers,
      chrononsIssued: teamMembers, // 1 χ per team member as per specification
      date: new Date(),
    }
    return {
      success: true,
      project: newProject,
      chrononsSpent: projectType.chrononsRequired,
    }
  } catch (err) {
    console.error("Error creating project with cost:", err)
    throw err
  }
}

// Schedule a contact session
export async function scheduleContact(
  account: string,
  contactTypeId: string,
  date: Date,
  isPreview: boolean = isPreviewMode(),
): Promise<{ success: boolean; chrononsSpent: number }> {
  if (isPreview) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const contactRate = CONTACT_RATES_CONSTANT.find((c) => c.id === contactTypeId)
    if (!contactRate) {
      throw new Error("Contact type not found")
    }
    return { success: true, chrononsSpent: contactRate.chrononsRequired }
  }

  if (!isBrowser() || !window.ethereum) {
    throw new Error("No Ethereum provider available")
  }

  try {
    // In a real implementation, you would call the contract to schedule a contact
    // For now, we'll simulate success
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const contactRate = CONTACT_RATES_CONSTANT.find((c) => c.id === contactTypeId)
    if (!contactRate) {
      throw new Error("Contact type not found")
    }
    return { success: true, chrononsSpent: contactRate.chrononsRequired }
  } catch (err) {
    console.error("Error scheduling contact:", err)
    throw err
  }
}
