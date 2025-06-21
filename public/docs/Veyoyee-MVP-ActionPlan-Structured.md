# Veyoyee MVP - Action Plan

## Project Overview

**Veyoyee**: Incentivized survey platform for academic and nonprofit researchers.

**Core Functionality**: Researchers create surveys and reward respondents with tokens/cash for participation.

**MVP Scope**: Basic authentication, web survey builder, survey-taking UI, token incentives, and Stripe payouts.

**Timeline**: 6-8 weeks to functional prototype.

## User Roles

1. **Researcher**:

   - Creates/edits surveys
   - Sets rewards per completion
   - Monitors progress and results
   - Manages survey budgets

2. **Respondent**:

   - Registers with optional profile
   - Browses/takes surveys
   - Earns tokens/credits
   - Requests payouts

3. **Admin**:
   - Manages users and content
   - Adjusts system settings
   - Views platform metrics
   - Ensures compliance

## Core Functional Requirements

### 1. Authentication & KYC

- Email/password or SSO login
- Verified institutional emails for researchers
- Identity verification via Stripe Connect
- Respondent verification before payout

### 2. Survey Creation

- Form-based builder
- Multiple question types
- Logic/skip patterns (optional)
- Reward per respondent
- Draft/publish workflow
- Survey preview

### 3. Researcher Dashboard

- Survey listings with stats
- Response analytics
- Budget tracking
- Survey management tools

### 4. Survey Taking

- Browse available surveys
- Answer questions interface
- Submission validation
- Auto token rewards
- Multiple submission prevention

### 5. Token & Reward System

- Token ledger per user
- Researcher budget tracking
- 1 token = $1 by default
- Fair pay guidelines ($12/hour)
- Empty submission prevention

### 6. Payment Integration

- Stripe for all payments
- Researcher funding workflow
- Respondent payout requests
- Payout thresholds
- Transaction logging

### 7. Admin Functions

- Survey/user oversight
- Content moderation
- Dispute resolution
- System parameter management

## Technical Architecture

### 1. Frontend

- Next.js (React framework)
- Tailwind CSS
- Mobile-responsive design
- Key pages: Landing, Dashboard, Survey Builder/Taker

### 2. Backend

- Supabase (Authentication, Postgres DB, RESTful APIs)
- Next.js API routes for custom logic
- Stripe webhooks handling

### 3. Database Schema

- users (id, role, email, profile, StripeAccountID)
- surveys (id, researcher_id, title, description, reward_per_response, status)
- questions (id, survey_id, type, prompt, options)
- responses (id, survey_id, respondent_id, answers)
- tokens (id, user_id, survey_id, amount, earned_at)
- transactions (id, type, amount, user_id, stripe_txn_id)
- admin_logs (id, action, target_id, admin_id)

### 4. Stripe Integration

- Stripe Connect for payments
- User-Stripe account linking
- Payout API integration
- Webhook handling
- KYC via Stripe Identity

### 5. Deployment

- Next.js on Vercel
- Managed Supabase hosting
- HTTPS for Stripe webhooks

## Development Sprints

### Week 1: Setup & Foundation

- Supabase data model & auth
- Stripe sandbox config
- Next.js + Tailwind project setup
- **Milestone**: Basic auth and homepage working

### Week 2: User Management

- Registration/login flows
- Role selection UI
- User profiles
- Stripe onboarding links
- **Milestone**: User registration and role-based dashboard

### Week 3: Survey Builder

- Survey creation interface
- Question types implementation
- Draft/publish functionality
- Respondent targeting
- **Milestone**: Working survey creation and publication

### Week 4: Respondent Workflow

- Available surveys listing
- Survey taking UI
- Answer submission
- Token rewards system
- **Milestone**: End-to-end survey flow with token rewards

### Week 5: Payment Integration

- Stripe Connect backend
- Survey funding mechanism
- Payout account connection
- Balance/wallet pages
- **Milestone**: Working payout system

### Week 6: Dashboards & Analytics

- Researcher statistics dashboard
- Admin oversight tools
- Response analytics
- Mobile UI optimization
- **Milestone**: Complete dashboards and internal QA

### Week 7: Testing & Refinement

- Bug fixes from QA
- Email notifications
- Landing page for early adopters
- Documentation completion
- **Milestone**: Feature-complete MVP

### Week 8: Launch Preparation

- Performance optimization
- Security review
- Nice-to-have features
- Beta launch
- **Milestone**: Public MVP release

## Risk Management

1. **Scope Creep**: Use MoSCoW prioritization, cut non-critical features
2. **Stripe Integration**: Start early, use test environment, follow documentation
3. **KYC Complexity**: Use Stripe Identity, require KYC only for payouts
4. **Development Bottlenecks**: Use BaaS solutions, leverage templates, weekly priorities
5. **Security Concerns**: Encrypt sensitive data, security reviews, admin training
