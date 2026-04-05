# COMUNIDAD — Project Plan

> Geolocation-based community platform for Hispanic communities.
> **Total time: 12 hours | 4 developers**

---

## Business Requirements Checklist

### Must-Have (MVP — demo must show these)

- [ ] Bilingual UI — Spanish / English toggle
- [ ] User auth: sign up and sign in with email; community and professional account types
- [ ] Geolocation feed: posts and articles within ~20–30 miles
- [ ] Posts: community members ask questions by category (Education, Healthcare, Technology)
- [ ] Articles: verified professionals publish informational posts
- [ ] Per-post translation: user-triggered, one item at a time
- [ ] AI-assisted suggestions: professionals see relevant community posts to reply to
- [ ] User profiles: display name, bio, account type, post history
- [ ] Mobile-first responsive layout: bottom sticky nav + top toolbar on mobile; left sidebar on tablet

### Should-Have (if time allows)

- [ ] Upvote posts and articles
- [ ] Search nearby professionals by category
- [ ] Filter feed by category on a dedicated tab

### Won't-Do (cut for 12 hours)

- ~~Social OAuth (Google, etc.)~~
- ~~Moderator dashboard~~
- ~~Auto-moderation / profanity filter~~
- ~~Email notifications~~
- ~~Full-text search~~
- ~~PWA / offline mode~~
- ~~Automated professional credential verification~~

---

## Developer Roles

| Dev | Role               | Owns                                                                          |
| --- | ------------------ | ----------------------------------------------------------------------------- |
| D1  | Frontend / UI Lead | Mobile-first layout, all pages, bottom nav, tablet sidebar, i18n strings      |
| D2  | Backend / API Lead | Database schema, auth (regular + professional), geolocation queries, API routes |
| D3  | AI + Translation   | Translation API integration, AI recommendation engine for professionals       |
| D4  | Community Features | Posts, articles, comments, professional replies, user profiles                |

---

## 12-Hour Roadmap

### Hour 0–1: Setup (All Devs Together)

**Goal:** Everyone has the app running locally and can push code.

- [ ] **All** — Agree on Git workflow: `main` is always deployable, feature branches per dev
- [ ] **D1** — Scaffold frontend with mobile-first shell, bottom nav stub, i18n stubs (EN/ES)
- [ ] **D2** — Set up database, define schema (users, posts, articles, comments, geolocation), share env config
- [ ] **D3** — Get translation API key, get AI API key, test both return responses
- [ ] **D4** — Confirm posts/articles tables exist, test a manual insert
- [ ] **All** — Deploy skeleton to hosting platform, confirm preview URL works

---

### Hours 1–5: Core Build (Parallel — each dev on their lane)

#### D1 — Pages & Layout

- [ ] Mobile shell: top toolbar (search + profile icon), bottom sticky nav (Home, Post, Articles, Profile)
- [ ] Tablet shell: left sidebar with nav + category filters, main content area
- [ ] Feed page: post and article cards with category badge and professional badge on articles
- [ ] Post detail page: full post, comments, comment input, translate button
- [ ] Article detail page: full article, professional author info, translate button
- [ ] Auth pages: sign up (with account type selector) and sign in forms
- [ ] Create post form: title, body, category selector
- [ ] Profile page: display name, bio, account type badge, list of user's posts/articles

#### D2 — Auth & Geolocation API

- [ ] Email sign up + sign in, session handling (JWT)
- [ ] Two user types stored in DB: `community` and `professional`; `is_verified` boolean on professional accounts
- [ ] Geolocation endpoint: accepts lat/lng, returns posts + articles within radius (~20–30 miles)
- [ ] Fallback: accept city/zip as location input if geolocation is not available
- [ ] List posts endpoint (with category filter + geolocation filter)
- [ ] List articles endpoint (with category filter + geolocation filter)
- [ ] Create post, get post, list comments for post, add comment endpoints
- [ ] Create article, get article endpoints
- [ ] Get/update user profile endpoint
- [ ] Seed database with 3–5 posts per category and 2–3 articles per category in Spanish and English

