export interface BondParameters {
  principal: number
  tenor: number // in days
  interestRate: number
  couponFrequency: "monthly" | "quarterly" | "semi-annual" | "annual" | "maturity"
  isHalal: boolean
  name?: string
}

export interface CouponPayment {
  date: Date
  amount: number
  isPaid: boolean
}

export interface BondPreview {
  maturityDate: Date
  totalReturn: number
  effectiveYield: number
  couponPayments: CouponPayment[]
  principalReturnDate: Date
}

export interface BondCreationResult {
  success: boolean
  bondId?: string
  transactionHash?: string
  error?: string
}
