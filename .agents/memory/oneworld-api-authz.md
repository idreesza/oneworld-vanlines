---
name: OneWorld API authorization model
description: Server-side auth posture of the OneWorld Van Lines API and why business endpoints are open
---

# OneWorld API authorization

The Express API (`artifacts/api-server`) mounts `clerkMiddleware` (populates the
signed-in user) but **no route calls `requireAuth` or role checks**. Admin/worker
business endpoints (`/api/leads`, `/api/workers`, `/api/jobs`, `/api/pricing/rules`,
blog/faq writes) are therefore reachable without login. Access is gated only by
Clerk route guards in the React frontend.

**Why:** This is the original exported app's design, not a regression. When migrating,
the user was explicitly offered server-side lockdown vs. publish-as-is and chose
publish-as-is to match the original site.

**How to apply:** Do not treat the missing server-side authz as a bug to silently
fix. If hardening is requested later, add `requireAuth()` + role gating to admin/worker
route groups while keeping genuinely public endpoints open: health, public lead
submission (contact form), public estimate (calculator), and public FAQ/blog reads.
