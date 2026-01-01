"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Lock, Zap, Sparkles, Layout, Github, Database, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-purple-500/30">
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-purple-500/10 rounded-full blur-[80px] sm:blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-blue-500/10 rounded-full blur-[80px] sm:blur-[100px]" />
      </div>

      <nav className="relative z-50 border-b bg-background/50 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight">
            <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white">
              <Layout className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span>AdminSuite</span>
          </Link>
          
          <div className="hidden sm:flex items-center gap-4">
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
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-2 border text-sm font-medium rounded-full hover:bg-muted transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
              >
                Login
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sm:hidden border-t bg-background/95 backdrop-blur-xl"
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
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
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

      <main className="relative z-10 container mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              Next.js 15 Server Components
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants} 
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 px-4"
          >
            {session?.user ? (
              <>
                Welcome back, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                  {session.user.name?.split(' ')[0]}
                </span>
              </>
            ) : (
              <>
                The New Standard for <br className="hidden sm:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                  E-commerce Management
                </span>
              </>
            )}
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4"
          >
            {session?.user ? (
              <>Your dashboard is ready. Manage products, track analytics, and control your entire e-commerce ecosystem.</>
            ) : (
              <>A production-grade admin dashboard built for performance. 
              Featuring Server-Side Rendering, AI-powered workflows, and Role-Based Access Control.</>
            )}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            {status === "loading" ? (
              <div className="flex gap-3">
                <div className="h-12 w-40 bg-muted animate-pulse rounded-full" />
                <div className="h-12 w-40 bg-muted animate-pulse rounded-full" />
              </div>
            ) : session?.user ? (
              <>
                <Link
                  href="/admin/products"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 group"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full cursor-pointer sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-secondary text-secondary-foreground rounded-full font-medium text-sm hover:bg-secondary/80 transition-colors border"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 group"
                >
                  Access Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="https://github.com"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-secondary text-secondary-foreground rounded-full font-medium text-sm hover:bg-secondary/80 transition-colors border"
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
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-12 sm:mt-20 md:mt-24 relative mx-auto max-w-6xl px-4"
        >
          <div className="relative rounded-lg sm:rounded-xl bg-card border shadow-2xl overflow-hidden group">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <img 
                src="/Hero.png" 
                alt="Dashboard Preview" 
                className="absolute inset-0 w-full h-full object-bottom-right object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
          
          <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg sm:rounded-xl blur-xl sm:blur-2xl opacity-10 sm:opacity-20 -z-10" />
        </motion.div>

        <div className="mt-16 sm:mt-24 md:mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4">
          <FeatureCard 
            icon={<Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />}
            title="SSR Performance"
            desc="Built with Next.js App Router. Data is pre-fetched on the server for instant page loads and optimal SEO architecture."
          />
          <FeatureCard 
            icon={<Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />}
            title="AI-Powered"
            desc="Integrated generative AI to automate product descriptions, leveraging LLMs to speed up content creation workflows."
          />
          <FeatureCard 
            icon={<Lock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />}
            title="Secure RBAC"
            desc="Enterprise-grade security with granular permissions. Admin, Editor, and Viewer roles managed via robust middleware."
          />
          <FeatureCard 
            icon={<Database className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />}
            title="MongoDB Aggregation"
            desc="Complex data analytics and real-time sales tracking powered by optimized MongoDB aggregation pipelines."
          />
          <FeatureCard 
            icon={<Layout className="h-5 w-5 sm:h-6 sm:w-6 text-pink-500" />}
            title="Modern UI/UX"
            desc="A stunning interface built with Tailwind CSS, Shadcn UI, and Framer Motion for a fluid, application-like feel."
          />
          <FeatureCard 
            icon={<BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />}
            title="S3 Cloud Storage"
            desc="Secure, scalable image storage using AWS S3 presigned URLs for direct client-to-cloud uploads."
          />
        </div>
      </main>

      <footer className="border-t py-8 sm:py-12 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 text-center text-muted-foreground">
          <p className="text-xs sm:text-sm">
            © 2025 AdminSuite. Built with ❤️ for the Modern Web.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border hover:border-primary/20 hover:shadow-lg transition-all duration-300 group">
      <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg bg-background w-fit border shadow-sm group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
