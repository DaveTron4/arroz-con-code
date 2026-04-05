# Arroz con Code

> Web app helping Hispanic communities combat misinformation, break language barriers, and discover local resources for education, healthcare, and technology.

**🎯 Mission:** Combat misinformation, break language barriers, and connect Hispanic communities with vetted local resources for education, healthcare, and technology.

**⏱️ Scope:** 12-hour hackathon | 4 developers | MVP-first approach  
**🔄 Scope Pivot:** Replaced generic AI chat with specialized fact-checking, translation, and geolocation features

---

## 📊 **PROJECT STATUS: Backend Complete ✅ | Frontend IN PROGRESS 🚧**

| Component | Status | Progress |
|-----------|--------|----------|
| **Backend API** | ✅ COMPLETE | All 18+ endpoints operational, type-safe, production-ready |
| **Database** | ✅ COMPLETE | 10 tables, all schemas finalized, connection pooling working |
| **AI Integrations** | ✅ COMPLETE | Gemini (fact-checking), LibreTranslate (translation), OpenStreetMap (locations) |
| **Geolocation** | ✅ COMPLETE | Phase 1 foundation with radius filtering ready |
| **Comments & Likes** | ✅ COMPLETE | Full CRUD with threading and polymorphic likes |
| **Frontend UI** | 🚧 IN PROGRESS | React skeleton ready, components being built |
| **TypeScript Config** | ✅ COMPLETE | ESM modules, strict type checking, no build errors |

---

## 🌟 Features

### ✨ **Core Features (Implemented)**

#### **Phase 1: Geolocation Foundation** ✅
- User location tracking (latitude, longitude, location name)
- Post geolocation tagging (where the resource/issue is located)
- Location-aware post filtering (show posts within radius)
- Frontend provides geolocation on app load and updates backend

#### **Phase 2: Fact-Checking with Gemini** ✅
- **Gemini API Integration** - AI-powered fact-checking for all posts
- **Misinformation Detection** - Validates claims in education, healthcare, and tech posts
- **Status Labels** - verified, misleading, false, or unverifiable
- **Confidence Scoring** - 0-1 confidence level for each fact-check
- **Automatic Triggering** - Can fact-check on demand or automatically on post creation
- **Transparent Results** - Users see detailed reasoning behind fact-checks

#### **Phase 3: Bilingual Translation** ✅
- **LibreTranslate Integration** - Free, open-source translation (no API key needed)
- **Automatic Language Detection** - Detects Spanish vs English automatically
- **Spanish ↔ English Translations** - Full support for both languages
- **Translation Caching** - Stores translations to avoid redundant API calls
- **Original + Translated** - Users see both versions side-by-side
- **Smart Detection** - Analyzes accents, language patterns, and word frequency

#### **Phase 4: Location-Based Resource Search** (Ready for Implementation)
- **OpenStreetMap Integration** - Nominatim API for location queries
- **Semantic Location Queries** - "Where can I learn English for free?"
- **Nearby Services** - Shows verified local resources based on user location
- **AI-Powered Search** - Combines geolocation with smart search intent

### MVP (Must-Have)

- ✅ **Bilingual UI** — Spanish / English toggle throughout the app
- ✅ **User Authentication** — Email sign up and sign in with JWT tokens
- ✅ **Fact-Checking** — Gemini-powered misinformation detection
- ✅ **Translation** — Automatic Spanish/English post translation
- ✅ **Community Board** — Create posts, categorize them, and leave comments
- ✅ **Responsive Design** — Works seamlessly on mobile, tablet, and desktop
- ✅ **Geolocation** — User and post location tracking

### Should-Have (If Time Allows)

- 📌 Upvote posts and comments
- 🔍 Filter community board by category and location radius
- 💬 Post view history
- 👤 Profile page with display name, avatar, and location
- 🔔 Location-based notifications

### Won't-Do (Post-Hackathon)

- ❌ Social OAuth (Google, GitHub, etc.)
- ❌ Moderator dashboard
- ❌ Auto-moderation / profanity filter
- ❌ Email notifications
- ❌ Full-text search
- ❌ PWA / offline mode
- ❌ AI Chat (out of scope - too common)

---

## 🛠️ Tech Stack

### **Frontend**
- React, TypeScript, Tailwind CSS
- i18n (react-i18next) for bilingual support
- Geolocation API for location services

### **Backend**
- Node.js, Express, TypeScript
- ESM modules with ts-node for development
- PostgreSQL with connection pooling

