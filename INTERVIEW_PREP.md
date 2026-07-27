# INTERVIEW PREP: SSR E-Commerce Product Management Dashboard

## 1. Summary
This application is a server-side rendered (SSR) administrative dashboard designed for e-commerce store managers to manage product catalogs, monitor sales revenue, and handle multi-user administrative access. It solves the operational problem of slow, client-heavy admin panels by rendering product lists and metrics on the server, enforcing role-based permissions, and streamlining product creation with automated AI description generation and direct S3 file uploads. The system equips store teams with real-time inventory management, sales trend visualizations, and coarse-grained role enforcement across administrators, editors, and read-only viewers.

---

## 2. Architecture

### High-Level Request Flow
```
                      +-------------------------------------------------+
                      |                 Browser Client                  |
                      +------------------------+------------------------+
                                               |
                                        HTTP Request
                                               v
                      +-------------------------------------------------+
                      |                Next.js Edge Server              |
                      |            [ middleware.ts (NextAuth) ]          |
                      +------------------------+------------------------+
                                               |
                          +--------------------+--------------------+
                          |                                         |
               Page Request (SSR/HTML)                    API Request (JSON)
                          v                                         v
        +-----------------------------------+     +-----------------------------------+
        |      Next.js Server Pages         |     |        Next.js Route Handlers     |
        |  (src/app/admin/*, layout.tsx)    |     |          (src/app/api/*)          |
        +-----------------+-----------------+     +-----------------+-----------------+
                          |                                         |
                          +--------------------+--------------------+
                                               |
          +------------------------------------+------------------------------------+
          |                                    |                                    |
          v                                    v                                    v
+-------------------+                +-------------------+                +-------------------+
|  MongoDB Database |                |   AWS S3 Bucket   |                |   OpenRouter API  |
|  (Mongoose ORM)   |                |   (Presigned PUT) |                | (LLM Description) |
+-------------------+                +-------------------+                +-------------------+
```

### Folder Structure
- **`.agents/`**: Workspace agent configuration and skill definitions for local development tooling.
- **`public/`**: Static public assets served directly by Next.js, such as default OpenGraph social images and icons.
- **`scripts/`**: Utility scripts (e.g. `seed.ts`) for populating MongoDB with mock products, categories, and 90-day order histories.
- **`src/app/`**: Next.js App Router root containing public landing pages, authenticated admin screens, auth pages, and API route handlers.
- **`src/app/admin/`**: Protected admin routes (Dashboard Overview, Products, Analytics, Users, Unauthorized) enforcing server-side session checks.
- **`src/app/api/`**: RESTful API endpoints handling authentication, AI generation, metrics aggregations, presigned uploads, and product CRUD.
- **`src/app/auth/`**: Authentication pages for user sign-in, account registration, and OAuth error reporting.
- **`src/components/`**: UI components organized by domain (`admin`, `analytics`, `auth`, `products`, `ui`).
- **`src/lib/`**: Core utilities, database connection singleton, NextAuth config, S3 helpers, SEO helpers, SWR wrapper, and Zod schemas.
- **`src/models/`**: Mongoose schemas and TypeScript interfaces for database collections (`User`, `Product`, `Order`).

### Server-Side Rendering (SSR) vs. Client-Side Rendering (CSR)

| Route / Page | Strategy | Reason |
| :--- | :--- | :--- |
| `src/app/page.tsx` (Landing) | **SSR** | Pre-renders SEO metadata, OpenGraph tags, and JSON-LD structured data on the server for search engine and AI crawler indexing. |
| `src/app/admin/products/page.tsx` | **SSR** | Performs initial server-side session verification via `auth()`, checks URL search parameters (`page`, `search`), and passes initial states to client tables. |
| `src/app/admin/users/page.tsx` | **SSR** | Enforces server-side RBAC; checks if `session.user.role !== "admin"` before rendering any DOM, redirecting unauthorized users instantly. |
| `src/app/admin/products/[id]/page.tsx` | **SSR** | Dynamically fetches product data via `generateMetadata()` to produce custom page titles and descriptions per product page. |
| `src/components/products/products-table.tsx` | **CSR** | Handles interactive state (live search input, page state changes, SWR revalidation, open/close modal dialogs). |
| `src/components/analytics/sales-charts-client.tsx` | **CSR** | Recharts requires browser DOM APIs (`window`, SVG dimensions); wrapped with `next/dynamic({ ssr: false })` to prevent hydration mismatches. |

### Auth Flow End-to-End
1. **Authentication Request**: User submits credentials on `/auth/login` or clicks an OAuth button (GitHub/Google).
2. **Provider Handler** (`src/lib/auth/auth.ts`):
   - **Credentials**: `authorize()` parses input with Zod, connects to MongoDB via `connectDB()`, fetches the user with `.select("+password")`, verifies `user.isActive`, and validates password via `user.comparePassword(password)` (bcryptjs).
   - **OAuth (GitHub / Google)**: `signIn` callback queries MongoDB by email. If found, attaches `user.id` and `user.role`. If new, creates user set to `role: userCount === 0 ? "admin" : "viewer"`.
