"use client"

import { useEffect, useState, type ReactNode } from "react"

export default function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)

    return () => {
      setHasMounted(false)
    }
  }, [])

  // During server-side rendering and initial client-side render,
  // we don't want to render anything to avoid hydration mismatches
  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}
