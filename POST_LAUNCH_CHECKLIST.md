# NextDrive Driving School Platform
## Post-Launch Operations & Monitoring Checklist

This document details the essential post-launch monitoring, sanity checks, and recurring maintenance tasks required to ensure high availability, fast performance, search engine indexing, and booking conversion.

---

### Phase 1: Immediate Launch Verification (T + 1 Hour)
- [ ] **DNS Resolution**: Confirm global DNS propagation via `whatsmydns.net` across all major global resolvers.
- [ ] **HTTPS Certificate**: Verify TLS 1.3 certificate status with an A+ rating on `ssllabs.com`.
- [ ] **Robots.txt & Sitemap Ping**:
  - Visit `https://nextdrive.uk/robots.txt` — confirm public crawler rules are functioning.
  - Visit `https://nextdrive.uk/sitemap.xml` — confirm all 25+ canonical URLs are listed.
- [ ] **End-to-End Booking Test**:
  - Open an incognito browser window.
  - Submit an assessment booking via `/driving-lessons` or homepage modal.
  - Verify entry arrives instantly in `/admin/enquiries` and `/admin/leads`.
  - Verify confirmation toast and lead status update.
- [ ] **Authentication Smoke Test**:
  - Log in to Admin portal (`/admin`).
  - Log in to Instructor portal (`/instructor`).
  - Log in to Student portal (`/student`).
  - Confirm role protection redirects unauthenticated requests.
- [ ] **Error Log Inspection**: Check hosting runtime logs (Netlify Function Logs, VPS log files) for unhandled exceptions or 500 status codes.

---

### Phase 2: First 24 Hours Sanity Checks (T + 24 Hours)
- [ ] **Uptime & Latency Monitoring**:
  - Configure uptime monitoring via UptimeRobot, BetterStack, or Pingdom with 60-second ping interval to `https://nextdrive.uk/api/health`.
  - Confirm average Time To First Byte (TTFB) is below 300ms across UK test nodes.
- [ ] **Google Search Console Initial Crawl**:
  - Request indexing on the homepage (`/`) and primary course landing pages.
  - Check Coverage report for any "Blocked by robots.txt" or "404 Not Found" warnings.
- [ ] **Lead Notification Delivery**:
  - Verify admin notification badge counts increment on incoming inquiries.
  - Confirm notification sounds or email alerts trigger properly.
- [ ] **Database Connection Health**:
  - Inspect PostgreSQL connection pool statistics to verify no leaked open connections.
  - Verify transaction latency remains under 50ms.

---

### Phase 3: First Week Operational Review (T + 7 Days)
- [ ] **Search Console Performance Review**:
  - Check indexing status of location pages (`/locations/didsbury`, `/locations/salford`, etc.).
  - Check test centre pages (`/test-centres/cheetham-hill`, `/test-centres/west-didsbury`, etc.).
  - Verify impressions for search terms like "driving lessons manchester", "intensive driving courses manchester".
- [ ] **Core Web Vitals Assessment**:
  - Run PageSpeed Insights on mobile and desktop.
  - Confirm Largest Contentful Paint (LCP) < 2.5s, First Input Delay / INP < 200ms, Cumulative Layout Shift (CLS) < 0.1.
- [ ] **Database Backup Verification**:
  - Verify automated daily database snapshots are running on schedule.
  - Perform test download of one snapshot file to verify data integrity.
- [ ] **Form Conversion Funnel Analysis**:
  - Review conversion rates in `/admin/popup/analytics` and `/admin/leads`.
  - Identify and fix any drop-offs in the multi-step booking modal.

---

### Phase 4: Ongoing Monthly Maintenance Cadence
- [ ] **Security Audits & Dependency Updates**:
  ```bash
  npm audit
  npm outdated
  ```
  - Apply minor and patch security updates for npm packages.
  - Re-run `npx tsc --noEmit` and `npm run build` prior to merging updates.
- [ ] **SEO Content Refresh**:
  - Use `/admin/seo` to review page CTRs, keyword rankings, and meta description performance.
  - Add 2–4 local driving tips or route guides to `/admin/blog` to maintain organic search freshness.
- [ ] **Instructor Availability Maintenance**:
  - Audit active instructors and update working hours in `/admin/instructors`.
  - Ensure booking slots reflect accurate calendar availability.
- [ ] **Customer Review Management**:
  - Collect verified pass stories and photos from students who passed their test.
  - Publish reviews through `/admin/reviews` with verified badges.

---

### Emergency Incident Response Procedure
1. **Downtime / Server 500 Errors**:
   - Check hosting status dashboard (e.g. Netlify Status / Vercel Status / AWS Health).
   - Check application health route at `/api/health`.
   - Inspect recent deployment commits; trigger instant rollback in hosting panel if necessary.
2. **Database Connectivity Outage**:
   - Inspect PostgreSQL connection metrics and pooler limits.
   - Verify environment variable `DATABASE_URL` has not expired or reset.
3. **Contact Escalation**:
   - Technical Support: `support@nextdrive.uk`
   - Platform Maintenance Hotline: Available in client contract agreement.
