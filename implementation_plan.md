# GreenFeed SRS Implementation Plan

Build remaining features from the SRS document into the existing GreenFeed web application.

## Current State Analysis

### What's Already Built ✅
| SRS Feature | Existing Implementation | Status |
|---|---|---|
| **Auth System** (FR-1.x) | `useAuth.tsx` + `AuthModal.tsx` — Supabase email/password, signup, login, password reset | ✅ Functional |
| **Landing Page** | `Index.tsx` → `NewHeroSection` (hero only) | ⚠️ Minimal — only hero, no How It Works / Features / Problem sections on landing |
| **Home (logged-in)** | `Home.tsx` → SpotIssues, TakeAction, Verification, Rewards sections | ✅ Functional |
| **Dashboard** | `Dashboard.tsx` — profile card, stats, QR display, TaskSection, smart dustbin logs | ✅ Functional |
| **Task System** (FR-4.x) | `TaskSection.tsx` + `SpotIssuesSection.tsx` — fetch from Supabase `tasks` table, claim tasks | ⚠️ Partial — no proof upload on completion, no map view |
| **Heatmap** (FR-7.x) | `HeatmapPage.tsx` + Leaflet map + filters + time slider | ⚠️ Mock data only — no Supabase integration, no incident reporting form |
| **Rewards** (FR-5.x) | `RewardsSection.tsx` — tier display, badge list, shop links | ⚠️ Mock data — uses `mockUser` instead of real profile |
| **Verification** (FR-8.x) | `VerificationSection.tsx` — simulated verification steps | ⚠️ UI demo only |
| **Smart Bin / IoT** (FR-11.x) | `useSmartDustbin.ts` — real-time Supabase listener on `dustbin_logs` | ✅ Functional |
| **QR Code** (FR-6.x) | Dashboard displays QR from `profile.qr_token` | ⚠️ Display only — no regeneration |
| **Footer** | Full footer with links, newsletter, socials | ✅ Complete |
| **NavBar** | Auth-aware navbar with mobile menu | ✅ Complete |

### What's Missing / Needs Building 🔴
| SRS Feature | Gap |
|---|---|
| **Social Feed** (FR-3.x) | No feed page at all — no post creation, likes, comments, hashtags |
| **User Profile Page** (FR-2.x) | No dedicated `/profile` page — only a profile card in Dashboard. Need eco-score, streaks, badges, activity history, shareable profile |
| **Leaderboard Page** (FR-5.3) | Only mock data in `ProfileSection.tsx` — need real Supabase-powered leaderboard page |
| **Admin Dashboard** (FR-9.x) | No admin interface at all — need task CRUD, user management, content moderation, analytics |
| **Landing Page Sections** | `Index.tsx` only shows hero. The SRS describes a rich landing experience with How It Works, Features, Problem/Solution, Hardware phases, Teams |
| **Incident Reporting** (FR-7.2) | Heatmap page has no report form — users can't create new incidents |
| **Task Map View** (FR-4.2) | Tasks only shown in list — no map-based task discovery |
| **Post/Share Dashboard** | Component exists (`PostShareDashboard.tsx`) but isn't used in any route |

---

## Proposed Changes

Changes are grouped by phase. Each phase is independently deployable.

---

### Phase 1: Enrich Landing Page (Index.tsx)

The SRS describes a comprehensive landing experience. Currently the `Index.tsx` only renders the Hero section. Multiple section components already exist but aren't wired in.

#### [MODIFY] [Index.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/pages/Index.tsx)
- Import and render the following sections below `NewHeroSection`:
  1. `FeaturesSection` — Core platform features
  2. `ProblemSection` — Environmental problem context
  3. `SolutionSection` — How GreenFeed addresses it
  4. `HowItWorksSection` — 5-step flow (already exists, well-built)
  5. `HardwarePhase1Section` — IoT smart bin concept
  6. `HardwarePhase2Section` — Advanced IoT vision
  7. `CTASection` — Call to action
- These components all already exist in `src/components/sections/` — just need to import and compose.

---

### Phase 2: Social Feed Page (FR-3.x)

This is the biggest missing feature — a community-driven content stream.

#### [NEW] [FeedPage.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/pages/FeedPage.tsx)
- Full feed page with:
  - Post creation card (text up to 500 chars, image upload, optional geo-tag, hashtags)
  - Chronological feed of posts
  - Like/unlike with real-time count
  - Comment section (1-level deep for v1)
  - Hashtag filtering