3. **JWT Issuance** (`src/lib/auth/config.ts`): NextAuth executes the `jwt` callback, embedding `user.id` and `user.role` into the encrypted JWT cookie (`maxAge: 30 days`).
4. **Session Exposure**: The `session` callback reads the JWT claims and populates `session.user.id` and `session.user.role` for access across server components and API routes.
5. **Middleware Verification** (`middleware.ts`): Intercepts requests to `/admin/*`, `/api/products/*`, and `/api/metrics/*`. Checks for active session via NextAuth `auth()`. Redirects unauthenticated requests to `/auth/login?callbackUrl=...`.
6. **API/Route RBAC Check**: API routes (e.g., `src/app/api/products/route.ts`) inspect `session.user.role`. Viewers are blocked from `POST`/`PATCH` (403 Forbidden), and non-admins are blocked from `DELETE` operations and user management endpoints.

### Data Flow for Product Creation (CRUD)
1. **User Action**: Admin fills out the 3-step wizard in `src/components/products/product-form/multi-step-form.tsx`.
2. **AI Description (Optional)**: User clicks "Generate with AI" in `steps.tsx`. Client posts prompt and keywords to `/api/ai/generate`. The route calls OpenRouter API with fallbacks (`llama-3.2-3b` -> `gemini-2.0-flash` -> `gemma-4-26b`) and returns formatted bullet points.
3. **Image Upload**: User selects an image file. Client calls `uploadToS3(file)` in `src/lib/s3-upload.ts`:
   - Client sends `POST /api/uploads/presign` with filename and filetype.
   - Server returns AWS S3 presigned PUT URL generated via `getSignedUrl(s3, PutObjectCommand)`.
   - Client uploads binary file directly to S3 via `fetch(uploadUrl, { method: "PUT", body: file })`.
   - Public S3 URL and object key are stored in React Hook Form state.
4. **Form Validation**: Clicking "Create Product" validates form state against `CreateProductSchema` via `@hookform/resolvers/zod`.
5. **Database Write**: Client sends `POST /api/products` with JSON payload. Route handler verifies session, checks `role !== "viewer"`, validates payload with Zod, connects to MongoDB (`connectDB()`), creates document via `Product.create()`, and returns HTTP 201.
6. **UI Refresh**: Client receives 201 response, displays Sonner success toast, invalidates SWR cache via `mutate()`, and redirects to `/admin/products`.

---

## 3. File-by-File Walkthrough

### Root & Config
- **`middleware.ts`**: Edge middleware using NextAuth `auth()` wrapper to protect `/admin/*` and API routes; redirects unauthenticated users to `/auth/login`. If removed, unauthorized users could access admin routes directly without logging in.
- **`next.config.ts`**: Next.js project configuration specifying `output: "standalone"` and `outputFileTracingRoot`. If removed, multi-stage Docker builds will fail to package self-contained runtime artifacts.
- **`Dockerfile`**: 3-stage multi-stage Docker build (`deps` -> `builder` -> `runner`) producing an optimized Alpine runtime image running as non-root user `nextjs`. If removed, automated container deployment pipelines break.
- **`docker-compose.yml`**: Production container orchestration defining environment variables, port mappings (3000:3000), and restart policies. If removed, multi-container orchestration and environment startup require manual commands.
- **`scripts/seed.ts`**: Standalone TypeScript script that populates MongoDB with 25 realistic categorized products and 90 days of synthetic order data. If removed, developers must seed database inventory manually for testing.

### Core Libraries & Utilities (`src/lib`)
- **`src/lib/auth/auth.ts`**: NextAuth instance export defining Credentials, GitHub, and Google providers, password comparison, and OAuth database auto-provisioning. If removed, authentication fails completely across the application.
- **`src/lib/auth/config.ts`**: Decoupled NextAuth configuration specifying JWT session strategy (30-day maxAge), custom login/error page paths, and `jwt`/`session` callbacks. If removed, user roles (`admin`/`editor`/`viewer`) will not persist in session objects.
- **`src/lib/db.ts`**: Global Mongoose connection caching utility (`global.mongooseCache`) preventing connection leaks during serverless hot-reloads. If removed, database connections exhaust quickly under concurrent requests.
- **`src/lib/http.ts`**: Typed fetch wrapper utility (`api<T>`) handling JSON headers and extracting detailed error messages from API responses. If removed, client-side API requests lack standardized error parsing.
- **`src/lib/s3.ts`**: AWS S3 Client singleton initialized with bucket name, region, and IAM credentials. If removed, presigned URL generation and S3 object deletion break.
- **`src/lib/s3-upload.ts`**: Client-side helper function executing the two-step upload process (presign request followed by direct S3 binary PUT). If removed, image upload components fail to send files to S3.
- **`src/lib/seo.ts`**: Utility functions generating standardized OpenGraph tags, Twitter cards, JSON-LD schemas (`WebApplication`, `BreadcrumbList`), and indexing rules. If removed, pages lose metadata structure and SEO formatting.
- **`src/lib/swr.ts`**: Custom SWR hook (`useApiSWR`) configured with `revalidateOnFocus` and `keepPreviousData` for cached client data fetching. If removed, components fetching API data lose automatic revalidation and caching.
- **`src/lib/validators/product.ts`**: Zod validation schemas (`CreateProductSchema`, `UpdateProductSchema`, `ListProductsQuerySchema`) defining constraints for product fields, prices, and queries. If removed, request validation collapses, allowing malformed database writes.

