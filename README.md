# NextDrive — Enterprise Driving School Platform

NextDrive is a modern, high-performance web platform and operational management suite custom-built for professional driving academies. Specifically engineered for the **Greater Manchester** market, NextDrive unifies client-facing marketing, real-time lead acquisition, lesson scheduling, student progress tracking, and an advanced SEO management control center into a unified full-stack application.

---

## 🌟 Key Platform Capabilities

### 1. High-Converting Public Web Presence
- **Modern Responsive Design**: Mobile-first architecture, light/dark theme toggle with semantic tokens, zero layout shift (CLS < 0.05).
- **Interactive Booking Wizard**: Multi-step lead capture modal featuring live postcode validation, syllabus preference selection, and automated dispatch.
- **Conversion-Optimized Popups**: Exit-intent and timed promotional popups managed directly via admin dashboard with impression and conversion analytics.
- **Local Service & Test Centre Architecture**: Dedicated landing pages for Manchester hubs (Didsbury, Salford, Stockport, Cheetham Hill, West Didsbury, etc.) with DVSA test centre insights.

### 2. Triple-Tier Role-Based Dashboards
- **👑 Admin Operations Hub (`/admin`)**:
  - Live revenue analytics, student enrollment metrics, and lesson completion rates.
  - Comprehensive Lead & Enquiry Pipeline with instant notification badge updates.
  - Driving Instructor & Fleet Roster management with DVSA grade tracking.
  - Dynamic CMS for courses, reviews, FAQs, blog articles, and footer configuration.
  - Built-in Database Manager with CSV/Excel export and security audit logs.
  - **SEO Control Center**: Page-by-page metadata editor, canonical tags, automated XML sitemap, robots.txt management, Manchester keyword rank tracking, and technical SEO health auditor.
- **🚗 Instructor Portal (`/instructor`)**:
  - Dedicated weekly calendar and lesson agenda.
  - 1-click lesson status updates (Confirmed, In Progress, Completed, No Show).
  - Private tuition notes and student competency feedback reporting.
  - Working hours and availability selector.
- **🎓 Student Portal (`/student`)**:
  - Upcoming lesson countdown and booking history.
  - Practical test syllabus tracker and competency milestones.
  - Direct communication link with assigned DVSA-certified instructor.
  - Fast lesson request modal with preferred time windows and pickup addresses.

