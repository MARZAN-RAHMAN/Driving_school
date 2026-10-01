# Driving School Project Rules

1. **Do not hard-code business content.**  
   All business details (phone numbers, addresses, pricing, hours, emails, badges) must originate from the database. Never embed static business content in components or templates.

2. **Admin must control public content.**  
   The admin panel serves as the live CMS for all public-facing content. Updating values in the admin panel must automatically reflect across the public website immediately without code changes or redeployments.

3. **Do not break existing functionality.**  
   Any modification must maintain 100% backward compatibility with all previously implemented routes, models, API endpoints, and user flows.

4. **Use TypeScript.**  
   Enforce strict type-checking throughout the entire codebase. All domain models, component props, and API payloads must have formal interfaces in `src/types/index.ts`. Maintain 0 errors on `npx tsc --noEmit`.

5. **Use reusable components.**  
   Consolidate UI components into `src/components/`. Do not duplicate modals, form fields, cards, tables, badges, or buttons across pages. Reuse existing components, layouts, and database services.

6. **Use PostgreSQL + Prisma.**  
   All relational models, migrations, and database access must adhere to Prisma ORM standards and PostgreSQL relational structures (`prisma/schema.prisma` and `src/lib/db.ts`).

7. **Validate all server input.**  
   Never trust client input. Every API route must sanitize, parse, and validate request bodies, query parameters, headers, and mutation payloads before executing database operations.

8. **Protect admin routes.**  
   All `/admin` pages and `/api/admin/*` endpoints must enforce authentication, role checks (e.g. `ADMIN`), valid session tokens, and redirect unauthorized requests to `/login`.

9. **Follow SEO best practices.**  
   Use semantic HTML5 tags, dynamic metadata via Next.js `generateMetadata()`, canonical URLs, dynamic XML sitemaps, robots.txt, OpenGraph tags, Twitter Cards, and schema markup.

10. **Mobile-first design.**  
    Every view must be responsive and optimized for mobile screens first (tap targets $\ge 48\text{px}$, sticky mobile call button, mobile drawer navigation, responsive typography, and adaptive layouts).

11. **Accessibility must be considered.**  
    Meet WCAG 2.1 AA standards: high color contrast, visible focus outlines, semantic landmark tags (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`), `aria-label` attributes on icon-only buttons, and full keyboard navigation.

12. **Never create fake reviews.**  
    Testimonials and student pass stories must reflect authentic, verifiable pass records (verified pass flag, real test center attribution, instructor pairing, and DVSA fault counts). Never inject deceptive fake reviews or artificially manufactured ratings.

13. **Never expose private customer information.**  
    Protect learner privacy. Student emails, personal phone numbers, home pickup addresses, notes, and payment histories must never be exposed through public APIs or client bundles. Public endpoints must only expose safe, curated, or anonymized review data.

14. **Test every feature before moving forward.**  
    Each phase, endpoint, and feature must be rigorously tested with end-to-end assertions, unit checks, lint verification (`npm run lint`), and production build verification (`npm run build`) before moving forward.

15. **Do not rewrite the entire project to fix a small issue.**  
    Always diagnose the exact root cause and apply surgical, targeted fixes. Never reset, delete, or rewrite unrelated files or architectural layers to solve localized bugs.

---

## Dynamic CMS & Database Reactivity Specification

> **Cardinal Rule**: The Admin Panel is the CMS for the entire website. Whenever possible, public-facing business content must come from the database rather than hard-coded values.

When an administrator updates a value in the admin panel, all corresponding public website touchpoints must update automatically and dynamically without manual code changes or redeployments.

### Propagation Pipeline Example:
```
Admin updates Business Phone
            │
            ▼
    Database Record
            │
            ├─────────────────────────────┬─────────────────────────────┬─────────────────────────────┐
            ▼                             ▼                             ▼                             ▼
      Website Header                Contact Page                 Website Footer              Mobile Call Button
 (Desktop Hotline & Link)        (Direct Office Card)         (Footer Contact Block)        (Sticky Tap-to-Call)
```

### Dynamic Entities Requiring Database/CMS Binding:
1. **Logo & Branding**: Logo image URL, logo badge tag (`Academy`), business name, trading name, and taglines.
2. **Business Name & Company Info**: Registered company name, registration number, DVSA school ID, head office address.
3. **Hero Content**: Trust badge pill, practical pass rate badge, hero headline, hero subhead, primary CTA text/link, secondary CTA text/link, hero media.
4. **Services & Tuition Packages**: Course titles, descriptions, hourly duration, pricing, skill levels, feature lists, and badges (`Most Popular`).
5. **Pricing & Hourly Rates**: Manual hourly rate, automatic hourly rate, test day car hire fee, weekend surcharges, and derived assessment pricing.
6. **Instructors & Fleet**: Instructor profiles, DVSA ADI badge numbers, avatars, vehicle models, transmission types, pass statistics, and ratings.
7. **Locations & Coverage**: Service areas, covered postcodes, and affiliated DVSA Driving Test Centers (DTCs).
8. **Reviews & Testimonials**: Verified student passes, test center results, minor fault counts, quotes, ratings, and featured status.
9. **Frequently Asked Questions (FAQs)**: Question, answer, categories, and display ordering.
10. **Blog & Educational Resources**: Articles, category tagging, publish states, and DVSA learning roadmaps.
11. **Media Library**: Dynamic image storage, hero banners, car fleet photos, and student pass photos.
12. **Navigation & Menus**: Header navigation items, footer navigation links, quick action buttons.
13. **Social Media Links**: Facebook, Instagram, TikTok, YouTube, X / Twitter URLs.
14. **SEO & Metadata**: Dynamic `<title>`, meta description, meta keywords, OpenGraph tags, and social cards generated dynamically via `generateMetadata()`.
15. **Footer**: Contact details, opening hours, legal entity identifiers, dynamic course and location links, and copyright notices.

---

## Visual Design System Principles

Design decisions must adhere strictly to these visual aesthetics:
- **Minimalist**: Uncluttered layouts, deliberate typography, and high information clarity.
- **Premium**: Subtle borders (`border-slate-100`, `border-slate-200/80`), refined micro-interactions, soft badges, and elegant typography hierarchy.
- **Clean**: Crisp contrast, generous line-heights, restrained color accents (slate, neutral darks, emerald trust indicators, and subtle indigo accents).
- **Spacious**: Ample whitespace between sections (`py-24 lg:py-32`), breathable container paddings, and uncluttered component grids.
- **Modern**: Rounded cards (`rounded-2xl`), accessible focus rings, responsive drawer navigation, and clean SVGs.
- **Professional**: Official DVSA accreditation markers, verified pass rate indicators, dual-control safety certifications, and authentic student reviews.

---

## Development Phases (21-Phase Roadmap)

```
01  Architecture
        ↓
02  Database (Prisma + PostgreSQL)
        ↓
03  Authentication (Admin + Session Roles)
        ↓
04  Admin Dashboard
        ↓
05  Business Settings
        ↓
06  Homepage CMS
        ↓
07  Lessons + Pricing
        ↓
08  Instructors
        ↓
09  Locations
        ↓
10  Booking System
        ↓
11  Customers
        ↓
12  Reviews
        ↓
13  FAQ
        ↓
14  Blog
        ↓
15  SEO CMS
        ↓
16  Media Library
        ↓
17  Page Builder
        ↓
18  Public Website
        ↓
19  Mobile Optimisation
        ↓
20  SEO + Performance
        ↓
21  Security + Production
```