### Database Models (`src/models`)
- **`src/models/User.ts`**: Mongoose model for users with email, hashed password, role enum (`admin`, `editor`, `viewer`), `isActive` flag, and pre-save bcrypt hashing hook. If removed, user authentication and RBAC database operations fail.
- **`src/models/Product.ts`**: Mongoose model for products storing name, category, price, stock, SKU, image array (`url`, `key`), and indexed search fields. If removed, product CRUD operations and stock tracking break.
- **`src/models/Order.ts`**: Mongoose schema storing order status (`paid`, `refunded`, `cancelled`) and array of order items with price snapshots. If removed, sales analytics and revenue aggregation pipelines crash.

### API Route Handlers (`src/app/api`)
- **`src/app/api/auth/[...nextauth]/route.ts`**: NextAuth dynamic HTTP route handler exposing `GET` and `POST` handlers for authentication endpoints. If removed, all NextAuth authentication routes (`/api/auth/session`, `/api/auth/signin`) return 404.
- **`src/app/api/auth/register/route.ts`**: Endpoint for user registration; validates input with Zod, checks email uniqueness, and assigns `admin` role to first user, else `viewer`. If removed, new users cannot register via email/password.
- **`src/app/api/admin/users/route.ts`**: Admin-only route for listing all users (excluding password hashes) and creating new accounts. If removed, user management panel cannot list or create accounts.
- **`src/app/api/admin/users/[id]/route.ts`**: Admin-only endpoint for updating user roles/status (`PATCH`) or deleting user accounts (`DELETE`). If removed, admin role assignment and account deletion fail.
- **`src/app/api/ai/generate/route.ts`**: AI generation endpoint iterating through OpenRouter LLM models (`llama-3.2-3b`, `gemini-2.0-flash`, `gemma-4-26b`) to generate product descriptions. If removed, AI description generation fails.
- **`src/app/api/metrics/overview/route.ts`**: Aggregation endpoint executing parallel MongoDB queries for total products, low stock count, out-of-stock count, and total paid revenue. If removed, top overview metric cards fail to render.
- **`src/app/api/metrics/sales/route.ts`**: Aggregation pipeline using `$facet` to compute daily revenue trends and top 5 revenue-generating products over N days. If removed, sales analytics charts lose data.
- **`src/app/api/products/route.ts`**: Handles paginated product listing with search/filter/sort (`GET`) and product creation with Zod validation and RBAC checks (`POST`). If removed, product table and creation forms break.
- **`src/app/api/products/[id]/route.ts`**: Handles single product retrieval (`GET`), update (`PATCH`), and deletion (`DELETE`), automatically removing orphaned S3 images on update/delete. If removed, editing or deleting products fails.
- **`src/app/api/uploads/presign/route.ts`**: Generates AWS S3 presigned PUT URLs valid for 5 minutes using `@aws-sdk/s3-request-presigner`. If removed, client file uploads fail due to missing S3 upload targets.

### Application Pages & Layouts (`src/app`)
- **`src/app/layout.tsx`**: Root layout wrapping application with Geist fonts, global CSS, SWR/Session Providers, Sonner toast container, and global JSON-LD. If removed, the application loses global styling and providers.
- **`src/app/page.tsx`**: Public landing page pre-rendering SEO metadata, breadcrumbs, feature highlights, and call-to-action buttons. If removed, the root route (`/`) returns a 404 error.
- **`src/app/landing-page-client.tsx`**: Client component rendering interactive landing page hero, feature grids, technology badges, and navigation links. If removed, landing page interactivity and layout break.
- **`src/app/robots.ts`**: Next.js metadata route generating `robots.txt` rules for general crawlers and AI bots (`GPTBot`, `PerplexityBot`). If removed, web crawlers lack access control guidance for private routes.
- **`src/app/sitemap.ts`**: Dynamic sitemap generator returning XML entries for canonical index URLs. If removed, search engines miss automated sitemap index files.
- **`src/app/admin/layout.tsx`**: Server layout wrapping admin screens in `AdminShell`, enforcing session verification and initializing toasts. If removed, admin routes lose navigation sidebar and authentication guards.
- **`src/app/admin/page.tsx`**: Main dashboard page displaying overview metric cards and quick-action navigation cards. If removed, the `/admin` root page fails to display metrics.
- **`src/app/admin/analytics/page.tsx`**: Analytics page displaying overview metrics and Recharts sales trend graphs. If removed, the `/admin/analytics` route disappears.
- **`src/app/admin/products/page.tsx`**: Server page reading URL search params and passing logged-in user role to `ProductsTable`. If removed, product management screen is inaccessible.
- **`src/app/admin/products/new/page.tsx`**: Server page rendering the multi-step product creation form wrapper. If removed, users cannot navigate to the product creation page.
- **`src/app/admin/products/[id]/page.tsx`**: Server page generating dynamic product metadata and rendering the product edit wizard. If removed, dynamic product detail routes break.
- **`src/app/admin/products/[id]/edit/page.tsx`**: Server page rendering the product editing interface for specific product IDs. If removed, direct edit URLs return 404.
- **`src/app/admin/users/page.tsx`**: Admin-only page enforcing `session.user.role === "admin"` before rendering user account controls. If removed, user management route is lost.
- **`src/app/admin/unauthorized/page.tsx`**: Server component rendering access denied page for users lacking permissions. If removed, unauthorized redirects crash.
- **`src/app/auth/login/page.tsx`**: Server page rendering the login form container for email/password and OAuth sign-in. If removed, users cannot navigate to login.
- **`src/app/auth/login/login-page-client.tsx`**: Client login component handling credentials submission, NextAuth `signIn()` invocation, and error handling. If removed, interactive login interactions fail.
- **`src/app/auth/register/page.tsx`**: Server container page rendering user registration form. If removed, registration route fails.
- **`src/app/auth/register/register-page-client.tsx`**: Client component managing user registration form inputs, API submission to `/api/auth/register`, and auto-login. If removed, user registration form breaks.
- **`src/app/auth/error/page.tsx`**: Error display page rendering friendly messages for OAuth configuration issues or canceled sign-ins. If removed, auth failures trigger unhandled exceptions.

