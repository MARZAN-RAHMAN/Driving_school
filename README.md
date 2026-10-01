# NextDrive — Driving School Platform

NextDrive is a comprehensive driving school platform built with Next.js 16 (App Router), React 19, Tailwind CSS, and Prisma. It features three dedicated dashboards for Admins, Instructors, and Students, alongside a high-converting lead booking modal, role-based authentication, and operational management tools.

## 🚀 Key Features

- **Public Marketing Website**: Responsive, modern, accessible design with dynamic courses, instructors, reviews, and interactive booking CTAs.
- **Three-Tier Role-Based Dashboards**:
  - **Admin Dashboard**: Comprehensive CMS, student management, instructor roster, lesson dispatch, lead pipeline, revenue metrics, Excel export, and audit logging.
  - **Instructor Dashboard**: Weekly schedule view, lesson confirmation, student progress tracking, and availability management.
  - **Student Dashboard**: Upcoming lessons, progress milestones, instructor messaging, and booking requests.
- **Lead Generation Modal**: Streamlined, multi-step booking modal with instant postal code lookup, course selection, and backend lead conversion.
- **Secure Authentication**: HMAC-SHA256 edge-compatible session tokens, scrypt password hashing, and strict server-side middleware protection.
- **Adaptive Theming**: Full Light Mode and Dark Mode support with semantic design tokens.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.3.7 (App Router with webpack)
- **UI Library**: React 19.2.8 & Tailwind CSS v4
- **Icons**: Lucide React
- **ORM / Database**: Prisma 6.4.1 (PostgreSQL / Supabase / Neon) with in-memory relational store fallback
- **Authentication**: Custom HMAC-signed edge session cookies with role verification

---

## 📦 Getting Started

### 1. Prerequisites

- **Node.js**: `v20.x` or `v22.x` (or `v24.x`)
- **Package Manager**: `npm`

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd NextDrive
npm install
```

### 3. Environment Configuration

Copy the example environment configuration:

```bash
cp .env.example .env
```

Fill in your configuration variables in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nextdrive?schema=public"
NODE_ENV="development"
PORT=3000
SESSION_SECRET="your-secure-random-64-character-secret"
AUTH_SECRET="your-secure-random-64-character-secret"

# Optional Stripe Integration
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
```

### 4. Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

*(Optional) Push schema changes to your PostgreSQL database:*

```bash
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build

To test the production build locally:

```bash
npm run build
npm run start
```

---

## 🌐 Netlify Deployment Guide

This project is configured for continuous deployment with Netlify via `netlify.toml`.

### Step 1: Push Code to GitHub

1. Create a new repository on [GitHub](https://github.com/new).
2. Connect your local repository and push:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect to Netlify

1. Log into your [Netlify Dashboard](https://app.netlify.com).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Select **GitHub** and authorize access to your repository.
4. Select your NextDrive repository.

### Step 3: Configure Build Settings

The build settings are automatically discovered from `netlify.toml`:
- **Build command**: `npx prisma generate && npm run build`
- **Publish directory**: `.next`
- **Node version**: `20`

### Step 4: Configure Environment Variables in Netlify

In your Netlify site settings (**Site configuration** > **Environment variables**), add:
- `SESSION_SECRET`: A secure random 64-character string
- `AUTH_SECRET`: A secure random 64-character string
- `DATABASE_URL`: Your production PostgreSQL connection string (Supabase, Neon, AWS RDS, etc.)
- `NODE_ENV`: `production`

### Step 5: Deploy

Click **"Deploy site"**. Netlify will build and deploy the NextDrive platform.

---

## 🔒 Security Best Practices

- Never commit `.env` or sensitive credentials to Git.
- Always use strong, randomly generated secrets for `SESSION_SECRET` and `AUTH_SECRET` in production.
- Keep dependency packages updated.
