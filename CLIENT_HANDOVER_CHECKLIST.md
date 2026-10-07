# NextDrive Driving School Platform
## Client Handover & Launch Readiness Checklist

**Project Name:** NextDrive Driving School Platform  
**Target Market:** Greater Manchester, United Kingdom  
**Platform Version:** 1.0.0 (Production Candidate)  
**Date of Handover:** October 2026  

---

### Instructions for Client / Webmaster
This checklist provides a structured guide for transitioning the NextDrive platform from staging to live production. Please check off each item during your deployment and onboarding process.

---

### Section 1: Domain & DNS Configuration
- [ ] **Custom Domain Purchased**: Ensure ownership of `nextdrive.uk` (or client primary domain).
- [ ] **DNS Records Configured**:
  - `A` Record pointing `@` to host IP / Netlify load balancer (`75.2.60.5` or platform equivalent).
  - `CNAME` Record pointing `www` to `nextdrive.uk` or platform domain alias.
- [ ] **Apex / WWW Redirect**: Confirm automatic 301 redirect between `http://` to `https://` and `www` to non-`www` (or vice-versa).
- [ ] **SSL / TLS Certificate**: Verify automated Let's Encrypt or custom SSL provisioning with active HTTPS enforcement and HSTS.
- [ ] **TTL Setting**: Lower DNS TTL to 300 seconds prior to final cutover, then restore to 3600 seconds post-launch.

---

### Section 2: Hosting & Deployment Environment
- [ ] **Production Host Selected**: Netlify, Vercel, Railway, AWS, or custom Linux VPS.
- [ ] **Node.js Runtime**: Set Node version to `v20.x` or `v22.x` LTS in deployment settings.
- [ ] **Build Command Verified**:
  ```bash
  npx prisma generate && npm run build
  ```
- [ ] **Publish Directory**: Verified as `.next` (or default for host Next.js adapter).
- [ ] **Continuous Deployment**: Verified Git webhook triggers production builds only on `main` branch merges.
- [ ] **Deploy Previews**: Confirmed preview builds are enabled for Pull Requests with `X-Robots-Tag: noindex`.

---

### Section 3: Database & Persistence
- [ ] **Production PostgreSQL Database Provisioned**: Supabase, Neon, AWS RDS, or managed PostgreSQL instance.
- [ ] **Connection Pooling**: Set up connection pooling (`pgbouncer` or host pooler) with `?pgbouncer=true&connection_limit=20`.
- [ ] **Database Migration Execution**:
  ```bash
  npx prisma db push
  ```
  *(Confirmed: do NOT run `prisma migrate reset` in production!)*
- [ ] **Automated Backups Enabled**: Configure daily point-in-time recovery (PITR) and 30-day snapshot retention.
- [ ] **Disaster Recovery Tested**: Verified ability to restore snapshot to isolated staging instance.

---

### Section 4: Production Secrets & Environment Variables
- [ ] `NODE_ENV`: Set strictly to `production`.
- [ ] `SESSION_SECRET`: Generated unique 64-character cryptographic string (e.g., via `openssl rand -hex 32`).
- [ ] `AUTH_SECRET`: Generated unique 64-character cryptographic string.
- [ ] `DATABASE_URL`: Production PostgreSQL connection string securely stored in hosting secrets.
- [ ] `NEXT_PUBLIC_ALLOW_DEMO`: Set strictly to `false` (or omitted) to ensure demo logins and test credentials cannot be viewed or used on live site.
- [ ] `NEXT_PUBLIC_SITE_URL`: Set to canonical URL (e.g. `https://nextdrive.uk`).

---

### Section 5: Admin Access & Security Protocols
- [ ] **Default Admin Credentials Changed**:
  - Log in to `/admin` using initial credentials.
  - Navigate to `/admin/profile` or `/admin/users`.
  - Update Admin email and set a strong 16+ character passphrase.
- [ ] **Instructor & Staff Accounts**:
  - Send password setup invitations to real DVSA-certified instructors.
  - Revoke or disable test instructor accounts in `/admin/instructors`.
