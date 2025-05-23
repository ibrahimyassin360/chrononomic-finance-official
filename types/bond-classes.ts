export type BondClass = "Z" | "X" | "CQ" | "M" | "R" | "W"

export interface BondClassDetails {
  symbol: string
  name: string
  purpose: string
  maturity: string
  collateral: string
  yieldSources: string
  risk: string
  specialFeature: string
  description: string
  color: string
}

export const BOND_CLASSES: Record<BondClass, BondClassDetails> = {
  Z: {
    symbol: "ℤ",
    name: "Infrastructure Bond",
    purpose: "Core Chronon infrastructure",
    maturity: "5 χ-years",
    collateral: "Chronon-backed asset pool",
    yieldSources: "80% network fee revenue; Z-Resonance performance trigger",
    risk: "Low–Med",
    specialFeature: "Early-redemption at 3 χ-years (95% consensus)",
    description:
      "Funds the foundational infrastructure of the Chronon network, providing stable returns from network fees.",
    color: "blue",
  },
  X: {
    symbol: "𝕏",
    name: "Exchange Liquidity Bond",
    purpose: "Exchange liquidity expansion",
    maturity: "3 χ-years",
    collateral: "χ↔USD & χ↔Starcoin liquidity reserves",
    yieldSources: "50% trading-fee share; volatility bonus; reserve adjustment",
    risk: "Medium",
    specialFeature: "Auto-rollover into next series",
    description: "Provides liquidity for the Chronon exchange, earning from trading fees and volatility events.",
    color: "green",
  },
  CQ: {
    symbol: "ℂℚ",
    name: "Quantum Compute Bond",
    purpose: "Quantum-compute infrastructure funding",
    maturity: "7 χ-years",
    collateral: "ChronoCompute cluster-lease agreements",
    yieldSources: "70% compute-revenue pool; hardware upgrade bonus",
    risk: "Med–High",
    specialFeature: "Upgrade-Swap rights on PFLOPS milestones",
    description: "Finances quantum computing infrastructure, generating returns from compute resource utilization.",
    color: "purple",
  },
  M: {
    symbol: "𝕄",
    name: "Market-Making Bond",
    purpose: "Market-making & derivatives support",
    maturity: "2 χ-years",
    collateral: "Synthetic options & futures vault",
    yieldSources: "60% derivatives-fee share; gamma-spike bonus",
    risk: "High",
    specialFeature: "Protective-Put coupon on market drawdowns",
    description: "Supports derivatives markets and market-making activities, with higher risk and return potential.",
    color: "orange",
  },
  R: {
    symbol: "ℝ",
    name: "Research & Development Bond",
    purpose: "R&D for new Chronon protocols",
    maturity: "10 χ-years",
    collateral: "R&D milestone escrow (χ)",
    yieldSources: "Milestone payouts; 10% innovation licensing premium",
    risk: "Very High",
    specialFeature: "Royalty-Swap into fixed χ tranche",
    description: "Funds research and development of new Chronon protocols, with long-term innovation returns.",
    color: "red",
  },
  W: {
    symbol: "𝕎",
    name: "Weather Oracle Bond",
    purpose: "Weather & event-hedging oracle services",
    maturity: "4 χ-years",
    collateral: "δₜ oracle-fee escrow; event-trigger contracts",
    yieldSources: "55% oracle-fee share; extreme δₜ event bonuses",
    risk: "Medium",
    specialFeature: "Adaptive coupon tied to δₜ deviation",
    description: "Supports oracle services for weather and event prediction, with returns tied to data accuracy.",
    color: "teal",
  },
}
