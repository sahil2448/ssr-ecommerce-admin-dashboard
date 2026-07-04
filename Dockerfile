# ============================================================
# DOCKERFILE — Multi-Stage Production Build
# Purpose: Build a lean, production-ready Docker image for the
#          Next.js SSR E-commerce Admin Dashboard.
#
# Stage 1: deps     — Install ALL dependencies (including dev)
# Stage 2: builder  — Build the Next.js application
# Stage 3: runner   — Minimal runtime image with only what's needed
# ============================================================

# ------------------------------------------------------------------
# Stage 1: deps
#   - Uses Node.js 22 Alpine (small base image ~130MB)
#   - Copies only package.json and package-lock.json first
#   - Installs ALL dependencies (including devDependencies needed for build)
#   - This layer is cached unless package.json changes
# ------------------------------------------------------------------
FROM node:22-alpine AS deps

# Set working directory inside the container
WORKDIR /app

# Copy package files first (for Docker layer caching)
COPY package.json package-lock.json* ./

# Install ALL dependencies (devDependencies are needed for `next build`)
RUN npm install

# ------------------------------------------------------------------
# Stage 2: builder
#   - Takes the node_modules from the deps stage
#   - Copies the full application source code
#   - Runs `npm run build` to produce the .next build output
#   - Also copies public/ folder and next config
# ------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy node_modules from the deps stage (avoids re-installing)
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Build-time environment variables
# NEXT_PUBLIC_* variables MUST be passed at build time because
# Next.js inlines them into the JavaScript bundle during build.
# All other env vars (MONGODB_URI, AWS_*, etc.) are read at runtime.
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}

# Build the Next.js application
RUN npm run build

# ------------------------------------------------------------------
# Stage 3: runner
#   - The final production image (~250MB, much smaller than full Node image)
#   - Copies ONLY what's needed to run: standalone output, public assets, node_modules
#   - Runs as a non-root user for security (node user, uid 1000)
#   - Uses the standalone output mode from Next.js (enabled in next.config.ts)
# ------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

# Create a non-root user for security best practices
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets (static files served directly)
COPY --from=builder /app/public ./public

# Copy the standalone build output
# This is a self-contained server produced by `next build` when
# `output: "standalone"` is set in next.config.ts
COPY --from=builder /app/.next/standalone ./

# Copy the static generated files (.next/static)
COPY --from=builder /app/.next/static ./.next/static

# Set correct ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set the default environment variable for the port
ENV PORT=3000

# Set the hostname to listen on all interfaces (required for Docker)
ENV HOSTNAME="0.0.0.0"

# Start the Next.js standalone server
CMD ["node", "server.js"]