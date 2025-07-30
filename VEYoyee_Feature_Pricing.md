# Veyoyee Project: Hourly Rate Pricing Breakdown (RM20/hour)

## Rate Information

- **Hourly Rate:** RM20 per hour
- **Calculation Method:** Feature complexity × estimated hours

## 1. Core Architecture & Stack

- Next.js 13+ (App Router) integration: **20 hours × RM20 = RM400**
  - **Evidence:**
    - Routing and layouts: `src/app/`, `src/app/layout.tsx`, `src/app/page.tsx`, nested routes
- TypeScript throughout: **12.5 hours × RM20 = RM250**
  - **Evidence:**
    - All files use `.ts`/`.tsx` extensions, types in `src/types/`, strong typing in services and components
- Tailwind CSS setup: **10 hours × RM20 = RM200**
  - **Evidence:**
    - Tailwind config: `tailwind.config.js`, usage in all component and page files, utility classes throughout
- Supabase integration (client/server): **15 hours × RM20 = RM300**
  - **Evidence:**
    - Supabase client: `src/lib/supabase/client.ts`, SSR: `src/lib/supabase/`, usage in hooks and services
- Modular, scalable, production-ready structure: **17.5 hours × RM20 = RM350**
  - **Evidence:**
    - Clear separation: `src/components/`, `src/lib/`, `src/hooks/`, `src/types/`, `src/app/`, service layers
      **Subtotal:** 75 hours = **RM1,500**

## 2. Authentication & Authorization

- Secure registration: **10 hours × RM20 = RM200**
  - **Evidence:**
    - Registration form: `src/app/auth/signup/`, `src/components/auth/`, validation: `src/lib/validations.ts`, Supabase integration
- Secure login: **10 hours × RM20 = RM200**
  - **Evidence:**
    - Login form: `src/app/auth/signin/`, `src/components/auth/`, validation: `src/lib/validations.ts`, Supabase integration
- Protected routes (middleware): **10 hours × RM20 = RM200**
  - **Evidence:**
    - Middleware: `src/middleware.ts`, route protection logic, SSR checks
- Session management (SSR, hooks): **10 hours × RM20 = RM200**
  - **Evidence:**
    - Session hooks: `src/hooks/useSupabaseAuth.ts`, SSR: `src/lib/supabase/`, session refresh in middleware
- Custom hooks for auth/data fetching: **10 hours × RM20 = RM200**
  - **Evidence:**
    - Hooks: `src/hooks/useSupabaseAuth.ts`, `src/hooks/useSupabaseFetch.ts`, `src/hooks/useFetch.ts`
      **Subtotal:** 50 hours = **RM1,000**

## 3. Survey Platform

- Survey creation (UI, logic, integration): **60 hours × RM20 = RM1,200**
  - **Evidence:**
    - Dynamic question types, validation, and extensibility: `src/lib/services/survey/survey-question-service.ts`, `src/data/surveyor-data.ts`, `src/types/survey.ts`
    - Interactive builder and editing: `src/app/surveyor/SurveyForm.tsx`, `src/app/surveyor/[id]/page.tsx`
    - Supabase integration for persistence: `src/lib/services/survey/survey-core-service.ts`, `src/lib/supabase/client.ts`
    - Modular types and service layers: `src/types/survey.ts`, `src/lib/services/survey/survey-types.ts`
    - Import/export: `src/utils/survey-draft-utils.ts`
    - Bulk actions and analytics: `src/components/survey-results/BulkActions.tsx`, `src/components/survey-results/BulkRejectModal.tsx`, `src/app/dashboard/DashboardClient.tsx`
- Survey editing: **40 hours × RM20 = RM800**
  - **Evidence:**
    - Edit survey logic and UI: `src/app/surveyor/SurveyForm.tsx`, `src/app/surveyor/[id]/page.tsx`, update logic in `src/lib/services/survey/survey-core-service.ts`
- Multiple question types (MCQ, checkbox, rating, etc.): **35 hours × RM20 = RM700**
  - **Evidence:**
    - Question type definitions: `src/data/surveyor-data.ts`, `src/types/survey.ts`, rendering and validation in `src/app/surveyor/SurveyForm.tsx`, `src/lib/services/survey/survey-question-service.ts`
- Bulk actions on responses (accept, reject, delete, restore): **45 hours × RM20 = RM900**
  - **Evidence:**
    - Bulk actions UI and logic: `src/components/survey-results/BulkActions.tsx`, `src/components/survey-results/BulkRejectModal.tsx`, integration in `src/app/dashboard/DashboardClient.tsx`
- Survey draft import/export (JSON): **30 hours × RM20 = RM600**
  - **Evidence:**
    - Import/export logic: `src/utils/survey-draft-utils.ts`, usage in survey creation/editing flows
- Analytics dashboard (stats, recent activity, metrics): **60 hours × RM20 = RM1,200**
  - **Evidence:**
    - Dashboard UI and logic: `src/app/dashboard/DashboardClient.tsx`, `src/components/dashboard/SurveyStatsCard.tsx`, `src/components/dashboard/RecentActivityTable.tsx`, metrics in `src/lib/services/survey/survey-metrics-service.ts`
      **Subtotal:** 270 hours = **RM5,400**