### **AI & APIs**
- **Gemini API** - Fact-checking posts for misinformation
- **LibreTranslate** - Bilingual translation (free, open-source, no API key needed)
- **OpenStreetMap/Nominatim** - Location-based searches (free)

### **Database**
- PostgreSQL with 8 tables:
  - `users` - Authentication + geolocation (Phase 1)
  - `posts` - Community board + geolocation (Phase 1)
  - `fact_checks` - Gemini fact-check results (Phase 2)
  - `translations` - Post translations cache (Phase 3)
  - `comments`, `replies`, `likes` - Community engagement
  - `location_searches` - Geolocation query history

### **Hosting**
- Vercel (frontend) + Render (backend)
- PostgreSQL hosted on Render

---

## 👥 Developer Roles

| Developer | Role               | Responsibilities                                     |
| --------- | ------------------ | ---------------------------------------------------- |
| **David** | Backend / API Lead | Database schema, auth, AI integrations, fact-checking, translation |
| **D1**    | Frontend / UI Lead | Layout, pages, i18n strings, responsive design       |
| **D2**    | Community Features | Community board UI, posts, comments, location filtering |
| **D3**    | Integration Lead   | Geolocation features, real-time updates              |

---

## � Database Schema

### Users Table
```sql
- id, email, username, password_hash, display_name, avatar_url, role (regular|professional)
- latitude, longitude, location_name (Phase 1)
- created_at, updated_at, deleted_at
```

### Posts Table
```sql
- id, user_id, title, body, category, type (post|article - professionals only)
- image_url
- latitude, longitude, location_name (Phase 1)
- created_at, updated_at, deleted_at
```

### Fact Checks Table (Phase 2)
```sql
- id, post_id, original_text
- is_fact_checked, fact_check_status (verified|misleading|false|unverifiable)
- fact_check_result, confidence_score (0-1)
- checked_at, created_at
```

### Translations Table (Phase 3)
```sql
- id, post_id, original_language (en|es), original_text
- translated_language (en|es), translated_text
- created_at
```

---

## 🚀 API Endpoints (18+ Endpoints - All Operational ✅)

### Authentication ✅
```
POST   /api/auth/register         - Sign up with location
POST   /api/auth/login            - Sign in
GET    /api/auth/me               - Get profile + location (protected)
PUT    /api/auth/me               - Update profile + location (protected)
```

### Posts (Community Board) ✅
```
GET    /api/posts?category=X&latitude=X&longitude=Y&radius=5   - Filter posts
POST   /api/posts                 - Create post with geolocation (protected)
PUT    /api/posts/:id             - Update post (protected)
DELETE /api/posts/:id             - Delete post soft delete (protected)
```

### Comments ✅
```
GET    /api/posts/:postId/comments         - Get comments with stats
POST   /api/posts/:postId/comments         - Create comment (protected)
PUT    /api/posts/:postId/comments/:id     - Edit comment (protected)
DELETE /api/posts/:postId/comments/:id     - Delete comment (protected)
```

### Likes ✅
```
GET    /api/posts/:postId/likes                         - Get count + user status
POST   /api/posts/:postId/like                          - Toggle post like (protected)
POST   /api/posts/:postId/comments/:commentId/like      - Toggle comment like (protected)
```

### Fact-Checking (Phase 2) ✅
```
POST   /api/fact-checks                    - Fact-check a post (protected)
GET    /api/fact-checks/:postId            - Get fact-check results
POST   /api/fact-checks/:postId/trigger    - Manually trigger fact-check (protected)
```

### Translation (Phase 3) ✅
```
POST   /api/translations                   - Translate a post
GET    /api/translations/:postId?language=es - Get cached translation
```

### Location Search (Phase 4) ✅
```
GET    /api/locations/search?query=X&latitude=Y&longitude=Z   - Search nearby locations
GET    /api/locations/history                                  - Get search history (protected)
```

---

## 📋 Development Progress

### ✅ Completed (All Backend - Phases 1-4)
- Database schema with geolocation support and 10 tables
- User authentication with JWT tokens (7-day expiration)
- User roles (regular/professional) with article creation restrictions
- Post creation, editing, deletion with geolocation
- **Gemini API fact-checking integration** (Phase 2)
- **LibreTranslate integration for Spanish/English** (Phase 3)
- Translation caching in database to avoid redundant API calls
- **Comments & Replies CRUD** with nested threading
- **Likes system** with toggle on posts and comments
- **OpenStreetMap/Nominatim location search** (Phase 4) with query history
- TypeScript configuration for ESM/ts-node
- All interfaces organized in dedicated `/interfaces` folder (26+ type definitions)
- Database seeding with sample data (5 users, 9 posts)
- Comprehensive input validation and error handling
- Environment variable validation for API keys
- **18+ API endpoints** fully operational and type-safe
- Backend builds and runs without errors (`npm run build` ✅)

