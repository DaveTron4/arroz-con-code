# Arroz con Code

> Web app helping Hispanic communities access education, healthcare, and new tech through an AI Chat and a Community Board.

**🎯 Mission:** Provide bilingual, accessible resources and community support for Hispanic communities seeking information on education, healthcare, and technology.

**⏱️ Scope:** 12-hour hackathon | 4 developers | MVP-first approach

---

## 🌟 Features

### MVP (Must-Have)
- ✅ **Bilingual UI** — Spanish / English toggle throughout the app
- ✅ **User Authentication** — Email sign up and sign in with session management
- ✅ **AI Chat** — Ask questions, get bilingual responses in Education, Healthcare, or New Tech topics
- ✅ **Community Board** — Create posts, categorize them, and leave comments
- ✅ **Responsive Design** — Works seamlessly on mobile, tablet, and desktop

### Should-Have (If Time Allows)
- 📌 Upvote posts and comments
- 🔍 Filter community board by category
- 💬 AI chat history saved per session
- 👤 Profile page with display name and avatar

### Won't-Do (Post-Hackathon)
- ❌ Social OAuth (Google, GitHub, etc.)
- ❌ Moderator dashboard
- ❌ Auto-moderation / profanity filter
- ❌ Email notifications
- ❌ Full-text search
- ❌ PWA / offline mode

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, i18n (react-i18next)
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **AI Integration:** OpenAI API (or similar)
- **Hosting:** Vercel (frontend) + Heroku/AWS (backend)

---

## 👥 Developer Roles

| Developer | Role                 | Responsibilities                                      |
|-----------|----------------------|-------------------------------------------------------|
| **D1**    | Frontend / UI Lead   | Layout, pages, i18n strings, responsive polish        |
| **D2**    | Backend / API Lead   | Database schema, auth, API routes, data queries       |
| **D3**    | AI Integration       | AI chat API, streaming responses, system prompt       |
| **D4**    | Community Features   | Community board UI + API, posts, comments, filtering |

---

## 📋 12-Hour Roadmap

### **Hour 0–1: Setup** (All Devs Together)
- [ ] Establish Git workflow (`main` is production, feature branches per dev)
- [ ] D1: Scaffold frontend, set up component library, i18n stubs (EN/ES)
- [ ] D2: Set up database, define schema, share environment config
- [ ] D3: Secure AI API key, create endpoint stub, test response
- [ ] D4: Confirm database tables exist, test manual inserts
- [ ] All: Deploy skeleton to hosting, verify preview URL

### **Hours 1–5: Core Build** (Parallel Development)

#### D1 — Frontend Pages & Layout
- [ ] App shell: navbar (logo, language toggle, auth links)
- [ ] Landing page: headline, 2 CTAs ("Ask AI" + "Join Community")
- [ ] Auth pages: sign up and sign in forms
- [ ] Chat page: message thread, input box, send button, loading state
- [ ] Community board: post list, category tabs, "New Post" button

#### D2 — Auth & API
- [ ] Email authentication (sign up + sign in, session handling)
- [ ] Authorization: only logged-in users can create posts/comments
- [ ] Endpoints: list posts, create post, get comments, add comment, get/update user profile
- [ ] Permission rules: users can only edit/delete their own content

#### D3 — AI Chat Integration
- [ ] System prompt: bilingual assistant for Hispanic communities (EN/ES)
  - Topics: Education, Healthcare, New Tech only
  - Decline off-topic questions politely
  - Match user's language preference
  - Warm, clear, community-oriented tone
- [ ] Chat endpoint: accept message + language, stream AI response
- [ ] Connect UI to endpoint with streaming support
- [ ] Add thumbs up/down feedback button, save to database

#### D4 — Community Board
- [ ] Fetch and display posts with category filtering
- [ ] Create post form: title, body, category selector
- [ ] Post detail page: show post + comments, comment input
- [ ] Submit comment with optimistic UI update

