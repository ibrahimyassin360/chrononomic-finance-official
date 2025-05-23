import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Home - Chrononomic Finance",
  description: "Welcome to Chrononomic Finance - Your gateway to time-based financial instruments",
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Welcome to Chrononomic Finance
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover the power of time-based financial instruments with our innovative platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/get-started">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" size="lg">
                    Explore Products
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Crystal Oasis Reserve</h2>
                    <p className="text-gray-600 dark:text-gray-300">Stability in a changing world</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 dark:bg-gray-800 rounded-lg my-12">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Our Financial Products</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Explore our range of innovative financial instruments
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Fixed Rate Bonds</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Stable returns with predictable growth over time.</p>
              <Link href="/products/fixed-rate-bonds">
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Ritual Bonds</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Enhanced returns through ceremonial financial practices.
              </p>
              <Link href="/products/ritual-bonds">
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Chronon Token</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Our native token that powers the entire ecosystem.
              </p>
              <Link href="/products/chronon-token">
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Why Choose Chrononomic Finance?</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Our platform offers unique advantages that set us apart from traditional financial institutions.
              </p>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>Time-based financial instruments</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>Transparent and secure operations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>Innovative financial products</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>Community-driven governance</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Join Our Community</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Be part of the financial revolution</p>
                    <Link href="/resources/community">
                      <Button>Connect With Us</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-medium">Products</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link
                    href="/products/fixed-rate-bonds"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Fixed Rate Bonds
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/ritual-bonds"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Ritual Bonds
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/chronon-token"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Chronon Token
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Resources</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link
                    href="/resources/documentation"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources/guides"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources/api-reference"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Company</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link
                    href="/company/about"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/company/blog"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Legal</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link
                    href="/legal/terms"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/privacy"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Chrononomic Finance. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
