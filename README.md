# Veyoyee

An incentivized survey platform where survey creators pay respondents in a reputation-points economy.

**Live demo:** https://veyoyee.vercel.app

## Overview
Veyoyee connects survey creators ("surveyors") with respondents ("surveyees") for academic and research-style surveys, with a built-in incentive layer instead of plain link-sharing. Respondents earn or lose reputation points based on whether their answers are accepted or rejected, which feeds a public leaderboard and tiered reputation badges. Surveyors get a survey builder with multiple question types, a marketplace to publish surveys, and results/analysis tooling; admins get moderation, verification, and marketplace oversight tools.

## Tech Stack
- **Framework:** Next.js 15 (App Router, Turbopack dev server), React 19, TypeScript
- **Styling:** Tailwind CSS 4, Radix UI primitives, class-variance-authority, next-themes (dark/light mode)
- **State:** Zustand
- **Forms/validation:** react-hook-form + @hookform/resolvers + Zod
- **Backend/DB:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`), with app data under a dedicated `veyoyee.users` schema/table
- **Export:** jsPDF + html2canvas-pro (PDF/image export of results)
- **Testing:** Jest + React Testing Library, with auth-flow tests under `src/__tests__/auth`

## Features
- Auth: sign-in and sign-up flows (`src/app/auth/signin`, `src/app/auth/signup`), route protection via `src/middleware.ts`
- Surveyor tools: survey creation/builder, editing, results and statistical analysis (`src/app/surveyor`, `src/app/surveyor/edit/[id]`, `src/app/surveyor/results/[id]`, `src/app/surveyor/analysis/[id]`)
- Surveyee flow: taking a survey (`src/app/surveyee/[id]`)
- Marketplace to browse/list surveys (`src/app/marketplace`, `src/app/marketplace/list`), plus a general explore page (`src/app/explore`)
- Reputation system: a `veyoyee.users` table tracks `total_reputation`, `surveys_completed`, `surveys_created`, and accepted/rejected response counts, updated automatically via database triggers. Accepted responses award +5 reputation, rejected responses -5 (reputation can go negative). Users are grouped into tiers — Probation (<0), Novice (0-4), Beginner (5-19), Intermediate (20-49), Advanced (50-99), Expert (100+, displayed as "100+") — shown as badges and on a public leaderboard (`src/app/leaderboard`)
- Dashboard for tracking a user's own surveys and responses (`src/app/dashboard`)
- Pricing page (`src/app/pricing`)
- Admin panel: analytics, marketplace oversight, moderation, role management, and verification (`src/app/admin/*`)
- Profile management and a claim flow (`src/app/profile`, `src/app/claim`)
- Legal pages: privacy policy, terms of service, security policy

## Getting Started
```bash
npm install
cp .env.example .env.local   # no .env.example is committed — see Supabase docs for the required keys below
npm run dev
```

The build runs `scripts/verify-env.js` first (also runnable standalone via `npm run verify-env`) to check required environment variables are present before building.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |

## Scripts
| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server (Turbopack) |
| `npm run build` | Verify required env vars, then production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint (via `next lint`) |
| `npm run test` | Run Jest tests |
| `npm run test:watch` | Run Jest in watch mode |
| `npm run verify-env` | Check required environment variables are set |

## Deployment
Deployed on Vercel at the live demo URL above, with the Supabase env vars set in the Vercel project. Database schema and migrations live under `src/lib/supabase/migrations`.

---
Built by [Muhammad Taufik](https://taufik.vercel.app)