### UI & Domain Components (`src/components`)
- **`src/components/admin/admin-shell.tsx`**: Responsive layout component rendering sidebar navigation, top bar header, mobile slide-out drawer, and main content area. If removed, admin panel loses its outer structure.
- **`src/components/admin/sidebar.tsx`**: Navigation sidebar displaying navigation links conditionally filtered by active path and user role. If removed, desktop navigation breaks.
- **`src/components/admin/topbar.tsx`**: Header bar displaying current route title, mobile menu toggle button, and user menu dropdown. If removed, top navigation controls disappear.
- **`src/components/admin/toast-handler.tsx`**: Invisible client component listening to URL query search parameters to trigger Sonner toast notifications (e.g. `?toast=unauthorized`). If removed, URL-driven toasts fail.
- **`src/components/admin/user-management.tsx`**: Client component for admins to view user lists, change roles dynamically via dropdown, create users, or delete accounts. If removed, user administration UI vanishes.
- **`src/components/analytics/overview-cards.tsx`**: Client component fetching `/api/metrics/overview` via SWR and displaying metric cards (Revenue, Total Products, Units Sold, Low Stock, Out of Stock). If removed, dashboard KPI metrics disappear.
- **`src/components/analytics/sales-charts.tsx`**: Wrapper component using `next/dynamic` with `ssr: false` to safely load the client chart component without SSR hydration errors. If removed, sales charts trigger hydration errors.
- **`src/components/analytics/sales-charts-client.tsx`**: Recharts implementation rendering AreaChart (Revenue Trend), BarChart (Units Sold), and Top 5 Products ranking table. If removed, sales visual graphs fail to render.
- **`src/components/auth/user-menu.tsx`**: Header dropdown component displaying user avatar, name, badge, and sign-out button. If removed, user profile display and logout controls disappear.
- **`src/components/products/products-table.tsx`**: Data table client component supporting search debouncing, pagination controls, status badges, and action buttons filtered by user role. If removed, product listing grid breaks.
- **`src/components/products/delete-product-dialog.tsx`**: Radix UI modal dialog asking for confirmation before triggering product deletion. If removed, product deletion occurs without confirmation.
- **`src/components/products/product-detail-dialog.tsx`**: Radix UI modal displaying complete product specs, image gallery preview, SKU, pricing, and stock details. If removed, quick product inspect modal breaks.
- **`src/components/products/product-form/multi-step-form.tsx`**: Wizard container managing state across 3 form steps, validating step transitions with Zod, and posting payloads to API endpoints. If removed, product creation/editing forms fail.
- **`src/components/products/product-form/steps.tsx`**: Step sub-components (`StepBasics`, `StepPricing`, `StepImagesReview`) rendering form fields, AI description generator popover, and S3 image uploader. If removed, product form step UI components fail to load.

---

## 4. Key Features, Explained Simply

### 1. RBAC with OAuth Providers + JWT Session Middleware
- **WHAT**: A multi-role access control system supporting 3 authentication methods (Credentials email/password, GitHub OAuth, Google OAuth) with session state stored in 30-day encrypted JWT cookies.
- **WHY**: Session-based database lookups on every request add latency and database strain. Using JWTs allows stateless session verification across edge middleware and API routes. The first registered user automatically becomes `admin`, while subsequent OAuth users default to `viewer` to prevent unauthorized escalation.
- **HOW**: NextAuth initializes in `src/lib/auth/auth.ts`. When a user authenticates via OAuth or Credentials, `signIn` checks MongoDB. If new, it assigns `role: count === 0 ? "admin" : "viewer"`. The `jwt` callback embeds `token.role` and `token.id` inside the encrypted JWT cookie. Middleware (`middleware.ts`) inspects the token on `/admin/*` routes, while API handlers (`src/app/api/products/route.ts`) explicitly enforce RBAC: `viewer` accounts receive 403 Forbidden on `POST`/`PATCH`, and non-admins receive 403 on `DELETE`.