### **Hours 5–9: Integration & Polish**
- [ ] D1 + D3: AI chat page fully operational with streaming
- [ ] D1 + D4: Community board fully functional end-to-end
- [ ] D2: Add upvote endpoint (if time permits)
- [ ] D3: Inject curated resource links (5–10 per topic) into system prompt
- [ ] D4: Wire up category filter tabs to API queries
- [ ] D1: Complete all i18n strings (Spanish + English)
- [ ] All: Fix integration blockers, merge to main

### **Hours 9–11: QA & Polish**
- [ ] D1: Mobile responsiveness check (navbar, chat, board)
- [ ] D1: Add loading states for feeds and AI responses
- [ ] D2: Verify protected routes, unauthenticated redirects
- [ ] D3: Test AI responses in Spanish and English, tune prompt
- [ ] D4: End-to-end QA (signup → post → comment → language toggle → chat)
- [ ] All: Seed database (3–5 sample posts per category, bilingual)

### **Hours 11–12: Demo Prep**
- [ ] Deploy to production, verify all environment variables
- [ ] D1: Prepare demo flow:
  1. Landing page → switch to Spanish
  2. Click "Ask AI" → healthcare question in Spanish → get response
  3. Click "Join Community" → browse board → open post → leave comment
  4. Create a new post
- [ ] All: Finalize 2-minute pitch:
  - Problem: Language and access barriers for Hispanic communities
  - Solution: AI chat + community board in their language
  - Demo: Live walkthrough
  - Impact: Scalability and real-world use

---

## ⚙️ Project Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL / MongoDB (TBD)
- OpenAI API key

### Installation

#### Backend
```bash
cd backend
npm install
cp .env.example .env  # Configure with your API keys and DB connection
npm run dev  # Start development server
```

#### Frontend
```bash
cd frontend
npm install
npm start  # Start dev server
```

### Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/arroz_con_code
OPENAI_API_KEY=sk-...
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_LANGUAGE=en
```

---

## 📂 Project Structure

```
arroz-con-code/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── posts.ts
│   │   │   ├── comments.ts
│   │   │   ├── chat.ts
│   │   │   └── users.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Post.ts
│   │   │   └── Comment.ts
│   │   ├── db/
│   │   │   └── schema.sql
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Auth.tsx
│   │   │   ├── Chat.tsx
│   │   │   └── Board.tsx
│   │   ├── i18n/
│   │   │   ├── en.json
│   │   │   └── es.json
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

---

## 🎯 Integration Risks & Mitigations

| Risk                              | Mitigation                                           |
|-----------------------------------|------------------------------------------------------|
| Database setup takes too long     | D2 handles solo in Hour 0, unblocks others by Hour 1 |
| AI API key doesn't work           | D3 tests in Hour 0, use mock responses for dev mode  |
| i18n slows frontend down          | Hardcode English first, add Spanish in Hours 9–11   |
| Auth bugs block community work    | D4 uses hardcoded test user in dev mode              |

---

## 🚀 Git Workflow

- **Main branch:** Always deployable, protected
- **Feature branches:** One per developer, named `feature/[name]`
- **Commit messages:** Clear and descriptive (e.g., `feat: add AI chat endpoint`)
- **Pull requests:** Code review before merge to main

```bash
# Create a feature branch
git checkout -b feature/your-feature

# Commit and push
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature

# Open PR on GitHub for review
```

---

## 📞 Communication

- **Standups:** Hourly (2 min each) throughout the hackathon
- **Blockers:** Call them out immediately in Slack/Discord
- **Final sync:** 1.5 hours before demo for last-minute fixes

---

## 🎤 Demo Script

**2-minute pitch + live demo:**

> "Hispanic communities face barriers accessing reliable, bilingual information on education, healthcare, and technology. We built **Arroz con Code**—an AI-powered, bilingual chat and community board where people can get instant answers and connect with others. Today, you'll see someone ask the AI a healthcare question in Spanish, join our community board, and contribute to conversations."

**Live Demo Flow:**
1. Land on homepage → Switch language to Spanish
2. Ask AI a healthcare question → Get bilingual response
3. Browse community board → Open a post → Leave a comment
4. Create a new post

---

## 📝 License

MIT

---

## 🤝 Contributing

This is a hackathon project. Follow the Git workflow above and communicate with your team lead!

---

**Let's build something meaningful for our community! 🚀**