#### D3 — AI Recommendations + Translation

- [ ] Translation endpoint: accept post/article ID + target language, return translated title + body
  - Use a translation API (DeepL, Google Translate, or similar)
  - Return error gracefully if API fails
- [ ] AI recommendation endpoint: accept a professional's category/bio, return top 5 relevant community posts
  - Use an AI call (prompt-based or embedding similarity)
  - Only exposed to verified professional accounts
- [ ] Test both endpoints return sensible results in Spanish and English

#### D4 — Posts, Articles & Profiles

- [ ] Fetch and render posts in feed, filtered by geolocation + category
- [ ] Fetch and render articles in feed, filtered by geolocation + category (with professional badge)
- [ ] Post detail: full post, list comments, add comment (auth required), delete own comment
- [ ] Article detail: full article, professional author name + verified badge
- [ ] Create post form wired to API
- [ ] Create article form wired to API (only accessible to verified professionals)
- [ ] Public profile page: display name, bio, account type, post/article history

---

### Hours 5–9: Integration & Secondary Features

- [ ] **D1 + D2** — Feed fully loads geolocated posts and articles from real API
- [ ] **D1 + D3** — Translate button works end-to-end on posts and articles
- [ ] **D1 + D3** — "Suggested Posts" panel visible and working for verified professionals
- [ ] **D1 + D4** — Create post and create article flows work end-to-end
- [ ] **D1 + D4** — Comments work end-to-end on post detail
- [ ] **D1** — Finish all i18n strings for every visible page (EN + ES)
- [ ] **D2** — Verify auth guards: only verified professionals can create articles
- [ ] **All** — Fix blockers from integration, merge feature branches to main

---

### Hours 9–11: Polish & QA

- [ ] **D1** — Mobile QA: bottom nav, top toolbar, feed, post detail all usable on 375px
- [ ] **D1** — Tablet QA: left sidebar shows, content area is usable on 768px+
- [ ] **D1** — Loading states for feed and translation requests
- [ ] **D2** — Verify geolocation fallback (city/zip input) works correctly
- [ ] **D3** — Test translation in Spanish ↔ English on multiple posts
- [ ] **D3** — Test AI suggestions return relevant results for a seeded professional account
- [ ] **D4** — End-to-end QA: sign up → browse feed → open post → comment → translate → view profile
- [ ] **All** — Final merge to main, confirm production deploy works

---

### Hours 11–12: Demo Prep

- [ ] **All** — Final production deploy, confirm all environment variables are set
- [ ] **D1** — Prepare demo flow (browser open, logged-in accounts ready for both community user and professional):
  1. Open app → feed shows local posts and articles
  2. Switch language to Spanish
  3. Open a post → read a professional reply → click translate
  4. Sign in as a professional → see AI-suggested posts panel
  5. Create a new post as a community user
- [ ] **All** — 2-minute pitch outline:
  - **Problem:** Hispanic communities lack local, trusted, bilingual resources for education, healthcare, and tech
  - **Solution:** Geolocation-based platform connecting community members with local verified professionals
  - **Demo:** live walkthrough
  - **Impact:** what this could mean for underserved communities at scale

---

## Key Integration Risks

| Risk                                   | Mitigation                                                               |
| -------------------------------------- | ------------------------------------------------------------------------ |
| Geolocation permission denied          | D2 builds city/zip fallback in Hour 1, tested before integration         |
| Translation API rate limit / cost      | D3 caches translations in DB after first request                         |
| Feed empty at demo                     | D2 seeds database in Hours 1–5 with bilingual sample content             |
| Professional verification unclear      | Keep it as a seeded DB flag — no UI flow needed for the demo             |
| AI suggestion quality is low           | Fall back to category-based filtering if AI results are poor             |
