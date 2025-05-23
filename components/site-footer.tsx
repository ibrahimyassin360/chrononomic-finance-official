import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Chrononomic Finance. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/terms" className="text-sm font-medium text-muted-foreground underline underline-offset-4">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm font-medium text-muted-foreground underline underline-offset-4">
            Privacy
          </Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground underline underline-offset-4">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
