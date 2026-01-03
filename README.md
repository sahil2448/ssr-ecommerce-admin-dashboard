# Server-Rendered E-commerce Admin Dashboard

A production-grade administrative dashboard built with **Next.js 16** featuring server-side rendering for optimal performance and SEO. This application provides a complete solution for managing e-commerce products with advanced features including real-time analytics, role-based access control, and cloud-based image storage.

## Table of Contents

- [Project Overview](#project-overview)
- [Live Application](#live-application)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Workflow](#workflow)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Database Seeding](#database-seeding)

---

## Project Overview

This dashboard serves as the administrative interface for an e-commerce platform. It leverages **server-side rendering** to deliver fast initial page loads and improved search engine visibility. The application handles the full product lifecycle from creation to deletion, with built-in support for:

- Multi-step product creation forms with validation
- Secure image uploads to AWS S3
- AI-powered product description generation
- Real-time analytics and sales tracking
- Role-based access control (Admin, Editor, Viewer)

The architecture follows modern best practices with a clear separation between server and client components, ensuring that sensitive operations remain secure while maintaining a responsive user experience.

---

## Live Application

**Deployed URL:** [https://ssr-ecommerce-admin-dashboard-bfev.vercel.app/](https://ssr-ecommerce-admin-dashboard-bfev.vercel.app/)

### Demo Credentials

| Role   | Email                | Password    | Access Level                         |
| ------ | -------------------- | ----------- | ------------------------------------ |
| Admin  | `admin@example.com`  | `admin123`  | Full access (CRUD + User Management) |
| Editor | `editor@example.com` | `editor123` | Create, Read, Update products        |
| Viewer | `viewer@example.com` | `viewer123` | Read-only access                     |

---

## Key Features

### 1. Authentication & Authorization

The application implements a multi-layered authentication system with three methods:

- **Email/Password** - Traditional credentials-based login
- **GitHub OAuth** - One-click sign-in with GitHub
- **Google OAuth** - One-click sign-in with Google

**Role-Based Access Control (RBAC):**

| Role   | Products       | Analytics | User Management | Delete Products |
| ------ | -------------- | --------- | --------------- | --------------- |
| Admin  | ✅ Full        | ✅ View   | ✅ Full         | ✅ Yes          |
| Editor | ✅ Create/Edit | ✅ View   | ❌ No           | ❌ No           |
| Viewer | 👁️ Read Only   | ✅ View   | ❌ No           | ❌ No           |

- User sessions are managed through **JWT tokens** with a 30-day expiration period
- Middleware-based route protection validates sessions before allowing access
- New OAuth users are automatically assigned the **Viewer** role
- User Management page is **only visible to Admins**

### 2. Product Management (CRUD)

Complete product lifecycle management through an intuitive interface:

- **Multi-step Creation Wizard** - Three-step process:
  1. **Basic Info** - Name, Description, Category, SKU
  2. **Pricing & Stock** - Price, Stock quantity, Active status
  3. **Images** - Upload product images to AWS S3
- **Product Listing** - Paginated table with search and filter capabilities
- **Edit Products** - Update existing products through the same multi-step form
- **Delete Products** - Admin-only deletion with automatic S3 image cleanup
- **Validation** - All inputs validated with **Zod** schemas

### 3. AI-Powered Content Generation

Integrated generative AI to streamline content creation:

- Automatically generates product descriptions based on product name and keywords
- Uses **OpenRouter API** with multiple model fallbacks:
  - Meta LLaMA 3.2
  - Google Gemini 2.0 Flash
  - Microsoft Phi-3 Mini
- Accessible during product creation in the description field
- Generated content can be reviewed and customized before saving

### 4. Analytics & Reporting

Real-time insights through MongoDB aggregation pipelines:

- **Overview Cards:**

  - Total Revenue
  - Total Products
  - Units Sold
  - Low Stock Alerts (≤5 units)
  - Out of Stock Count

- **Visual Charts (Recharts):**

  - Revenue Trend (Area Chart - Last 30 days)
  - Units Sold (Bar Chart - Last 30 days)
  - Top 5 Products by Revenue

- **Server-Side Data Aggregation** - Fresh data on each page load via MongoDB aggregation

### 5. Secure Image Upload

Scalable image handling through AWS S3 integration:

- **Presigned URLs** - Direct browser-to-S3 uploads
- **No Server Bandwidth Overhead** - Files bypass Next.js server completely
- **Automatic Cleanup** - S3 objects deleted when products are removed
- **Multiple Images** - Support for up to 8 images per product

### 6. User Management (Admin Only)

Admins can manage user accounts directly from the dashboard:

- Create new users with specific roles
- Update user roles dynamically
- Delete users from the system
- View authentication method (Email/Password or OAuth)

---

## Tech Stack

| Category            | Technology                                 |
| ------------------- | ------------------------------------------ |
| **Framework**       | Next.js 16 (App Router, Server Components) |
| **Language**        | TypeScript                                 |
| **React**           | React 19                                   |
| **Styling**         | Tailwind CSS 4, Shadcn UI                  |
| **Animation**       | Framer Motion                              |
| **Icons**           | Lucide React                               |
| **Database**        | MongoDB with Mongoose ODM                  |
| **Authentication**  | NextAuth.js v5 (Auth.js)                   |
| **Form Management** | React Hook Form                            |
| **Validation**      | Zod                                        |
| **Data Fetching**   | SWR                                        |
| **File Storage**    | AWS S3 (with presigned URLs)               |
| **Charts**          | Recharts                                   |
| **AI Integration**  | OpenRouter API (LLaMA, Gemini, Phi-3)      |
| **Notifications**   | Sonner (Toast notifications)               |
| **Deployment**      | Vercel                                     |

---

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── analytics/      # Sales charts and metrics
│   │   ├── products/       # Product listing, create, edit
│   │   ├── users/          # User management (admin only)
│   │   ├── unauthorized/   # Access denied page
│   │   ├── layout.tsx      # Admin layout with sidebar
│   │   └── page.tsx        # Dashboard overview
│   ├── api/
│   │   ├── admin/users/    # User CRUD endpoints
│   │   ├── ai/generate/    # AI description generation
│   │   ├── auth/           # NextAuth handlers
│   │   ├── metrics/        # Analytics aggregation
│   │   ├── products/       # Product CRUD endpoints
│   │   └── uploads/        # S3 presigned URL generation
│   ├── auth/
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── admin/              # Sidebar, user management
│   ├── analytics/          # Charts and overview cards
│   ├── auth/               # Auth-related components
│   ├── products/           # Product table, forms, dialogs
│   └── ui/                 # Shadcn UI components
├── lib/
│   ├── auth/               # NextAuth configuration
│   ├── validators/         # Zod schemas
│   ├── db.ts               # MongoDB connection
│   ├── s3.ts               # AWS S3 client
│   ├── s3-upload.ts        # Client-side upload helper
│   └── swr.ts              # SWR configuration
├── models/
│   ├── Order.ts            # Order schema (for analytics)
│   ├── Product.ts          # Product schema
│   └── User.ts             # User schema with bcrypt
├── middleware.ts           # Route protection & RBAC
└── scripts/
    └── seed.ts             # Database seeding script
```

---

## Workflow

```
Admin requests dashboard page
         ↓
Server fetches product data from MongoDB
         ↓
Page is rendered on the server (SSR)
         ↓
HTML sent to browser
         ↓
Admin interacts with product forms and charts
         ↓
Product data is created/updated/deleted via API routes
         ↓
UI refreshes by re-fetching the latest data (SWR)
```

---

## Setup Instructions

### Prerequisites

Before setting up the project, ensure you have:

- Node.js version 18 or higher
- npm or yarn package manager
- MongoDB Atlas account or local MongoDB instance
- AWS account with S3 bucket configured
- GitHub OAuth app credentials (optional)
- Google Cloud Console OAuth credentials (optional)
- OpenRouter API key (optional, for AI features)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sahil2448/ssr-ecommerce-admin-dashboard.git
   cd ssr-ecommerce-admin-dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see below)

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
AUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# OAuth Providers (Optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI API (Optional - for description generation)
OPENROUTER_API_KEY=your-openrouter-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Generate AUTH_SECRET

```bash
openssl rand -base64 32
```

---

## Running the Application

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## Database Seeding

To populate the database with sample products and orders for testing:

```bash
npx tsx scripts/seed.ts
```

This will:

- Create 25 sample products across 6 categories
- Generate 90 days of randomized order data
- Provide realistic analytics data for charts

---

## API Endpoints

### Products

| Method | Endpoint             | Description               | Auth Required |
| ------ | -------------------- | ------------------------- | ------------- |
| GET    | `/api/products`      | List products (paginated) | Yes           |
| POST   | `/api/products`      | Create product            | Admin/Editor  |
| GET    | `/api/products/[id]` | Get product by ID         | Yes           |
| PATCH  | `/api/products/[id]` | Update product            | Admin/Editor  |
| DELETE | `/api/products/[id]` | Delete product            | Admin only    |

### Metrics

| Method | Endpoint                | Description     | Auth Required |
| ------ | ----------------------- | --------------- | ------------- |
| GET    | `/api/metrics/overview` | Dashboard stats | Yes           |
| GET    | `/api/metrics/sales`    | Sales analytics | Yes           |

### Admin

| Method | Endpoint                | Description      | Auth Required |
| ------ | ----------------------- | ---------------- | ------------- |
| GET    | `/api/admin/users`      | List all users   | Admin only    |
| POST   | `/api/admin/users`      | Create user      | Admin only    |
| PATCH  | `/api/admin/users/[id]` | Update user role | Admin only    |
| DELETE | `/api/admin/users/[id]` | Delete user      | Admin only    |

### Uploads

| Method | Endpoint               | Description          | Auth Required |
| ------ | ---------------------- | -------------------- | ------------- |
| POST   | `/api/uploads/presign` | Get S3 presigned URL | Yes           |

### AI

| Method | Endpoint           | Description                  | Auth Required |
| ------ | ------------------ | ---------------------------- | ------------- |
| POST   | `/api/ai/generate` | Generate product description | Yes           |