### 2. AWS S3 Presigned Upload Flow
- **WHAT**: Direct client-to-S3 image upload workflow using short-lived signed URLs, bypassing application server file streaming.
- **WHY**: Uploading large image files directly through Next.js server routes consumes server memory, blocks Node.js event loops, and causes server timeouts under heavy loads.
- **HOW**: 
  1. User selects a file in `StepImagesReview` (`src/components/products/product-form/steps.tsx`).
  2. Client calls `/api/uploads/presign` via `src/lib/s3-upload.ts`.
  3. Server route (`src/app/api/uploads/presign/route.ts`) generates a unique key (`products/<UUID>.<ext>`) and constructs a `PutObjectCommand`. It uses `@aws-sdk/s3-request-presigner`'s `getSignedUrl()` to produce a presigned URL expiring in 300 seconds.
  4. Client executes an HTTP `PUT` directly to S3 with the binary payload.
  5. On success, the public S3 URL is stored in form state. When products are updated or deleted, `src/app/api/products/[id]/route.ts` sends `DeleteObjectsCommand` to purge orphaned images from the S3 bucket.

### 3. OpenRouter Multi-LLM Fallback for AI Descriptions
- **WHAT**: AI-assisted copywriting tool built into the product form that generates product description bullet points using OpenRouter's API with an automated model fallback chain.
- **WHY**: Single LLM API endpoints frequently encounter rate limits, downtime, or capacity constraints. Using an ordered fallback array across multiple free models guarantees high reliability without incurring API costs.
- **HOW**: 
  1. User clicks "Generate with AI" in `steps.tsx`, sending product name and optional keywords to `POST /api/ai/generate`.
  2. Server defines a fallback sequence: `meta-llama/llama-3.2-3b-instruct:free` -> `google/gemini-2.0-flash-exp:free` -> `google/gemma-4-26b-a4b-it:free`.
  3. A `for...of` loop attempts requests to OpenRouter. If a model throws an error or returns empty text, `catch` logs a warning and the loop continues to the next model.
  4. Once text is returned, the response breaks out of the loop and populates the description field in React Hook Form.

### 4. Multi-Stage Docker Build
- **WHAT**: Production container setup using Docker multi-stage builds (`deps` -> `builder` -> `runner`) paired with Next.js standalone output.
- **WHY**: Standard Node.js container builds bundle source code, `devDependencies`, TypeScript compilers, and build caches, resulting in massive image sizes (>1GB) with expanded security attack surfaces.
- **HOW**: `next.config.ts` specifies `output: "standalone"`. `Dockerfile` builds the application in three stages:
  1. `deps`: Installs full `node_modules`.
  2. `builder`: Compiles Next.js app (`npm run build`), generating `.next/standalone` (a minimal self-contained Node server).
  3. `runner`: Copies *only* `.next/standalone`, `.next/static`, and `public/` into a minimal Node 22 Alpine base image, executing as non-root user `nextjs`. This reduces final image size by ~75% (~250MB) and cuts container deployment times significantly.

### 5. SSR Metadata & SEO for Crawlers
- **WHAT**: Comprehensive search engine and AI crawler optimization setup including dynamic metadata tags, OpenGraph images, JSON-LD structured data, and custom `robots.ts` rules.
- **WHY**: Admin dashboards require strict isolation of private routes while ensuring public landing pages are fully indexable by search engines and AI agents.
- **HOW**: `src/lib/seo.ts` exports `privatePageMetadata()`, which attaches `robots: { index: false, follow: false }` to protected admin pages (`/admin/*`). For public pages (`src/app/page.tsx`), `layout.tsx` injects `WebApplication` and `BreadcrumbList` JSON-LD schemas. `src/app/robots.ts` sets tailored indexing permissions, granting public route access to search engines and AI crawlers (`GPTBot`, `PerplexityBot`, `Google-Extended`) while explicitly disallowing access to `/admin/`, `/api/`, and `/auth/`.

### 6. Real-Time Analytics via MongoDB Aggregation Pipelines
- **WHAT**: Real-time sales and inventory metrics computed directly in MongoDB using multi-stage aggregation pipelines and rendered via Recharts.
- **WHY**: Computing revenue, order counts, and top-selling products in Node.js application memory requires pulling thousands of raw order records, causing severe memory spikes and latency.
- **HOW**: 
  - Overview metrics (`src/app/api/metrics/overview/route.ts`) execute `Product.countDocuments()` alongside an `Order.aggregate()` pipeline (`$match: { status: "paid" }` -> `$unwind: "$items"` -> `$group` revenue and units sold).
  - Sales charts endpoint (`src/app/api/metrics/sales/route.ts`) uses a single `$facet` pipeline to compute daily sales time-series (`$group` by year/month/day) and top 5 revenue products simultaneously in one DB pass.
  - The client component (`SalesCharts`) dynamically imports `SalesChartClient` (`ssr: false`) to render Recharts Area and Bar graphs cleanly without SSR hydration errors.

---

## 5. Most Likely Interview Questions