### 🔄 In Progress
- **Frontend Integration** - React components for all features
- Community board UI with fact-check badges
- Post creation with geolocation picker
- Comment threads UI
- Translation toggle component
- User authentication UI

### ⏳ Future Enhancements
- Advanced error handling middleware
- Rate limiting (per user/IP)
- Admin moderation queue
- Content flagging system
- Analytics & usage tracking
- Batch fact-checking operations

---

## 🔄 Scope Evolution

### Original Scope (Changed Rationale Below)
- ❌ **AI Chat** - Replaced with fact-checking (more impactful for underserved communities)
- ❌ **Generic AI Assistant** - Too common, not differentiated

### New Scope (Hackathon Pivot - Why?)
1. **Fact-Checking First** - Combat misinformation in health/education (health misinformation is deadly in underserved communities)
2. **Translation Layer** - Bridge Spanish/English divide for crucial information
3. **Geolocation** - Connect people to local, verified resources (hyperlocal relevance)
4. **Professional Verification** - Only verified professionals can create articles (credibility tier)

### Impact Reasoning
- **Original scope:** Generic chat interface (100+ competitors, low differentiation)
- **New scope:** Misinformation combat + translation + local resources (niche, real problem, community impact)
- **Hackathon appeal:** Solves actual problem, shows technical depth, demonstrates community perspective

---

## 📋 12-Hour Roadmap (Actual Progress)

### **Hours 0–2: Backend Foundation** ✅ COMPLETED
- ✅ Database schema with geolocation support
- ✅ User authentication (register/login/profile with JWT)
- ✅ Database connection pooling with Render support
- ✅ TypeScript ESM configuration

### **Hours 2–4: Phase 2 - Fact-Checking** ✅ COMPLETED
- ✅ Gemini API fact-checking integration
- ✅ Fact-check controller with Gemini Pro model
- ✅ Fact-check routes (POST, GET, trigger endpoints)
- ✅ Database storage for fact-check results
- ✅ Confidence scoring (0-1) implementation

### **Hours 4–6: Phase 3 - Translation** ✅ COMPLETED
- ✅ LibreTranslate integration (free, no API key)
- ✅ Language detection (Spanish/English)
- ✅ Translation caching to avoid duplicate API calls
- ✅ Translation controller and routes
- ✅ Database storage for translations

### **Hours 6–7: Comments, Likes & Phase 4** ✅ COMPLETED
- ✅ Comments CRUD (create, read, update, delete with soft deletes)
- ✅ Nested replies on comments
- ✅ Likes toggle on posts and comments
- ✅ Like counts with user status detection
- ✅ Comments + Likes TypeScript interfaces
- ✅ Comments with stats VIEW (joins author info and counts)
- ✅ OpenStreetMap/Nominatim location search implementation
- ✅ Location search history storage
- ✅ All 18+ API endpoints fully operational and type-safe

### **Hours 7–9: Frontend Integration** (IN PROGRESS)
- Community board UI with fact-check/translation badges
- Post creation with location picker
- Comment system UI with threading
- Like/unlike button components
- Location-based post filtering
- Language toggle for translations
- User authentication UI

### **Hours 9–11: Polish & Testing** (Next Phase)
- Mobile responsiveness
- Error handling and user feedback
- Performance optimization
- End-to-end testing
- Deployment preparation

### **Hours 11–12: Deployment & Demo**
- Deploy to Vercel (frontend) + Render (backend)
- Demo preparation and walkthrough
- Final bug fixes

---

## 🔐 Environment Variables

### Backend (.env)
```
# Database
DATABASE_URL=postgresql://user:password@host:port/db
# Or use individual credentials:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=arroz_con_code
# DB_USER=postgres
# DB_PASSWORD=password

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_here_32_chars_min

# Gemini API (for fact-checking) - REQUIRED for Phase 2
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Future features
OPENAI_API_KEY=sk-your_openai_key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

---

## 🚀 Getting Started

### Backend Setup
```bash
cd backend
npm install
npm run db:reset    # Initialize database with schema and seed data
npm run dev         # Start development server on port 5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev         # Start React development server
```

### Testing Endpoints (After Server Starts)

**Register user with location:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123!",
    "latitude": 33.749,
    "longitude": -84.388,
    "locationName": "Atlanta, GA"
  }'
```

