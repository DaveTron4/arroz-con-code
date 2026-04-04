# Arroz con Code — Project Plan

> Web app helping Hispanic communities access education, healthcare, and new tech
> through an AI Chat and a Community Board.
> **Total time: 12 hours | 4 developers**

---

## Business Requirements Checklist

### Must-Have (MVP — demo must show these)

- [ ] Bilingual UI — Spanish / English toggle
- [ ] User auth: sign up and sign in with email
- [ ] AI Chat: ask a question, get a bilingual response (Education, Healthcare, New Tech)
- [ ] Community Board: create a post, pick a category, others can comment
- [ ] Basic responsive layout (works on mobile)

### Should-Have (if time allows)

- [ ] Upvote posts and comments
- [ ] Filter community board by category
- [ ] AI chat history saved per session
- [ ] Profile page with display name and avatar

### Won't-Do (cut for 12 hours)

- ~~Social OAuth (Google, etc.)~~ — email-only auth is enough to demo
- ~~Moderator dashboard~~ — no time
- ~~Auto-moderation / profanity filter~~ — out of scope
- ~~Email notifications / follow post~~ — out of scope
- ~~Search~~ — category filter covers demo needs
- ~~PWA / offline mode~~ — post-hackathon stretch goal

---

## Developer Roles

| Dev | Role               | Owns                                                       |
| --- | ------------------ | ---------------------------------------------------------- |
| D1  | Frontend / UI Lead | Layout, all pages, i18n strings, responsive polish         |
| D2  | Backend / API Lead | Database schema, auth, API routes, data queries            |
| D3  | AI Integration     | AI chat API route, chat UI, system prompt, streaming       |
| D4  | Community Features | Community board UI + API, posts, comments, category filter |

---

## 12-Hour Roadmap

### Hour 0–1: Setup (All Devs Together)

**Goal:** Everyone has the app running locally and can push code.

- [ ] **All** — Agree on Git workflow: `main` is always deployable, feature branches per dev
- [ ] **D1** — Scaffold frontend project, set up component library, set up i18n (ES/EN stubs)
- [ ] **D2** — Set up database, define schema (users, posts, comments, chat feedback), share environment config with team
- [ ] **D3** — Get AI API key, create chat endpoint stub, confirm it returns a response
- [ ] **D4** — Confirm posts/comments tables are live, test a manual insert
- [ ] **All** — Deploy skeleton to hosting platform, confirm preview URL works

---

### Hours 1–5: Core Build (Parallel — each dev on their lane)

#### D1 — Pages & Layout

- [ ] App shell: navbar (logo, language toggle, login/signup link), main content area
- [ ] Landing page: headline, 2 CTA buttons ("Ask AI" and "Join Community")
- [ ] Auth pages: sign up / sign in forms
- [ ] Chat page: message thread, input box, send button, loading state
- [ ] Community board page: list of posts, category tabs, "New Post" button

#### D2 — Auth & API

- [ ] Email sign up + sign in, session handling
- [ ] Only create post and submit comment actions require login — viewing board, posts, and AI chat is open to all
- [ ] List posts endpoint (with category filter), create post endpoint
- [ ] Get comments for a post, add comment endpoint
- [ ] Get and update current user profile endpoint
- [ ] Users can only edit/delete their own content (authorization rules)

#### D3 — AI Chat

- [ ] Write system prompt:
  - Role: bilingual assistant for Hispanic communities
  - Topics: education, healthcare, new tech only — decline off-topic questions politely
  - Language: match the language of the user's message
  - Tone: warm, clear, community-oriented
- [ ] Chat endpoint: accept message + language preference, stream AI response
- [ ] Connect chat UI to endpoint with streaming
- [ ] Thumbs up/down button — save feedback to database

#### D4 — Community Board

- [ ] Fetch and display posts, grouped/filterable by category
- [ ] Create post form: title, body, category (Education / Healthcare / New Tech)
- [ ] Post detail page: show post + comments, comment input
- [ ] Submit comment with optimistic UI update

---

### Hours 5–9: Integration & Secondary Features

- [ ] **D1 + D3** — Chat page fully works with real streaming AI responses
- [ ] **D1 + D4** — Community board create/read/comment fully works end-to-end
- [ ] **D2** — Add upvote endpoint if time allows; otherwise skip
- [ ] **D3** — Inject curated resource links per topic into AI system prompt (5–10 links each)
- [ ] **D4** — Category filter tabs wire up to actual API query
- [ ] **D1** — Finish all i18n strings for every visible page (ES + EN)
- [ ] **All** — Fix blockers from integration, merge feature branches to main

---

### Hours 9–11: Polish & QA

- [ ] **D1** — Mobile responsive check: navbar, chat, community board all usable on small screens
- [ ] **D1** — Loading states for feed and chat responses
- [ ] **D2** — Verify all protected routes redirect unauthenticated users
- [ ] **D3** — Test AI in Spanish and English, tune prompt if responses feel off
- [ ] **D4** — End-to-end QA: sign up → create post → comment → switch language → ask AI
- [ ] **All** — Seed database: 3–5 sample posts per category in Spanish and English

---

### Hours 11–12: Demo Prep

- [ ] **All** — Final production deploy, confirm all environment variables are set
- [ ] **D1** — Prepare demo flow (browser tab open, logged-in test account ready):
  1. Land on homepage
  2. Switch language to Spanish
  3. Click "Ask AI" → ask a healthcare question in Spanish → get response
  4. Click "Join Community" → show board → open a post → leave a comment
  5. Create a new post
- [ ] **All** — 2-minute pitch outline:
  - **Problem:** Hispanic communities face language and access barriers for education/healthcare/tech info
  - **Solution:** AI chat in their language + a community of people who've been there
  - **Demo:** live walkthrough
  - **Impact:** what this could mean at scale

---

## Key Integration Risks

| Risk                           | Mitigation                                                  |
| ------------------------------ | ----------------------------------------------------------- |
| Database setup takes too long  | D2 owns this solo in Hour 0, unblocks everyone by Hour 1    |
| AI API key not working         | D3 tests in Hour 0, uses a mock response for dev mode       |
| i18n slows D1 down             | Hardcode English first, add Spanish strings in Hours 9–11   |
| Auth bugs block community work | D4 can build community UI with a hardcoded test user in dev |