### Architecture & Design Decisions

#### Q1: "Why did you choose Next.js App Router with SSR for an internal admin dashboard instead of a pure React SPA?"
> **Model Answer**: "I chose Next.js SSR because admin dashboards need fast initial page loads and secure, server-enforced authentication before any client JavaScript executes. With a pure React SPA, the user downloads a blank bundle, loads JavaScript, and then makes client-side API requests to check authentication, leading to layout flashes and exposed client routes. With Next.js SSR, server components verify session tokens in `src/app/admin/layout.tsx` before rendering, serving pre-rendered HTML directly while keeping client JavaScript bundles minimal."

#### Q2: "How did you structure your application folders, and what was the rationale behind splitting UI components by domain?"
> **Model Answer**: "I organized `src/` into distinct domain-driven folders: `app` for routes and API handlers, `components` split by feature domain (`admin`, `analytics`, `auth`, `products`), `lib` for shared singletons and schemas, and `models` for Mongoose schemas. Grouping components by feature rather than generic types (`buttons`, `inputs`) keeps related code localized. For instance, all product creation wizard logic lives inside `src/components/products/product-form/`, making the codebase modular and easy to maintain."

#### Q3: "Why did you separate NextAuth configuration between `auth.ts` and `config.ts`?"
> **Model Answer**: "I separated them because Next.js Edge Middleware runs on the V8 Edge runtime, which does not support Node.js native modules like `bcryptjs` or direct Mongoose database drivers. `src/lib/auth/config.ts` contains lightweight, Edge-compatible configuration like JWT callbacks and route settings used by `middleware.ts`. `src/lib/auth/auth.ts` imports Node.js-specific database code and password comparison functions for server routes. This separation prevents Edge runtime compilation errors during build time."

#### Q4: "Why use Mongoose ORM over raw MongoDB drivers or Prisma in this project?"
> **Model Answer**: "Mongoose was chosen because it provides strong schema validation, pre-save middleware hooks, and type safety for document-based MongoDB data. For example, in `src/models/User.ts`, I used a Mongoose pre-save hook to hash user passwords automatically with `bcryptjs` whenever the password field is modified. Mongoose model caching (`mongoose.models.Product || model(...)`) also prevents re-compilation errors during Next.js hot-reloads."

---

### Security

#### Q5: "How do you prevent a stolen JWT session token from being abused in your application?"
> **Model Answer**: "Tokens are configured with HTTP-only, secure, SameSite flags via NextAuth to prevent access from client-side XSS scripts. Furthermore, while JWT verification occurs statelessly at the middleware level, sensitive API endpoints like `POST /api/products` execute secondary session checks (`await auth()`) and look up the user's `isActive` status in MongoDB. If an admin disables an account in `UserManagement`, the user is blocked at the database level on their next write request even if their JWT cookie has not expired."

#### Q6: "How do you prevent role escalation if a user modifies their role in local storage or client state?"
> **Model Answer**: "Role state is never trusted from the client. User roles are encrypted inside the server-signed JWT cookie during authentication callbacks in `src/lib/auth/config.ts`. When a client makes a request, the server decodes the JWT signature. In API routes like `src/app/api/products/[id]/route.ts`, the backend verifies `session.user.role` directly from the decoded session token. If a viewer attempts to send a `DELETE` request, the API route immediately returns HTTP 403 Forbidden regardless of client UI state."

#### Q7: "Why did you choose JWT session strategy over database-stored sessions in NextAuth?"
> **Model Answer**: "JWT sessions allow stateless verification in Next.js Edge Middleware (`middleware.ts`) without requiring a database query on every page navigation or static asset request. This eliminates database I/O bottlenecks for routine routing. For administrative actions where real-time accuracy is critical, API handlers perform targeted database validation to maintain security."

#### Q8: "How is user password safety handled during registration and authentication?"
> **Model Answer**: "Passwords are never stored in plain text. In `src/models/User.ts`, a Mongoose pre-save hook generates a salt with 12 rounds of `bcryptjs` and hashes the password before persistence. During login in `src/lib/auth/auth.ts`, the user schema excludes the password field by default (`select: false`), requiring explicit `.select('+password')` queries before running `comparePassword()`. This prevents accidental password leaks in API responses."

#### Q9: "How do you secure your AWS S3 bucket while allowing client image uploads?"
> **Model Answer**: "The S3 bucket does not allow unrestricted public write access. Client uploads require a short-lived presigned PUT URL generated server-side in `src/app/api/uploads/presign/route.ts` using AWS IAM credentials. The presigned URL expires in 5 minutes and locks the target S3 object key (`products/<UUID>.<ext>`) and `Content-Type`. Clients can only upload to the exact path specified by the server."

---

### Scaling & Performance

#### Q10: "What component would break first if traffic to your dashboard increased 10x, and how would you fix it?"
> **Model Answer**: "Under 10x traffic, MongoDB database connections would bottleneck first because serverless route handlers open database connections dynamically. Although `src/lib/db.ts` caches connections globally (`global.mongooseCache`), spikes in serverless execution instances could exhaust MongoDB connection pool limits. To fix this, I would implement MongoDB Atlas Connection Pooling or introduce Prisma Accelerate / AWS DocumentDB proxying to manage connection pooling globally."

