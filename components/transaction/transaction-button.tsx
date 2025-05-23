"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import TransactionModal from "./transaction-modal"
import type { TransactionType } from "@/types/transaction"

interface TransactionButtonProps {
  type: TransactionType
  children: React.ReactNode
  showPrice?: boolean
  className?: string
}

export default function TransactionButton({
  type,
  children,
  showPrice = false,
  className = "",
}: TransactionButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} className={className}>
        {children}
      </Button>
      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultType={type} />
    </>
  )
}
