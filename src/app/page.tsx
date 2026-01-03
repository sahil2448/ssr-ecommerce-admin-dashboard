"use client"

import type React from "react"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, BarChart3, Lock, Zap, Sparkles, Layout, Github, Database, Menu, X } from "lucide-react"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-purple-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-25%] left-[-15%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-purple-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-12%] w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] bg-blue-500/12 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-20%] w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />
      </div>

      <nav className="relative z-50 border-b bg-background/40 backdrop-blur-2xl sticky top-0">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight hover:opacity-80 transition-opacity"
          >
            <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Layout className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="hidden sm:inline">AdminSuite</span>
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="https://github.com/yourusername/your-repo"
              target="_blank"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              Source
            </Link>

            {status === "loading" ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded-full" />
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
                  className="px-5 py-2 border border-border text-sm font-medium rounded-full hover:bg-muted/50 transition-colors"
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
            className="sm:hidden p-2 hover:bg-muted/50 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sm:hidden border-t bg-background/95 backdrop-blur-2xl"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link
                href="https://github.com/yourusername/your-repo"
                target="_blank"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Github className="h-4 w-4" />
                Source Code
              </Link>

              {status === "loading" ? (
                <div className="h-10 w-full bg-muted animate-pulse rounded-full" />
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
                    className="w-full text-center px-4 py-2 border text-sm font-medium rounded-full"
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
          </motion.div>
        )}
      </nav>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 pt-16 sm:pt-28 pb-20 sm:pb-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              Next.js 15 Server Components
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 sm:mb-10 bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/60 px-4"
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
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4 font-medium"
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
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 px-4"
          >
            {status === "loading" ? (
              <div className="flex gap-4">
                <div className="h-12 w-44 bg-muted animate-pulse rounded-full" />
                <div className="h-12 w-44 bg-muted animate-pulse rounded-full" />
              </div>
            ) : session?.user ? (
              <>
                <Link
                  href="/admin/products"
                  className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-sm hover:shadow-2xl hover:shadow-purple-500/40 transition-all hover:scale-105 flex items-center justify-center gap-2 group"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="https://github.com"
                  className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-muted/60 text-foreground rounded-full font-semibold text-sm hover:bg-muted transition-colors border border-border/50"
                >
                  View Documentation
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" as const }}
          className="mt-16 sm:mt-24 md:mt-32 relative mx-auto max-w-6xl px-4"
        >
          <div className="relative rounded-2xl sm:rounded-3xl bg-card border border-border/60 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <img
                src="/Hero.png"
                alt="Dashboard Preview"
                className="absolute inset-0 w-full h-full object-bottom-right object-top"
              />
            </div>
          </div>

          <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl -z-10" />
        </motion.div>

        <div className="mt-20 sm:mt-32 md:mt-40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 px-4">
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-yellow-500" />}
            title="SSR Performance"
            desc="Built with Next.js App Router. Data is pre-fetched on the server for instant page loads and optimal SEO architecture."
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6 text-purple-500" />}
            title="AI-Powered"
            desc="Integrated generative AI to automate product descriptions, leveraging LLMs to speed up content creation workflows."
          />
          <FeatureCard
            icon={<Lock className="h-6 w-6 text-blue-500" />}
            title="Secure RBAC"
            desc="Enterprise-grade security with granular permissions. Admin, Editor, and Viewer roles managed via robust middleware."
          />
          <FeatureCard
            icon={<Database className="h-6 w-6 text-green-500" />}
            title="MongoDB Aggregation"
            desc="Complex data analytics and real-time sales tracking powered by optimized MongoDB aggregation pipelines."
          />
          <FeatureCard
            icon={<Layout className="h-6 w-6 text-pink-500" />}
            title="Modern UI/UX"
            desc="A stunning interface built with Tailwind CSS, Shadcn UI, and Framer Motion for a fluid, application-like feel."
          />
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6 text-orange-500" />}
            title="S3 Cloud Storage"
            desc="Secure, scalable image storage using AWS S3 presigned URLs for direct client-to-cloud uploads."
          />
        </div>
      </main>

      <footer className="border-t border-border/50 py-10 sm:py-14 bg-muted/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 text-center text-muted-foreground">
          <p className="text-xs sm:text-sm font-medium">© 2025 AdminSuite. Built with ❤️ for the Modern Web.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative p-6 sm:p-7 md:p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/60 hover:border-purple-500/40 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="mb-4 p-3 rounded-lg bg-background/60 w-fit border border-border/40 shadow-sm group-hover:scale-110 group-hover:shadow-lg transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg sm:text-base md:text-lg font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}