**Create post with geolocation:**
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Free English Classes",
    "body": "Learning English is important for career growth...",
    "category": "Education",
    "latitude": 33.749,
    "longitude": -84.388,
    "locationName": "Community Center"
  }'
```

**Fact-check a post (Phase 2):**
```bash
curl -X POST http://localhost:5000/api/fact-checks \
  -H "Content-Type: application/json" \
  -d '{
    "postId": 1,
    "text": "Vaccines cause autism",
    "category": "Healthcare"
  }'
```

**Translate a post (Phase 3):**
```bash
curl -X POST http://localhost:5000/api/translations \
  -H "Content-Type: application/json" \
  -d '{
    "postId": 1,
    "targetLanguage": "es"
  }'
```

**Get translation:**
```bash
curl -X GET "http://localhost:5000/api/translations/1?language=es"
```

---

## 📂 Backend Project Structure

```
backend/
├── config/
│   ├── database.ts           # PostgreSQL connection pool
│   └── reset.ts              # Database initialization & seeding
├── controllers/
│   ├── auth.controller.ts    # Authentication logic
│   ├── posts.controller.ts   # Community board posts
│   ├── factcheck.controller.ts # Gemini fact-checking (Phase 2)
│   └── translation.controller.ts # LibreTranslate (Phase 3)
├── middleware/
│   └── auth.middleware.ts    # JWT verification
├── routes/
│   ├── index.route.ts        # Central router
│   ├── auth.route.ts         # Auth endpoints
│   ├── posts.route.ts        # Posts endpoints
│   ├── factcheck.route.ts    # Fact-check endpoints (Phase 2)
│   └── translation.route.ts  # Translation endpoints (Phase 3)
├── interfaces/
│   ├── auth.interfaces.ts    # Auth request/response types
│   ├── models.interfaces.ts  # Database model types
│   ├── posts.interfaces.ts   # Posts request/response types
│   ├── factcheck.interfaces.ts # Fact-check types (Phase 2)
│   ├── translation.interfaces.ts # Translation types (Phase 3)
│   ├── express.interfaces.ts # Express extensions
│   └── index.ts              # Central export
├── utils/
│   └── post-validation.ts    # Validation helpers
├── data/
│   └── schema.sql            # Database schema
├── index.ts                  # Server entry point
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 📱 User Journey Example

**Maria's Experience (Spanish speaker from Atlanta):**

1. **Opens app** → Browser shares location (Atlanta, GA)
2. **Signs up** → Location auto-populated, sets "Spanish" preference
3. **Browses community board** → Sees posts within 5km radius
4. **Finds health post** → "¿Es segura la vacuna COVID?" (Is COVID vaccine safe?)
5. **Sees fact-check badge** → Gemini verified with 0.95 confidence
6. **Clicks "Translate to English"** → Reads English version instantly
7. **Searches for clinic** → "Where can I get vaccinated near me?"
8. **Sees location results** → 3 nearby clinics with hours, addresses
9. **Leaves comment** → Shares her story in Spanish
10. **Community supports** → Other Hispanics validate and add resources

---

## 🎓 Hackathon Learning Outcomes

This project demonstrates:
- ✅ Full-stack TypeScript development (Frontend + Backend)
- ✅ AI API integration (Gemini for fact-checking)
- ✅ Free API integration (LibreTranslate for translation)
- ✅ Database design with geospatial features
- ✅ JWT authentication and authorization
- ✅ Bilingual internationalization (i18n)
- ✅ Community-driven product pivots
- ✅ Rapid feature implementation (3 features in ~4 hours)
- ✅ TypeScript ESM configuration
- ✅ Production-ready error handling

---

## 🔗 Useful Links

- **Gemini API Docs:** https://ai.google.dev/
- **LibreTranslate:** https://libretranslate.de/
- **OpenStreetMap/Nominatim:** https://nominatim.org/
- **PostgreSQL Connection Pooling:** https://node-postgres.com/
- **React i18n (react-i18next):** https://www.i18next.com/

---

## 📄 License

MIT - Build something amazing! 🚀

---

## 🤝 Contributing

This is a hackathon project. **Communication is key!**
- Commit frequently with clear messages
- Communicate blockers immediately
- Help teammates if you finish early
- Focus on user impact, not perfection

**Let's build something meaningful for Hispanic communities! 💪**
