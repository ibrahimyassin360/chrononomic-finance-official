import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  linkToHome?: boolean
  className?: string
}

export function Logo({ showText = true, linkToHome = true, className = "" }: LogoProps) {
  const logoContent = (
    <div className={`flex items-center ${className}`}>
      <span className="font-bold">Chrononomic Finance</span>
    </div>
  )

  if (linkToHome) {
    return (
      <Link href="/" className={className}>
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
