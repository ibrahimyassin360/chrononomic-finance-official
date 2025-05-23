"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ExternalLink } from "lucide-react"
import Link from "next/link"

interface WhitepaperDownloadProps {
  variant?: "full" | "compact"
  className?: string
}

export function WhitepaperDownload({ variant = "full", className }: WhitepaperDownloadProps) {
  const handleDownload = () => {
    // In a real implementation, this would trigger the download
    // For now, we'll just redirect to the whitepaper page
    window.open("/whitepaper", "_blank")
  }

  if (variant === "compact") {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Chrononomic Finance Whitepaper v2.0</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download Whitepaper
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Chrononomic Finance Whitepaper</CardTitle>
        <CardDescription>Version 2.0 - The Evolution of Time-Based Assets</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Learn about our enhanced Temporal Density Protocol, improved ritual participation mechanisms, and cross-chain
          compatibility in our latest whitepaper.
        </p>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Format:</span>
            <span className="text-sm">PDF (2.4 MB)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Published:</span>
            <span className="text-sm">May 2025</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Version:</span>
            <span className="text-sm">2.0</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button onClick={handleDownload} className="w-full">
          <Download className="mr-2 h-4 w-4" /> Download Whitepaper
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/whitepaper">
            <ExternalLink className="mr-2 h-4 w-4" /> View Online
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