- Uses Supabase `posts` table (with fallback mock data if table doesn't exist yet)
- Protected route — requires authentication

#### [NEW] [PostCard.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/components/feed/PostCard.tsx)
- Reusable post card component with:
  - Author avatar, name, timestamp
  - Post content + images
  - Like button + count
  - Comment toggle + inline comment form
  - Share button

#### [NEW] [CreatePostCard.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/components/feed/CreatePostCard.tsx)
- Post composer with text area, image upload preview, hashtag input, geo-tag toggle

#### [MODIFY] [App.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/App.tsx)
- Add route: `/feed` → `FeedPage`

#### [MODIFY] [NavBar.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/components/NavBar.tsx)
- Add "Feed" link to navigation (visible when logged in)

---

### Phase 3: Profile Page (FR-2.x)

#### [NEW] [ProfilePage.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/pages/ProfilePage.tsx)
- Dedicated profile page showing:
  - Large profile card (avatar, name, bio, eco-score, tier badge)
  - Stats grid: total points, streak, tasks completed, waste deposited
  - Eco-Score breakdown (FR-8.1 formula display): `T×0.50 + B×0.30 + S×0.20`
  - Achievement badges gallery
  - Activity history timeline (tasks, bin interactions, posts)
  - QR code display + regenerate button
- Pulls real data from Supabase `profiles` table

#### [MODIFY] [App.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/App.tsx)
- Add route: `/profile` → `ProfilePage`

#### [MODIFY] [NavBar.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/components/NavBar.tsx)
- Profile avatar link → `/profile` instead of `/dashboard`

---

### Phase 4: Leaderboard Page (FR-5.3)

#### [NEW] [LeaderboardPage.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/pages/LeaderboardPage.tsx)
- Full-page leaderboard:
  - Top 3 podium display with large cards
  - Scrollable ranked list (top 100)
  - Current user's rank highlighted
  - Tier badges (Bronze/Silver/Gold/Platinum/Elite)
  - Filter: All-time vs. 30-day rolling
- Queries Supabase `profiles` table ordered by `eco_score` or `total_points`
- Falls back to mock data from `leaderboardData` if profiles table is sparse

#### [MODIFY] [App.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/App.tsx)
- Add route: `/leaderboard` → `LeaderboardPage`

#### [MODIFY] [NavBar.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/components/NavBar.tsx)
- Add "Leaderboard" link

---

### Phase 5: Admin Dashboard (FR-9.x)

#### [NEW] [AdminPage.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/pages/AdminPage.tsx)
- Admin-only page (check `profile.role === 'admin'`) with tabbed interface:
  1. **Overview Tab**: KPI cards (total users, active tasks, waste collected, active bins)
  2. **Task Management Tab**: Create/edit/publish/delete tasks form + table
  3. **User Management Tab**: Search users, view profiles, suspend accounts
  4. **Content Moderation Tab**: Flagged posts queue with approve/reject
  5. **Smart Bin Health Tab**: Bin status table (online/offline, last seen, fill level)
- Uses Supabase queries with admin role checks
- Falls back to demo data for academic presentation

#### [NEW] [AdminTaskForm.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/components/admin/AdminTaskForm.tsx)
- Task creation form with: title, description, category, location, deadline, max claimants, points reward

#### [NEW] [AdminUserTable.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/components/admin/AdminUserTable.tsx)
- User management table with search, role badges, suspend action

#### [MODIFY] [App.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/App.tsx)
- Add route: `/admin` → `AdminPage`

---

### Phase 6: Enhanced Heatmap (FR-7.2) + Incident Reporting

#### [NEW] [ReportIncidentModal.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/components/heatmap/ReportIncidentModal.tsx)
- Modal form for users to report incidents from the heatmap:
  - Map click to set location
  - Category dropdown (litter/overflow/illegal dumping/pollution)
  - Description text area
  - Optional photo upload
- Posts to Supabase `incidents` table (with mock fallback)

#### [MODIFY] [HeatmapPage.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/pages/HeatmapPage.tsx)
- Add "Report Issue" button that opens the `ReportIncidentModal`
- Wire map click to populate location in the form

---

### Phase 7: Connect Rewards to Real Data

#### [MODIFY] [RewardsSection.tsx](file:///c:/Users/namit/Downloads/greenfeed-eco-pulse-main/greenfeed-eco-pulse-main/src/components/sections/RewardsSection.tsx)
- Replace `mockUser` import with real `useAuth()` profile data
- Map `profile.total_points`, `profile.eco_score`, `profile.streak_days` to the stats display
- Determine active tier from real points

---

## Open Questions

> [!IMPORTANT]
> **Supabase Tables**: Several features require Supabase tables (`posts`, `comments`, `likes`, `incidents`, `tasks`, `task_claims`, `profiles`). Some may not exist yet in your Supabase project. Should I:
> - (A) Build all UI with **mock data fallbacks** (so the app works visually without migrations), or
> - (B) Provide the SQL migration scripts for you to run in Supabase first?

> [!IMPORTANT]
> **Which phases to build?** This is a LOT of work. Do you want me to:
> - Build **all 7 phases** (full SRS coverage)?
> - Start with **specific phases** you need most (e.g., Phase 1 + 2 + 5 for the landing page + feed + admin)?
> - Focus on **frontend-only** with mock data for academic demo, or wire everything to **real Supabase** queries?

> [!NOTE]
> **OAuth (FR-1.3)**: The SRS mentions Google/Facebook OAuth login. Your current Supabase setup only has email/password. Want me to add Google OAuth button to the AuthModal? This requires enabling Google provider in your Supabase dashboard.

---

## Verification Plan

### Automated Tests
- Run `npm run dev` and visually test all routes
- Navigate through all pages to verify no runtime errors
- Test auth flow: signup → login → protected routes → logout → redirect

### Manual Verification
- Landing page renders all sections with smooth scroll animations
- Feed page: create post → appears in feed → like → comment
- Profile page: shows real user data from Supabase profile
- Leaderboard: displays ranked users
- Admin: create task → shows in task list
- Heatmap: report incident → appears on map
