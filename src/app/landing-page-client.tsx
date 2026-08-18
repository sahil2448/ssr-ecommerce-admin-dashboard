"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { ArrowRight, Layout, Github, Menu, X } from "lucide-react"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"

const AnimatedFeatureCards = dynamic(() => import("./animated-feature-cards"), {
  loading: () => (
    <section aria-label="Key features" className="mt-20 sm:mt-32 md:mt-40">
      <h2 className="sr-only">Key Features of AdminSuite</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 px-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-muted/50 animate-pulse" />
        ))}
      </div>
    </section>
  ),
})

export default function LandingPageClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-purple-500/30">
      {/* Background gradient effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-25%] left-[-15%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-purple-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-12%] w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] bg-blue-500/12 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-20%] w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />
      </div>

      <header>
        <nav className="relative z-50 border-b bg-background/40 backdrop-blur-2xl sticky top-0" aria-label="Main navigation">
          <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight hover:opacity-80 transition-opacity"
              aria-label="AdminSuite - Go to home page"
            >
              <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                <Layout className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              </div>
              <span className="hidden sm:inline">AdminSuite</span>
            </Link>

            <div className="hidden sm:flex items-center gap-6">
              <Link
                href="https://github.com"
                target="_blank"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                Source Code
              </Link>

              {status === "loading" ? (
                <div className="h-9 w-20 bg-muted animate-pulse rounded-full" aria-label="Authentication status loading" />
              ) : session?.user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/admin/products"
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-5 py-2 border border-border text-sm font-medium rounded-full hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-5 py-2 bg-foreground text-background text-sm font-medium rounded-full hover:opacity-80 transition-opacity hover:scale-105"
                >
                  Login
                </Link>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? "Close mobile navigation menu" : "Open mobile navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="sm:hidden border-t bg-background/95 backdrop-blur-2xl animate-[fadeInDown_0.2s_ease-out]">
              <div className="container mx-auto px-4 py-4 space-y-3">
                <Link
                  href="https://github.com"
                  target="_blank"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  Source Code
                </Link>

                {status === "loading" ? (
                  <div className="h-10 w-full bg-muted animate-pulse rounded-full" aria-label="Authentication status loading" />
                ) : session?.user ? (
                  <>
                    <Link
                      href="/admin/products"
                      className="block w-full text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        signOut({ callbackUrl: "/" })
                      }}
                      className="w-full text-center px-4 py-2 border text-sm font-medium rounded-full cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="block w-full text-center px-4 py-2 bg-foreground text-background text-sm font-medium rounded-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 pt-16 sm:pt-28 pb-20 sm:pb-40">
        <article>
          <section aria-label="Hero section">
            <div className="max-w-4xl mx-auto text-center animate-[fadeInUp_0.5s_ease-out]">
              <div className="flex justify-center mb-6 sm:mb-8 animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
                <span className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-widest">
                  <SparklesIcon />
                  Next.js 15 Server Components
                </span>
              </div>

              <h1
                className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 sm:mb-10 bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/60 px-4 animate-[fadeInUp_0.5s_ease-out_0.2s_both]"
              >
                {session?.user ? (
                  <>
                    Welcome back, <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                      {session.user.name?.split(" ")[0]}
                    </span>
                  </>
                ) : (
                  <>
                    The New Standard for <br className="hidden sm:block" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
                      E-commerce Management
                    </span>
                  </>
                )}
              </h1>

              <p
                className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4 font-medium animate-[fadeInUp_0.5s_ease-out_0.3s_both]"
              >
                {session?.user ? (
                  <>
                    Your dashboard is ready. Manage products, track analytics, and control your entire e-commerce ecosystem.
                  </>
                ) : (
                  <>
                    A production-grade admin dashboard built for performance. Featuring Server-Side Rendering, AI-powered
                    workflows, and Role-Based Access Control.
                  </>
                )}
              </p>

              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 px-4 animate-[fadeInUp_0.5s_ease-out_0.4s_both]"
              >
                {status === "loading" ? (
                  <div className="flex gap-4">
                    <div className="h-12 w-44 bg-muted animate-pulse rounded-full" aria-label="Loading action buttons" />
                    <div className="h-12 w-44 bg-muted animate-pulse rounded-full" aria-label="Loading action buttons" />
                  </div>
                ) : session?.user ? (
                  <>
                    <Link
                      href="/admin/products"
                      className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-sm hover:shadow-2xl hover:shadow-purple-500/40 transition-all hover:scale-105 flex items-center justify-center gap-2 group"
                    >
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full cursor-pointer sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-muted/60 text-foreground rounded-full font-semibold text-sm hover:bg-muted transition-colors border border-border/50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-sm hover:shadow-2xl hover:shadow-purple-500/40 transition-all hover:scale-105 flex items-center justify-center gap-2 group"
                    >
                      Access Dashboard
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </Link>
                    <Link
                      href="https://github.com"
                      className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-muted/60 text-foreground rounded-full font-semibold text-sm hover:bg-muted transition-colors border border-border/50"
                    >
                      View Documentation
                    </Link>
                  </>
                )}
              </div>
            </div>
          </section>

          <section aria-label="Dashboard preview" className="mt-16 sm:mt-24 md:mt-32 relative mx-auto max-w-6xl px-4">
            <div className="relative rounded-2xl sm:rounded-3xl bg-card border border-border/60 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <Image
                  src="/Hero.png"
                  alt="AdminSuite e-commerce admin dashboard hero preview showing the main dashboard interface with product management table, analytics overview cards, and navigation sidebar for managing e-commerce operations"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1152px"
                  quality={75}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl -z-10" aria-hidden="true" />
          </section>

          <AnimatedFeatureCards />
        </article>
      </main>

      <footer className="border-t border-border/50 py-10 sm:py-14 bg-muted/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 text-center text-muted-foreground">
          <p className="text-xs sm:text-sm font-medium">© 2025 AdminSuite. Built with ❤️ for the Modern Web.</p>
        </div>
      </footer>
    </div>
  )
}

function SparklesIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}