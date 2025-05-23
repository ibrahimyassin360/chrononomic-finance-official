"use client"

import type React from "react"

import { useEffect } from "react"
import { createRippleEffect } from "@/lib/hover-effects"

export function HoverEffectsInitializer() {
  useEffect(() => {
    // Add ripple effect to buttons with btn-ripple-effect class
    const rippleButtons = document.querySelectorAll(".btn-ripple-effect")

    const handleRippleClick = (e: Event) => {
      createRippleEffect(e as unknown as React.MouseEvent<HTMLButtonElement>)
    }

    rippleButtons.forEach((button) => {
      button.addEventListener("click", handleRippleClick)
    })

    // Cleanup
    return () => {
      rippleButtons.forEach((button) => {
        button.removeEventListener("click", handleRippleClick)
      })
    }
  }, [])

  return null
}