## 4. Marketplace & Monetization

- Marketplace listing UI: **15 hours × RM20 = RM300**
  - **Evidence:**
    - Marketplace page: `src/app/marketplace/page.tsx`, components: `src/components/marketplace/MarketplaceGrid.tsx`, `MarketplaceHeader.tsx`, `MarketplaceControls.tsx`
- Purchase logic: **15 hours × RM20 = RM300**
  - **Evidence:**
    - Purchase flow: `src/app/marketplace/page.tsx`, purchase actions in components, Supabase integration
- Transfer logic: **10 hours × RM20 = RM200**
  - **Evidence:**
    - Transfer actions: `src/app/marketplace/page.tsx`, ownership logic in components/services
- Marketplace data models & integration: **10 hours × RM20 = RM200**
  - **Evidence:**
    - Data models: `src/types/`, `src/lib/services/marketplace/`, integration with Supabase
      **Subtotal:** 50 hours = **RM1,000**

## 5. Leaderboard & Gamification

- Community leaderboard UI: **10 hours × RM20 = RM200**
  - **Evidence:**
    - Leaderboard page: `src/app/leaderboard/page.tsx`, components: `src/components/leaderboard/LeaderboardTable.tsx`, `LeaderboardCards.tsx`, `LeaderboardHeader.tsx`
- Reputation system: **10 hours × RM20 = RM200**
  - **Evidence:**
    - Reputation logic: `src/components/leaderboard/types.ts`, user stats in `src/types/`, backend logic in services
- Performance tiers/gamification: **10 hours × RM20 = RM200**
  - **Evidence:**
    - Tier logic: `src/components/leaderboard/types.ts`, UI in leaderboard components
- Leaderboard data models & logic: **5 hours × RM20 = RM100**
  - **Evidence:**
    - Data models: `src/types/`, `src/components/leaderboard/types.ts`, integration with Supabase
      **Subtotal:** 35 hours = **RM700**

## 6. Reusable UI/UX Components

- Custom button, card, skeleton, spinner, error, tooltip, password/select/textarea fields: **20 hours × RM20 = RM400**
  - **Evidence:**
    - Components: `src/components/ui/`, `src/components/shared/`, `src/components/theme/`, `src/components/layout/`
- Accessibility and mobile-friendly layouts: **10 hours × RM20 = RM200**
  - **Evidence:**
    - Responsive design: Tailwind usage, mobile-first layouts in all components/pages
- Loading and error states for all major flows: **10 hours × RM20 = RM200**
  - **Evidence:**
    - Loading: `src/components/ui/skeleton.tsx`, `src/components/ui/loading.tsx`, error: `src/components/shared/ErrorState.tsx`, `route-loading.tsx`
      **Subtotal:** 40 hours = **RM800**

## 7. Testing & Developer Experience

- Jest tests for authentication flows: **10 hours × RM20 = RM200**
  - **Evidence:**
    - Tests: `src/__tests__/auth/`, test setup: `jest.config.js`, `jest.setup.js`
- Centralized types/interfaces: **5 hours × RM20 = RM100**
  - **Evidence:**
    - Types: `src/types/`, used throughout services and components
- Utility functions (date, classnames, etc.): **5 hours × RM20 = RM100**
  - **Evidence:**
    - Utilities: `src/lib/utils.ts`, used in components and services
- Service layers (survey, marketplace, leaderboard): **5 hours × RM20 = RM100**
  - **Evidence:**
    - Service files: `src/lib/services/`, modular logic for all major features
      **Subtotal:** 25 hours = **RM500**

## 8. Documentation & Compliance

- Privacy policy page: **5 hours × RM20 = RM100**
  - **Evidence:**
    - Page: `src/app/privacy-policy/page.tsx`
- Security policy page: **5 hours × RM20 = RM100**
  - **Evidence:**
    - Page: `src/app/security-policy/page.tsx`
- Terms of service page: **5 hours × RM20 = RM100**
  - **Evidence:**
    - Page: `src/app/terms-of-service/page.tsx`
- Code comments, clear structure, mock/test data: **5 hours × RM20 = RM100**
  - **Evidence:**
    - Comments in all files, mock data: `src/data/`, test data: `src/__tests__/`, clear folder structure
      **Subtotal:** 20 hours = **RM400**

---

## **Total Project Summary**

- **Total Hours:** 565 hours
- **Hourly Rate:** RM20/hour
- **Total Value:** **RM11,300**

### Pricing Recommendations:

1. **Commercial License (Multi-use, resale rights, support/updates):** RM11,300 - RM15,000
2. **Standard License (Single use, no resale):** RM8,000 - RM11,300
3. **Basic License (Single use, limited support):** RM6,000 - RM8,000

### Hourly Breakdown Summary:

- Core Architecture: 75 hours (13.3%)
- Authentication: 50 hours (8.8%)
- Survey Platform: 270 hours (47.8%)
- Marketplace: 50 hours (8.8%)
- Leaderboard: 35 hours (6.2%)
- UI Components: 40 hours (7.1%)
- Testing: 25 hours (4.4%)
- Documentation: 20 hours (3.5%)

_The survey platform represents the largest portion of development time (47.8%) due to its complexity and comprehensive feature set._
