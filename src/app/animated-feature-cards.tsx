"use client";

import { motion } from "framer-motion";
import { BarChart3, Lock, Zap, Sparkles, Layout, Database } from "lucide-react";
import type React from "react";

export default function AnimatedFeatureCards() {
  return (
    <section aria-label="Key features" className="mt-20 sm:mt-32 md:mt-40">
      <h2 className="sr-only">Key Features of AdminSuite</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 px-4">
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
    </section>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <article>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="group relative p-6 sm:p-7 md:p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/60 hover:border-purple-500/40 shadow-sm hover:shadow-xl transition-all duration-300"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

        <div className="relative z-10">
          <div className="mb-4 p-3 rounded-lg bg-background/60 w-fit border border-border/40 shadow-sm group-hover:scale-110 group-hover:shadow-lg transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-lg sm:text-base md:text-lg font-bold mb-2 text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </motion.div>
    </article>
  );
}