#### Q11: "Why did you use Next.js standalone output mode in production?"
> **Model Answer**: "In `next.config.ts`, setting `output: 'standalone'` instructs Next.js to trace package dependencies and bundle only the explicit files required to run the production server. This eliminates unused `node_modules`, build artifacts, and development dependencies from the final Docker image, reducing container image size from over 1GB down to ~250MB and accelerating deployment speeds."

#### Q12: "How does SWR improve performance and user experience in your data tables?"
> **Model Answer**: "In `src/components/products/products-table.tsx`, `useApiSWR` provides client-side caching and optimistic UI updates. When users paginate or search, SWR serves cached data instantly (`keepPreviousData: true`) while revalidating in the background. This eliminates jarring loading spinners between page transitions while keeping product table data in sync."

#### Q13: "How do your MongoDB aggregation pipelines optimize sales analytics calculation?"
> **Model Answer**: "Calculating sales trends in Node.js application memory would require pulling tens of thousands of order records over the wire. In `src/app/api/metrics/sales/route.ts`, I used a single MongoDB `$facet` aggregation pipeline. MongoDB processes `$match`, `$unwind`, `$group`, and `$sort` natively in database memory, returning pre-calculated daily totals and top 5 products in a single lightweight JSON payload."

---

### Tradeoffs & Alternatives

#### Q14: "Why integrate multiple OAuth providers (GitHub & Google) alongside traditional Credentials instead of relying solely on NextAuth default email links?"
> **Model Answer**: "Relying on passwordless magic links requires configuring an SMTP mail server, which adds operational overhead and delivery latency. Providing GitHub and Google OAuth alongside Credentials allows enterprise and developer users to authenticate instantly via existing identity providers while retaining standard email/password access for fallback administration."

#### Q15: "Why call OpenRouter AI API instead of calling OpenAI or Anthropic SDKs directly?"
> **Model Answer**: "Calling a single LLM vendor API directly introduces single-point-of-failure risks if that provider experiences downtime or rate limits. In `src/app/api/ai/generate/route.ts`, OpenRouter acts as an API gateway, allowing me to define a fallback sequence across multiple free models (`llama-3.2-3b` -> `gemini-2.0-flash` -> `gemma-4-26b`). If one model fails, the route automatically catches the exception and falls back to the next provider seamlessly."

#### Q16: "What would you re-architect in this codebase if you were starting fresh today?"
> **Model Answer**: "I would complete the RBAC path matcher logic in `middleware.ts`, which currently allows access to all `/admin/*` sub-routes for authenticated users regardless of role, relying instead on API-level checks. Secondly, I would implement database transactions (MongoDB sessions) when deleting products to guarantee that S3 image deletion and database document deletion succeed or roll back atomically."

#### Q17: "Why use client-side presigned S3 uploads instead of uploading files through Next.js API routes?"
> **Model Answer**: "Streaming file uploads through Next.js API routes forces serverless Node.js functions to buffer binary file chunks in memory, increasing memory utilization and risk of request timeout limits. Presigned URLs decouple file transfers from application servers, streaming binary payloads directly from the user browser to AWS S3 storage."

---

### AI & LLM Integration

#### Q18: "How does your AI description generator handle model rate limits or API outages?"
> **Model Answer**: "In `src/app/api/ai/generate/route.ts`, model invocation is wrapped in a `try...catch` block inside a `for...of` loop over an array of model identifiers. If OpenRouter returns an HTTP error or empty completion for `llama-3.2-3b`, the handler logs a warning, catches the error, and immediately tries `gemini-2.0-flash`. The request only fails if all fallback models fail."

#### Q19: "How is LLM output validated and sanitized before populating the form or database?"
> **Model Answer**: "The AI endpoint enforces system instructions specifying concise bullet-point output without conversational preamble. Once returned to the client, the generated text populates the description field of React Hook Form. Before database write, `POST /api/products` validates the text string against `CreateProductSchema` via Zod, ensuring character length constraints (10 to 5000 characters) are strictly met."

#### Q20: "Why use system prompts with zero temperature controls for product descriptions?"
> **Model Answer**: "In `src/app/api/ai/generate/route.ts`, the system prompt explicitly restricts the LLM to professional e-commerce bullet points based strictly on provided keywords. Setting temperature to `0.7` balances creative wording with structured bullet outputs, preventing hallucinations while generating compelling marketing copy."

---

### Edge Cases & Failure Modes

#### Q21: "What happens if an S3 image upload succeeds, but the user closes the browser before saving the product?"
> **Model Answer**: "If a user uploads an image, the file is stored in S3 at key `products/<UUID>.<ext>`. If they abandon the form before submitting, that image becomes an unreferenced S3 object. To resolve this in production, I would configure an AWS S3 Lifecycle Rule to automatically delete objects in the `products/` prefix that are not linked to a MongoDB product document within 24 hours."

