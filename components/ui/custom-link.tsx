import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface CustomLinkProps {
  href: string
  children: ReactNode
  className?: string
  effect?: "underline" | "glow" | "rotate" | "none"
}

export function CustomLink({ href, children, className, effect = "underline" }: CustomLinkProps) {
  const getEffectClass = () => {
    switch (effect) {
      case "underline":
        return "link-hover-effect"
      case "glow":
        return "btn-glow-effect"
      case "rotate":
        return "icon-rotate-effect"
      default:
        return ""
    }
  }

  return (
    <Link href={href} className={cn(getEffectClass(), className)}>
      {children}
    </Link>
  )
}
