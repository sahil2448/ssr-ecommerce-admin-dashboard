# 🐳 Docker Integration Guide — SSR E-commerce Admin Dashboard

> A beginner-friendly, complete guide to Dockerizing a Next.js application for local development and production deployment.

---

## 📚 Table of Contents

- [What is Docker? (Beginner Primer)](#what-is-docker-beginner-primer)
- [Files We Created & Why](#files-we-created--why)
- [Part 1: Docker for Local Development](#part-1-docker-for-local-development)
- [Part 2: Testing the Production Image Locally](#part-2-testing-the-production-image-locally)
- [Part 3: Understanding Multi-Stage Builds](#part-3-understanding-multi-stage-builds)
- [Docker Commands Cheat Sheet](#docker-commands-cheat-sheet)
- [Resume Bullet Points](#resume-bullet-points)
- [Troubleshooting](#troubleshooting)

---

## What is Docker? (Beginner Primer)

### The Problem Docker Solves

Imagine you write code on your Windows machine. It works perfectly. You send it to a teammate who uses macOS. It crashes because of some library mismatch. You deploy to a Linux server — it crashes again because the server has a different Node.js version.

This is the **"it works on my machine"** problem.

### How Docker Fixes It

Docker packages your application **and everything it needs** (Node.js, npm packages, configuration) into a single lightweight bundle called a **container**. A container is like a portable mini-computer that runs your app exactly the same way everywhere.

```
┌──────────────────────────────────────┐
│         Your Application             │
├──────────────────────────────────────┤
│         Node.js 22 Alpine            │
├──────────────────────────────────────┤
│           Docker Engine              │
├──────────────────────────────────────┤
│    Windows / macOS / Linux           │
└──────────────────────────────────────┘
```

### Key Concepts

| Concept | What It Is | Analogy |
|---------|-----------|---------|
| **Image** | A read-only template with instructions for creating a container | Like a class blueprint |
| **Container** | A runnable instance of an image | Like an instance of a class |
| **Dockerfile** | A recipe file that tells Docker how to build an image | Like a cooking recipe |
| **Docker Compose** | A tool for defining and running multi-container apps | Like a full meal plan |
| **Volume** | A way to persist data or share files between host and container | Like a shared folder |
| **Layer** | Each instruction in a Dockerfile creates a cached layer | Like saving progress in a game |

---

## Files We Created & Why

Here's every file we created, what it does, and why it exists:

### 1. `Dockerfile` — Production Image Recipe

**Purpose:** Builds a lean, secure, production-ready Docker image.

**Why multi-stage?** Normal Node.js images are ~1.2GB because they include everything needed for development (TypeScript compiler, testing libraries, source maps, etc.). A multi-stage build creates the final image using **only what's needed to run** the app, reducing it to ~250MB.

```
Stage 1 (deps)     → Install all npm dependencies
       ↓
Stage 2 (builder)  → Build the Next.js app
       ↓
Stage 3 (runner)   → Copy only the build output + runtime deps
                     Run as non-root user for security
```

**Why `output: "standalone"` in next.config.ts?** Normally, `next build` creates files that depend on the full `node_modules`. With `output: "standalone"`, Next.js creates a self-contained `./next/standalone/` folder with everything the app needs to run — drastically reducing image size.

### 2. `Dockerfile.dev` — Development Image Recipe

**Purpose:** Runs Next.js in development mode inside Docker, with hot reload.

**Key difference from production Dockerfile:**
- **No multi-stage** — keeps it simple for development
- Runs `npm run dev` instead of `npm run build` + `node server.js`
- Source code is NOT copied at build time — it's **mounted as a volume** at runtime, so any edit you make locally instantly reflects in the container

### 3. `.dockerignore` — Context Exclusion List

**Purpose:** Tells Docker what to exclude when building the image.

Without this file, Docker would copy the entire project directory (including `node_modules`, `.next`, `.git`) into the build context, making builds slow and bloated.

```
What we exclude:
  ❌ node_modules      → Reinstalled inside container (may differ from your OS)
  ❌ .next             → Rebuilt inside container
  ❌ .env              → Injected at runtime (security: never bake secrets into images)
  ❌ .git              → Not needed in production
  ❌ Dockerfile(s)     → Would cause recursive build issues
```

### 4. `docker-compose.yml` — Production Local Testing

**Purpose:** Lets you run the production Docker image locally, exactly like it will run on AWS.

This is crucial for testing before deployment. You can verify that:
- All environment variables are properly configured
- The app connects to MongoDB Atlas correctly
- Static assets are served correctly
- No missing dependencies

### 5. `docker-compose.dev.yml` — Development Environment

**Purpose:** Runs the app in development mode with hot reload, inside Docker.

**The magic of volumes:**
```yaml
volumes:
  - .:/app              # Mount local code into container
  - /app/node_modules   # BUT keep container's own node_modules
  - /app/.next          # AND keep container's own .next
```

Without this volume mount, you'd have to rebuild the image every time you make a code change. With it, you edit code on your machine, and the changes appear instantly inside the container (Next.js hot reload handles the rest).

### 6. `next.config.ts` (Modified)

**What changed:** Added `output: "standalone"`

**Why:** This tells Next.js to produce a minimal self-contained server when building. Without this, the Docker image would need the entire `node_modules` folder at runtime, which defeats the purpose of multi-stage builds.

**Does this break Vercel?** No. Vercel ignores this setting and uses its own build system. Your Vercel deployment stays exactly the same.

---

## Part 1: Docker for Local Development

This section guides you through running your app in a Docker container with hot reload — just like `npm run dev`, but inside Docker.

### Prerequisites

Make sure Docker Desktop is running. Verify:

```bash
docker --version
docker compose version
```

### Step 1: Build & Run the Dev Container

```bash
docker compose -f docker-compose.dev.yml up --build
```

**What happens:**
1. Docker reads `Dockerfile.dev`
2. Installs npm dependencies inside the container
3. Mounts your local source code as a volume (so changes sync instantly)
4. Starts Next.js in development mode on `localhost:3000`
5. Excludes `node_modules` and `.next` from the mount (uses container's own)

**Important first-run note:** The first build takes 2-5 minutes because it needs to download the Node.js base image and install npm dependencies. Subsequent runs are nearly instant (cached layers).

### Step 2: Open the App

Open [http://localhost:3000](http://localhost:3000) — your app is running inside Docker!

### Step 3: Test Hot Reload

1. Keep the container running
2. Open `src/app/page.tsx` in your editor
3. Change some text and save
4. Look at the browser — the change appears instantly (no refresh needed)

### Step 4: View Container Logs

```bash
docker compose -f docker-compose.dev.yml logs -f
```

The `-f` flag follows the logs in real-time. You'll see Next.js compilation output, request logs, and any errors.

### Step 5: Run Commands Inside the Container

```bash
docker compose -f docker-compose.dev.yml exec app npm run lint
```

Or get an interactive shell:

```bash
docker compose -f docker-compose.dev.yml exec app sh
```

From inside the container, you can run any command: `ls`, `node --version`, `cat package.json`, etc. Type `exit` to leave.

### Step 6: Stop the Dev Container

```bash
docker compose -f docker-compose.dev.yml down
```

Or press `Ctrl+C` in the terminal where it's running.

---

## Part 2: Testing the Production Image Locally

Before deploying to AWS, test the production image on your machine.

### Step 1: Build the Production Image

```bash
docker compose up --build
```

This uses `docker-compose.yml` (the default file) and builds the multi-stage `Dockerfile`.

**What you'll see:**
```
[+] Building 45.2s (16/16) FINISHED
 => [deps 2/2] RUN npm ci --only=production=false      22.5s
 => [builder 5/5] RUN npm run build                     18.3s
 => [runner 4/5] COPY --from=builder /app/.next/standalone ./   0.2s
```

Notice the three stages: **deps → builder → runner**.

### Step 2: Test the App

Open [http://localhost:3000](http://localhost:3000). You should see the production version — fast, optimized, SSR working. This is **exactly** how it will run on AWS.

### Step 3: Compare Performance

The production container should feel significantly faster than the dev container. This is because:
- All code is compiled/minified (no TypeScript compilation on-the-fly)
- Static assets are cached
- No development middleware overhead

### Step 4: Stop the Production Container

```bash
docker compose down
```

---

## Part 3: Understanding Multi-Stage Builds

Let me explain the three stages in detail:

### Stage 1: `deps`

```dockerfile
FROM node:22-alpine AS deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production=false
```

- Uses `node:22-alpine` as the base — Alpine Linux is very small (~5MB)
- Copies **only** `package.json` and `package-lock.json` first — this leverages Docker layer caching
- If you only change source code (not dependencies), this stage is **reused from cache** on subsequent builds
- `npm install` is used instead of `npm ci` — `npm ci` is faster but stricter about lockfile consistency. In Docker Alpine environments, `npm install` is more compatible and avoids build failures.

### Stage 2: `builder`

```dockerfile
FROM node:22-alpine AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
RUN npm run build
```

- Takes the `node_modules` from the `deps` stage (no re-installing)
- Copies the full application source
- Runs `npm run build` — this produces the `.next` build output
- Notice the `ARG` instruction for `NEXT_PUBLIC_APP_URL` — `NEXT_PUBLIC_*` variables must be passed at build time because Next.js inlines them into the JavaScript bundle

### Stage 3: `runner`

```dockerfile
FROM node:22-alpine AS runner
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
USER nextjs
CMD ["node", "server.js"]
```

- Starts fresh from a clean `node:22-alpine` image
- Copies **only** the standalone build output (~30MB instead of ~400MB `node_modules`)
- Creates and switches to a non-root user (`nextjs`) — security best practice
- Runs `server.js` (the standalone Next.js server)

**Why this matters for your resume:**

> "Reduced Docker image size from ~1.2GB to ~250MB using multi-stage builds, improving deployment speed and reducing storage costs."

This is a **concrete, quantifiable achievement** that employers love to see.

---

## Docker Commands Cheat Sheet

### Development (Hot Reload)

```bash
# Start dev environment
docker compose -f docker-compose.dev.yml up --build

# Start in background (detached mode)
docker compose -f docker-compose.dev.yml up --build -d

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop and remove containers
docker compose -f docker-compose.dev.yml down

# Rebuild without cache (if you suspect caching issues)
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up
```

### Production Testing (Local)

```bash
# Build and run the production image
docker compose up --build

# Run in background
docker compose up --build -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

### General Docker Commands

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# List images
docker images

# Stop a specific container
docker stop <container-id>

# Remove a container
docker rm <container-id>

# Remove an image
docker rmi <image-id>

# Remove unused data (images, containers, volumes)
docker system prune -a

# Execute a command in a running container
docker exec -it <container-name> sh

# View resource usage
docker stats

# Copy file from container to host
docker cp <container-name>:/app/file.txt ./file.txt

# View build history of an image
docker history <image-name>
```

---

## Resume Bullet Points

Here are ready-to-use bullet points for your resume:

### Docker & Containerization

> "Containerized a Next.js 16 SSR application using **Docker multi-stage builds**, reducing the final production image size from ~1.2GB to ~250MB through strategic layer caching and standalone output optimization."

> "Implemented separate **Dockerfiles for development and production**: the dev environment uses **volume mounts** for hot-reload capabilities, while the production image runs as a **non-root user** following security best practices."

> "Leveraged **Docker Compose** to orchestrate environment configuration, managing environment variables through `.env` files and build-time `ARG` directives for `NEXT_PUBLIC_*` variables."

> "Built and tested production Docker images locally using `docker compose`, simulating the exact runtime environment before cloud deployment to ensure zero-configuration failures in production."

### DevOps & Cloud (for later)

> "Deployed containerized application to **AWS App Runner** via **ECR (Elastic Container Registry)**, implementing a CI-ready workflow for automated image pushes and deployments."

### Key Learnings (Interview Talking Points)

- **Multi-stage builds**: Why they reduce image size and improve security
- **Layer caching**: How Docker caches each build step and how to order instructions for maximum cache hits
- **Build-time vs runtime env vars**: Why `NEXT_PUBLIC_*` variables differ from other env vars
- **Volume mounts vs COPY**: When to use each (dev needs mounts, prod needs COPY)
- **Non-root users**: Security best practices in containers
- **Standalone output**: Next.js optimization for containerized deployments

---

## Troubleshooting

### "Port 3000 is already in use"

Something is already running on port 3000. Either stop it, or change the port mapping in the docker-compose file:

```yaml
ports:
  - "3001:3000"   # Maps host port 3001 to container port 3000
```

### "MongoDB connection refused"

Make sure your MongoDB Atlas cluster allows connections from your IP address, or from anywhere (0.0.0.0/0) for development. The container connects to MongoDB Atlas just like your local machine does — the `MONGODB_URI` env var is passed through from `.env`.

### "Hot reload not working"

This usually means the volume mount isn't configured correctly. Verify:
1. Your docker-compose.dev.yml has the volume mount
2. You're using `docker-compose.dev.yml` (not the default `docker-compose.yml`)
3. You're editing files on your host machine, not inside the container

### "Permission denied" errors

On Windows, this is less common. On Linux/Mac, you might need to adjust file permissions:

```bash
# Inside the container
docker compose -f docker-compose.dev.yml exec app sh
chown -R nextjs:nodejs /app
exit
```

### "npm install" fails during build

This usually means there's a network issue or a package version conflict. Try:

```bash
# Rebuild without cache
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up
```

If it still fails, check the full error log:
```bash
docker compose -f docker-compose.dev.yml logs app
```

### "Container exits immediately"

Check the logs:

```bash
docker compose logs app
```

Common causes:
- Missing environment variables (MONGODB_URI, etc.)
- MongoDB connection timeout
- Port already in use

### "Build is slow"

First builds are always slow. Subsequent builds are faster due to caching. To maximize cache hits:
- Change `package.json` infrequently (it invalidates the deps layer)
- Add new files after dependencies are installed
- Don't change `Dockerfile` structure unnecessarily

---

## Quick Start Summary

```bash
# 🚀 DEVELOPMENT (with hot reload)
docker compose -f docker-compose.dev.yml up --build

# 🧪 TEST PRODUCTION BUILD LOCALLY
docker compose up --build

# 🧹 CLEAN UP
docker compose -f docker-compose.dev.yml down
docker compose down
docker system prune -a   # Remove all unused data
```

---

> **Next Up:** Part 2 — Deploying the Dockerized App to AWS using ECR + App Runner!