#### Q22: "How does your application handle concurrent stock updates if two admins edit a product simultaneously?"
> **Model Answer**: "Currently, product updates in `src/app/api/products/[id]/route.ts` execute Mongoose `findByIdAndUpdate()`, where the last write wins. To prevent stock overwrite race conditions, I would implement optimistic concurrency control using Mongoose document versioning (`__v`) or atomic operators like `Product.updateOne({ _id, stock: { $gte: qty } }, { $inc: { stock: -qty } })`."

#### Q23: "What happens if S3 deletion fails when an admin deletes a product?"
> **Model Answer**: "In `src/app/api/products/[id]/route.ts`, `Product.findByIdAndDelete()` executes first, followed by `s3.send(DeleteObjectsCommand)`. If AWS S3 is unreachable, the database record is already removed, but the images remain in S3. Wrapping both operations in an event queue or background cleanup job would ensure eventual consistency for storage cleanup."

---

## 6. Weak Spots & Things to Double-Check

### 1. Incomplete Middleware RBAC Restrictions
- **File**: [`middleware.ts`](file:///c:/Users/Sahil%20Kamble/OneDrive/Desktop/SIGMA3.0_DEV/Projects/ssr-ecommerce-admin-dashboard/middleware.ts#L7-L49)
- **Issue**: In `middleware.ts`, `ROLE_PERMISSIONS` maps all roles (`admin`, `editor`, `viewer`) to `["/admin/*"]`. Additionally, the role checking code block (`if (!hasAccess && userRole !== "admin")`) is commented out.
- **Defense**: Explain that page-level authorization is handled via server components (e.g., `src/app/admin/users/page.tsx` explicitly checks `session.user.role !== "admin"` and redirects), and data modifications are strictly guarded inside API handlers (e.g., `src/app/api/products/route.ts` blocks `viewer` writes). Acknowledge that enabling path matching in middleware is a planned improvement.

### 2. Absence of True Refresh Token Rotation
- **File**: [`src/lib/auth/config.ts`](file:///c:/Users/Sahil%20Kamble/OneDrive/Desktop/SIGMA3.0_DEV/Projects/ssr-ecommerce-admin-dashboard/src/lib/auth/config.ts#L32-L35)
- **Issue**: NextAuth is configured with static JWT sessions (`maxAge: 30 days`). There is no custom OAuth refresh token rotation logic or server-side token revocation list.
- **Defense**: Clarify that standard NextAuth JWT encryption handles session state cleanly for current scale. If an interviewer asks about token theft, explain that user account status (`isActive`) is queried on sensitive operations to invalidate revoked accounts instantly.

### 3. Lack of Atomic Transactions for S3 + Database Deletes
- **File**: [`src/app/api/products/[id]/route.ts`](file:///c:/Users/Sahil%20Kamble/OneDrive/Desktop/SIGMA3.0_DEV/Projects/ssr-ecommerce-admin-dashboard/src/app/api/products/%5Bid%5D/route.ts#L98-L110)
- **Issue**: `DELETE` route deletes the MongoDB document first. If `s3.send(DeleteObjectsCommand)` fails due to network issues, the S3 images remain orphaned.
- **Defense**: Acknowledge that distributed operations across external storage (S3) and databases (MongoDB) cannot share a native two-phase commit without Saga patterns or background cleanup queues.

### 4. Low-Stock "Predictions" vs. Static Threshold Filter
- **File**: [`src/app/api/metrics/overview/route.ts`](file:///c:/Users/Sahil%20Kamble/OneDrive/Desktop/SIGMA3.0_DEV/Projects/ssr-ecommerce-admin-dashboard/src/app/api/metrics/overview/route.ts#L13)
- **Issue**: Low stock metrics are derived using a static Mongoose filter (`stock: { $lte: 5 }`), rather than an ML-based predictive algorithm.
- **Defense**: State clearly that "low stock alert" is defined as a fixed operational threshold ($\le 5$ units) for immediate inventory replenishment, avoiding unnecessary machine learning complexity for standard catalog sizes.

### 5. OpenRouter Free Tier Dependency
- **File**: [`src/app/api/ai/generate/route.ts`](file:///c:/Users/Sahil%20Kamble/OneDrive/Desktop/SIGMA3.0_DEV/Projects/ssr-ecommerce-admin-dashboard/src/app/api/ai/generate/route.ts#L18-L22)
- **Issue**: The AI generator relies on free-tier OpenRouter models (`:free`), which can experience variable latency or temporary rate limits under load.
- **Defense**: Highlight that the multi-model fallback loop (`Llama 3.2` -> `Gemini 2.0 Flash` -> `Gemma 4`) was designed explicitly to handle free-tier unreliability, ensuring uptime without ongoing API costs.

### 6. Missing Automated Test Suite
- **File**: [`package.json`](file:///c:/Users/Sahil%20Kamble/OneDrive/Desktop/SIGMA3.0_DEV/Projects/ssr-ecommerce-admin-dashboard/package.json)
- **Issue**: `package.json` contains no automated test runner (Jest, Vitest, Playwright) or test scripts.
- **Defense**: Note that schema validations (`zod`) and type safety (`TypeScript`) enforce contracts across compile time, while manual end-to-end testing verified auth and S3 flows. Adding Vitest unit tests for API routes is the immediate technical debt item.
