# OneWorld Van Lines — Full Platform

## Overview

Production-grade moving company platform for OneWorld Van Lines, Carrollton, TX 75006, phone (660) 667-7770, domain oneworldvanlines.net. Includes a public marketing website, CRM, worker portal, admin dashboard, moving calculator, blog/FAQ engine, and role-based auth.

## Recent Major Updates
- **Hero**: Truck photo (`/public/hero-truck.jpg`) as hero background with glassmorphism quote card (`bg-white/92 backdrop-blur-lg`)
- **Calculator**: 2026 pricing overhaul — bedroom cuft presets updated (Studio=350, 1BR=500, 2BR=750, 3BR=1200, 4BR=1500, 5+BR=1700). Local/mid-range: hourly crew pricing ($159–$225/hr, min charges, +10% fuel surcharge). Long distance: cu ft × band rate ($4–$9/cu ft by mileage band) + 15% fuel surcharge. Add-ons: packing $0.15–$0.21/lb, stairs $75/flight dropdown, peak season +20%. New `LONG_DIST_BANDS`, `calcHourly`, `calcLongDist` functions. New `LongDistSummary` component. State: `quickLdBand`, `quickStairs`, `quickPeakSeason`.
- **Email leads**: `artifacts/api-server/src/lib/email.ts` — nodemailer fires on every new lead to Sales@oneworldvanlines.net & j_zaatreh@yahoo.com. Requires env vars: SMTP_HOST, SMTP_USER, SMTP_PASS (optional SMTP_PORT, SMTP_SECURE)
- **Services**: Photos added to all 8 service cards (Unsplash)
- **Nav**: Home link added as first nav item
- **Domain**: oneworldvanlines.net referenced in top bar, footer, index.html canonical/OG
- **SEO**: index.html has full meta description, OG tags, Twitter card, Schema.org MovingCompany JSON-LD
- **FAQs**: 29+ FAQs seeded across Pricing/Moving Day/Packing/Insurance/Areas/Payment/Specialty
- **Blog**: 10 SEO blog posts seeded (DFW guides, city guides, packing tips, long-distance, commercial, pets, storage)
- **Estimates**: Packing changed from flat $450 → $1/cuft of total cubic feet. Studio bedroom preset added (0 BR = 200 cuft)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (wouter, TanStack Query, Clerk, framer-motion, shadcn/ui)
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Auth**: Clerk (`@clerk/react`, `@clerk/express`)
- **Build**: esbuild (CJS bundle)

## Project Structure

```
artifacts/
  oneworld/          # React+Vite frontend (preview path: /)
  api-server/        # Express 5 API server (preview path: /api)
  mockup-sandbox/    # Component preview server (canvas)
lib/
  api-spec/          # OpenAPI spec + codegen config (source of truth)
  api-client-react/  # Generated React Query hooks + Zod schemas
  api-zod/           # Generated Zod schemas only (index.ts: only `export * from "./generated/api"`)
  db/                # Drizzle ORM schema + migrations
scripts/             # Utility scripts
```

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
  - **CRITICAL**: After codegen, overwrite `lib/api-zod/src/index.ts` with ONLY `export * from "./generated/api";`
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Routes

### Public Pages
- `/` — Homepage with lead capture form (→ useCreateLead)
- `/calculator` — Moving cost calculator (→ useCreateEstimate)
- `/services` — Services overview
- `/services/:type` — Individual service pages
- `/about` — About Us
- `/contact` — Contact form (→ useCreateLead)
- `/areas` — Service areas (DFW & Austin cities)
- `/gallery` — Photo gallery
- `/faq` — FAQ with category filter (→ useListFaqs)
- `/blog` — Blog index (→ useListBlogPosts, useListBlogCategories)
- `/blog/:slug` — Individual blog post (→ useGetBlogPost)
- `/payment` — Payment methods
- `/privacy` — Privacy Policy
- `/terms` — Terms & Conditions
- `/legal/cookies` — Cookie Policy

### Auth
- `/sign-in` — Clerk SignIn
- `/sign-up` — Clerk SignUp

### Worker Portal (protected)
- `/worker` — Worker dashboard with job list + status updates

### Admin Dashboard (protected)
- `/admin` — Stats, recent leads, charts
- `/admin/leads` — CRM table with search/filter
- `/admin/leads/:id` — Lead detail with notes, assignment, messaging
- `/admin/workers` — Worker management
- `/admin/jobs` — Jobs list with status updates
- `/admin/blog` — Blog post manager
- `/admin/faqs` — FAQ manager
- `/admin/pricing` — Pricing rules editor

## Database Tables

`leads`, `lead_notes`, `workers`, `jobs`, `estimates`, `blog_posts`, `faqs`, `documents`, `pricing_rules`, `messages`

## Brand

- Primary: Dark Navy `hsl(222 47% 11%)`
- Background: Cream/Beige `hsl(60 20% 98%)`
- Fonts: Playfair Display (serif headings) + DM Sans (body)
- WhatsApp: wa.me/16606677770 (floating button on all public pages)
- Phone: (660) 667-7770

## Auth Notes

- Clerk proxy path: `/api/__clerk`
- Frontend needs `VITE_CLERK_PUBLISHABLE_KEY`
- Backend needs `CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY`
- All signed-in users can access both `/admin` and `/worker` portals

## API Notes

- All hooks from `@workspace/api-client-react`
- Query hooks return data directly (not wrapped in `{ data }`)
- Mutations: `mutate({ data: body }, { onSuccess: (result) => ... })`
- Invalidate after mutations using queryKey helpers
- `queryClient` is exported from `artifacts/oneworld/src/lib/queryClient.ts` (NOT from api-client-react)
