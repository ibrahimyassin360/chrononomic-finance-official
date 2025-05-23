"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { RitualState, RitualPhase } from "@/types/ritual"

interface RitualVisualizationProps {
  ritualState: RitualState
  phase: RitualPhase
}

export function RitualVisualization({ ritualState, phase }: RitualVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw based on phase
    if (phase === "dawn") {
      drawDawnRitual(ctx, width, height, ritualState.isActive)
    } else {
      drawDuskRitual(ctx, width, height, ritualState.isActive)
    }

    // Animation frame if ritual is active
    let animationFrame: number

    if (ritualState.isActive) {
      const animate = () => {
        if (phase === "dawn") {
          drawDawnRitual(ctx, width, height, true)
        } else {
          drawDuskRitual(ctx, width, height, true)
        }
        animationFrame = requestAnimationFrame(animate)
      }

      animationFrame = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [ritualState, phase])

  // Draw dawn ritual visualization
  const drawDawnRitual = (ctx: CanvasRenderingContext2D, width: number, height: number, isActive: boolean) => {
    // Background gradient (dawn colors)
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#2c3e50")
    gradient.addColorStop(0.5, "#3498db")
    gradient.addColorStop(1, "#e67e22")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Sun
    const sunY = isActive ? height * 0.8 : height * 0.95
    const sunRadius = width * 0.15

    ctx.beginPath()
    ctx.arc(width / 2, sunY, sunRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#f39c12"
    ctx.fill()

    // Sun rays if active
    if (isActive) {
      const time = Date.now() / 1000
      const rayCount = 12
      const rayLength = width * 0.1

      ctx.save()
      ctx.translate(width / 2, sunY)

      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + time * 0.2
        const x1 = Math.cos(angle) * (sunRadius + 5)
        const y1 = Math.sin(angle) * (sunRadius + 5)
        const x2 = Math.cos(angle) * (sunRadius + rayLength)
        const y2 = Math.sin(angle) * (sunRadius + rayLength)

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = "#f1c40f"
        ctx.lineWidth = 3
        ctx.stroke()
      }

      ctx.restore()
    }

    // Horizon line
    ctx.beginPath()
    ctx.moveTo(0, height * 0.8)
    ctx.lineTo(width, height * 0.8)
    ctx.strokeStyle = "#2c3e50"
    ctx.lineWidth = 2
    ctx.stroke()
  }

  // Draw dusk ritual visualization
  const drawDuskRitual = (ctx: CanvasRenderingContext2D, width: number, height: number, isActive: boolean) => {
    // Background gradient (dusk colors)
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#2c3e50")
    gradient.addColorStop(0.5, "#8e44ad")
    gradient.addColorStop(1, "#e74c3c")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Moon
    const moonY = isActive ? height * 0.3 : height * 0.1
    const moonRadius = width * 0.12

    ctx.beginPath()
    ctx.arc(width / 2, moonY, moonRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#ecf0f1"
    ctx.fill()

    // Moon craters
    ctx.beginPath()
    ctx.arc(width / 2 - moonRadius * 0.3, moonY - moonRadius * 0.2, moonRadius * 0.2, 0, Math.PI * 2)
    ctx.fillStyle = "#bdc3c7"
    ctx.fill()

    ctx.beginPath()
    ctx.arc(width / 2 + moonRadius * 0.4, moonY + moonRadius * 0.3, moonRadius * 0.15, 0, Math.PI * 2)
    ctx.fillStyle = "#bdc3c7"
    ctx.fill()

    // Stars if active
    if (isActive) {
      const time = Date.now() / 1000
      const starCount = 30

      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * width
        const y = Math.random() * height * 0.7
        const size = Math.random() * 3 + 1
        const brightness = 0.5 + Math.sin(time + i) * 0.5

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
        ctx.fill()
      }
    }

    // Horizon line
    ctx.beginPath()
    ctx.moveTo(0, height * 0.8)
    ctx.lineTo(width, height * 0.8)
    ctx.strokeStyle = "#2c3e50"
    ctx.lineWidth = 2
    ctx.stroke()
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <canvas ref={canvasRef} width={400} height={200} className="w-full h-auto" />
      </CardContent>
    </Card>
  )
}
