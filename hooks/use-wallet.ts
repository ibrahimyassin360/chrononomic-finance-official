"use client"

import { useWallet as useWalletContext } from "@/contexts/wallet-context"

export const useWallet = () => {
  return useWalletContext()
}