- [ ] **Role-Based Access Control (RBAC)**:
  - Verified non-admin users cannot access `/admin/*` routes.
  - Verified unauthenticated visitors are redirected to `/login` with `callbackUrl`.
- [ ] **Audit Logging Active**: Confirmed system operations, user logins, and booking changes are recorded in `/admin/logs`.

---

### Section 6: Payment Gateway (Stripe) Integration
- [ ] **Stripe Account Activated**: Complete business verification on [stripe.com](https://stripe.com).
- [ ] **Production API Keys Configured**:
  - `STRIPE_SECRET_KEY`: Set to live key starting with `sk_live_...`.
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Set to live key starting with `pk_live_...`.
- [ ] **Webhook Endpoint Registered**:
  - Webhook URL: `https://nextdrive.uk/api/stripe/webhook` (or client webhook route).
  - Selected Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`.
  - `STRIPE_WEBHOOK_SECRET`: Populated with `whsec_...` from Stripe Dashboard.
- [ ] **Currency Verified**: Confirmed currency is set to British Pounds (`GBP` / `£`).
- [ ] **Test Transaction Completed**: Run a live 50p or £1.00 test transaction and verify refund flow.

---

### Section 7: Google Maps & Geocoding API
- [ ] **Google Cloud Project Created**: Dedicated GCP project named `nextdrive-production`.
- [ ] **APIs Enabled**:
  - Maps JavaScript API
  - Geocoding API
  - Places API (New)
- [ ] **API Key Created & Restricted**:
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` restricted to HTTP referrers:
    - `https://nextdrive.uk/*`
    - `https://www.nextdrive.uk/*`
- [ ] **Billing Alerts**: Set budget alert at £25.00/month to prevent runaway API costs.

---

### Section 8: Social Authentication (OAuth 2.0)
- [ ] **Google OAuth Client ID Configured**:
  - Authorized JavaScript origins: `https://nextdrive.uk`
  - Authorized redirect URIs: `https://nextdrive.uk/api/auth/callback/google`
  - Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in environment variables.
- [ ] **Apple Sign-In (Optional)**: If enabled, configure Services ID and private key in Apple Developer portal.

---

### Section 9: SEO & Search Console Setup
- [ ] **Google Search Console**: Verify property `https://nextdrive.uk` via DNS TXT record.
- [ ] **Sitemap Submitted**: Submit `https://nextdrive.uk/sitemap.xml` in Search Console.
- [ ] **Robots.txt Checked**: Verify `https://nextdrive.uk/robots.txt` permits Googlebot while disallowing `/admin/`, `/student/`, `/instructor/`, and `/api/`.
- [ ] **Google Business Profile (GBP)**:
  - Claim or update Google Business Profile as "NextDrive Driving Academy Manchester".
  - Ensure exact NAP alignment:
    - **Name**: NextDrive Driving Academy
    - **Address**: Peter House, Oxford Street, Manchester, M1 5AN
    - **Phone**: 0161 820 4930
  - Select primary category: "Driving school".
- [ ] **Local Citations**: Submit consistent NAP to Bing Places, Yell, Thomson Local, Scoot, and Apple Maps.

---

### Section 10: Legal, Privacy & GDPR Compliance
- [ ] **Company Details Verified**:
  - Registered company name, number, and VAT registration (if applicable) updated in `/terms` and footer.
- [ ] **Privacy Policy Updated**:
  - Contact email for data requests: `privacy@nextdrive.uk`.
  - Third-party processors listed: Stripe, Netlify, Google Analytics, Resend/SendGrid.
- [ ] **Cookie Banner Active**: Verified cookie acceptance banner captures consent prior to initializing tracking pixels.
- [ ] **Terms & Conditions**: Confirmed cancellation policy (minimum 48 hours notice for lesson cancellation) and DVSA practical test terms.

---

### Handover Sign-Off
| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Lead Developer** | Antigravity AI Engineering | *Verified & Tested* | October 7, 2026 |
| **Client / Owner** | NextDrive Academy Director | _________________ | ____________ |
