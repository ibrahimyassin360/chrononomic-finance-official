"use client"

import { useEffect, useState } from "react"

const DAY_SECONDS = 24 * 60 * 60
const REWARD_THRESHOLD = 8 * 60 * 60 // 8 hours

function getTodayKey() {
  const today = new Date().toISOString().split("T")[0]
  return `chrononomic_work_seconds_${today}`
}

export default function WorkHoursReward() {
  const [seconds, setSeconds] = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const key = getTodayKey()
    const stored = parseInt(localStorage.getItem(key) || "0")
    setSeconds(stored)
    let current = stored
    const interval = setInterval(() => {
      current += 1
      setSeconds(current)
      localStorage.setItem(key, current.toString())
      if (current >= REWARD_THRESHOLD) {
        setShow(true)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!show) return null

  return (
    <div className="bg-green-100 text-green-800 text-center p-2 text-sm">
      You've worked over 8 hours today! Enjoy extended features.
    </div>
  )
}