### 3. Enterprise-Grade Security & Edge Middleware
- **Edge-Compatible Proxy**: Next.js 16 Edge proxy (`src/proxy.ts`) verifying HMAC-SHA256 signed session cookies before requests hit server components.
- **Private Route Search Shielding**: Automated injection of `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` headers on all private dashboard and API routes.
- **Cryptographic Security**: Passwords hashed using standard `scrypt` with cryptographic salts; zero plain-text storage.
- **Production-Gated Demo Mode**: Test credentials and demo quick-login accordions automatically deactivate in production (`process.env.NODE_ENV === "production"`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16.3.7 (App Router with webpack) |
| **Runtime & Language** | Node.js v20+ / v22+ LTS, TypeScript 5.x |
| **UI & Styling** | React 19.2.8, Tailwind CSS v4, Lucide React Icons |
| **ORM & Database** | Prisma 6.4.1, PostgreSQL (Supabase / Neon / AWS RDS) with in-memory fallback |
| **Authentication** | Custom HMAC-SHA256 edge session tokens with role-based cookies |
| **Payments & Maps** | Stripe Connect / Payment Intents, Google Maps Platform JavaScript API |
| **Deployment** | Netlify, Vercel, Docker, or Linux VPS |

---

## 📁 Repository Directory Structure

```text
NextDrive/
├── prisma/
│   └── schema.prisma            # Prisma database models and relations
├── public/                      # Static assets, logos, favicon, SVGs
├── src/
│   ├── app/                     # Next.js App Router routes & API endpoints
│   │   ├── (public pages)       # /, /driving-lessons, /pricing, /locations, etc.
│   │   ├── admin/               # Admin dashboard views & controllers
│   │   ├── instructor/          # Instructor portal views
│   │   ├── student/             # Student learner portal views
│   │   ├── api/                 # Secure REST API route handlers
│   │   ├── layout.tsx           # Global root layout with theme provider
│   │   ├── sitemap.ts           # Dynamic XML sitemap generator
│   │   └── robots.ts            # Dynamic robots.txt crawler directives
│   ├── components/              # Modular UI components
│   │   ├── admin/               # Admin dashboard modules (SEO, CMS, Bookings)
│   │   ├── booking/             # Lead booking modal & popups
│   │   ├── home/                # Homepage sections & interactive maps
│   │   ├── instructor/          # Instructor dashboard client views
│   │   ├── student/             # Student dashboard client views
│   │   └── ui/                  # Reusable UI atoms (Buttons, Modals, Avatars)
│   ├── lib/                     # Core business logic & database service
│   │   ├── db.ts                # Database service layer & data adapters
│   │   ├── auth.ts              # Session creation, verification & cookies
│   │   └── seo-metadata.ts      # Canonical URL & JSON-LD schema builder
│   ├── types/                   # TypeScript interfaces and data contracts
│   └── proxy.ts                 # Next.js 16 edge security & RBAC proxy
├── CLIENT_HANDOVER_CHECKLIST.md # Step-by-step client onboarding guide
├── POST_LAUNCH_CHECKLIST.md     # Day 1, week 1, and monthly monitoring runbook
├── netlify.toml                 # Netlify automated build & deploy configuration
├── next.config.ts               # Next.js engine configuration
├── package.json                 # Dependency manifest
└── tsconfig.json                # TypeScript compiler configuration
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x` LTS
- **Package Manager**: `npm` (v10+)
- **Git**: Installed and configured

### 2. Clone and Install
```bash
git clone https://github.com/<your-repo>/nextdrive.git
cd nextdrive
npm install
```

### 3. Environment Variables
Create a local `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Ensure the minimum required keys are populated:
```env
PORT=3000
NODE_ENV="development"
SESSION_SECRET="replace-with-a-random-64-character-string"
AUTH_SECRET="replace-with-a-random-64-character-string"
DATABASE_URL="postgresql://user:password@localhost:5432/nextdrive?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_ALLOW_DEMO="true"
```

### 4. Database Setup
Generate the Prisma ORM client:
```bash
npx prisma generate
```
*(Optional) If using a live PostgreSQL database:*
```bash
npx prisma db push
```
> ⚠️ **CRITICAL DATABASE SAFETY RULE:**  
> Never run `prisma migrate reset`, `prisma db push --force-reset`, or destructive SQL against a production database.

### 5. Launch Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🚢 Production Deployment

### Option A: Netlify (Recommended)
1. Push your repository to GitHub.
2. Link the repository in Netlify Dashboard.
3. The `netlify.toml` file will automatically supply:
   - **Build Command**: `npx prisma generate && npm run build`
   - **Publish Directory**: `.next`
   - **Node Version**: `20`
4. In Netlify Site Settings > **Environment Variables**, define:
   - `NODE_ENV`: `production`
   - `SESSION_SECRET`: Generated 64-character secret
   - `AUTH_SECRET`: Generated 64-character secret
   - `DATABASE_URL`: Production PostgreSQL URL
   - `NEXT_PUBLIC_ALLOW_DEMO`: `false`
   - `NEXT_PUBLIC_SITE_URL`: `https://nextdrive.uk`

### Option B: Docker / Node VPS
```bash
# Build the production bundle
npm run build

# Start the optimized Node server
NODE_ENV=production npm start
```

---

## 🔒 Security & Compliance Best Practices

1. **Production Secret Generation**:  
   Generate cryptographically secure strings for production secrets:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. **Demo Access Isolation**:  
   Ensure `NEXT_PUBLIC_ALLOW_DEMO` is set to `"false"` in production. This permanently disables the demo credentials accordion on the `/login` screen.
3. **Admin Password Update**:  
   Upon initial deployment, immediately log in to the admin account and change the default administrative password in `/admin/profile`.

---

## 📄 Client Deliverables & Documentation

- [Client Handover Checklist](file:///Users/marzan/Documents/Antigravity_Work/CLIENT_HANDOVER_CHECKLIST.md) — Pre-launch DNS, payment, maps, and admin setup steps.
- [Post-Launch Runbook](file:///Users/marzan/Documents/Antigravity_Work/POST_LAUNCH_CHECKLIST.md) — First 24-hour, 7-day, and ongoing monthly maintenance protocol.

---

## ⚖️ License
Proprietary & Confidential. All rights reserved by NextDrive Driving Academy.
