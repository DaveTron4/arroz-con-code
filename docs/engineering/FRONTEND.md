# Frontend Architecture

## Overview

The frontend is a single-page application (SPA) built with React, React Router, and Tailwind CSS v4. It lives in the `frontend/` folder at the root of the repo.

All routing happens client-side. The server only serves one HTML file — React takes over from there and handles which page to show based on the URL.

The layout is **mobile-first**: on small screens the app has a top toolbar and a bottom sticky nav bar (Reddit/forum style). On tablet and above it switches to a left sidebar layout.

---

## Folder Structure

```
frontend/
├── index.html              # App entry point — loads the React app
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Build tool configuration
├── tsconfig.json           # TypeScript project references
├── tsconfig.app.json       # TypeScript config for src/ code
├── tsconfig.node.json      # TypeScript config for build tooling
├── .env.example            # Environment variable template
└── src/
    ├── main.tsx            # Mounts the app into the DOM
    ├── index.css           # Global styles (Tailwind import)
    ├── router.tsx          # All routes defined in one place
    ├── context/            # Global state shared across the app
    ├── layouts/            # Page wrappers (top toolbar, bottom nav, sidebar)
    ├── components/         # Reusable UI pieces
    └── pages/              # One file per screen/route
```

---

## How the App Starts

When the browser loads the app, this is the order of execution:

```
index.html
  └── src/main.tsx
        ├── Wraps everything in <AuthProvider>       (makes auth state available app-wide)
        └── Renders <RouterProvider>                 (hands control to the router)
              └── router.tsx                         (decides which page to show)
                    └── RootLayout                   (renders nav + current page)
```

Every page lives inside `RootLayout`, which handles the responsive shell.

---

## Routing (`src/router.tsx`)

All routes are defined in a single file using React Router's `createBrowserRouter`.

| Route          | Page Component      | Auth Required                    |
| -------------- | ------------------- | -------------------------------- |
| `/`            | `FeedPage`          | No                               |
| `/signup`      | `SignUpPage`        | No                               |
| `/signin`      | `SignInPage`        | No                               |
| `/post/:id`    | `PostDetailPage`    | No (read) / Yes (comment)        |
| `/post/new`    | `CreatePostPage`    | Yes                              |
| `/article/:id` | `ArticleDetailPage` | No                               |
| `/article/new` | `CreateArticlePage` | Yes (verified professional only) |
| `/profile/:id` | `ProfilePage`       | No                               |
| `/settings`    | `SettingsPage`      | Yes                              |

Routes that require login are wrapped in `<ProtectedRoute>` directly in `router.tsx`:

```tsx
{
  path: "/post/new",
  element: (
    <ProtectedRoute>
      <CreatePostPage />
    </ProtectedRoute>
  ),
}
```

For professional-only routes, use `<ProfessionalRoute>` which checks both `isAuthenticated` and `user.isVerified`.

> Note: `/post/new` is defined before `/post/:id` so the static segment "new" is never
> mistakenly captured as a post ID. Same for `/article/new` vs `/article/:id`.

---

## Layouts (`src/layouts/`)

### `RootLayout.tsx`

The single layout that wraps every page. It renders the appropriate navigation shell based on screen size, then an `<Outlet />` where the active page renders.

**Mobile (< 768px):**

```
┌────────────────────────┐
│  [Search]   [Profile]  │  ← TopToolbar
├────────────────────────┤
│                        │
│    <Outlet />          │
│                        │
├────────────────────────┤
│     Feed    Profile    │  ← BottomNav (sticky)
└────────────────────────┘
```

**Tablet (≥ 768px):**

```
┌──────────┬─────────────┐
│          │             │
│ Sidebar  │  <Outlet /> │
│ (nav +   │             │
│ filters) │             │
└──────────┴─────────────┘
```

Use Tailwind's responsive prefix to switch layouts:

```tsx
<div className="md:hidden">   {/* mobile only */}
<div className="hidden md:flex">  {/* tablet and up */}
```

---

## Components (`src/components/`)

### `TopToolbar.tsx`

Visible only on mobile. Contains a search input and a profile icon link. Sticks to the top.

### `BottomNav.tsx`

Visible only on mobile. Sticky bottom navigation with icons + labels for: Feed, Profile.

### `Sidebar.tsx`

Visible on tablet and above. Contains navigation links and category filter buttons.

### `PostCard.tsx`

Reusable card for displaying a post in the feed. Shows title, category badge, author, and timestamp. Includes a translate button.

### `ArticleCard.tsx`

Same as `PostCard` but also shows the professional author badge.

### `TranslateButton.tsx`

Button that triggers a translation request for a single post or article. Shows a loading state while the request is in flight and replaces the content with the translated version on success.

### `ProfessionalBadge.tsx`

Small visual badge shown on article cards and professional profiles when `is_verified` is true.

### `ProtectedRoute.tsx`

Checks `isAuthenticated` before rendering a page. Redirects to `/signin` and stores the intended destination for return after login.

### `ProfessionalRoute.tsx`

Extends `ProtectedRoute`. Also checks `user.isVerified`. If the user is not a verified professional, shows a message explaining they need verification rather than redirecting.

---

## Context (`src/context/`)

### `AuthContext.tsx`

Provides authentication state to the entire app. Any component can call `useAuth()` to read or update auth state.

**What it exposes:**

| Name              | Type       | Description                                                         |
| ----------------- | ---------- | ------------------------------------------------------------------- |
| `isAuthenticated` | `boolean`  | Whether the user is currently logged in                             |
| `user`            | `User`     | Current user object (`id`, `displayName`, `type`, `isVerified`)     |
| `login(token)`    | `function` | Call after a successful sign-in to store the token and update state |
| `logout()`        | `function` | Clears the token and marks the user as logged out                   |

Auth state is persisted in `localStorage` so the user stays logged in across page refreshes.

**How to use it:**

```tsx
import { useAuth } from "../context/AuthContext";

const { isAuthenticated, user, login, logout } = useAuth();
```

---

## Pages (`src/pages/`)

| File                    | Route          | What it does                                                                      |
| ----------------------- | -------------- | --------------------------------------------------------------------------------- |
| `FeedPage.tsx`          | `/`            | Geolocated feed of posts and articles; requests location on load; category filter |
| `SignUpPage.tsx`        | `/signup`      | Registration form with account type selector (Community / Professional)           |
| `SignInPage.tsx`        | `/signin`      | Login form; reads redirect state from `ProtectedRoute`                            |
| `PostDetailPage.tsx`    | `/post/:id`    | Full post, comments, comment input, translate button                              |
| `CreatePostPage.tsx`    | `/post/new`    | Form: title, body, category — protected                                           |
| `ArticleDetailPage.tsx` | `/article/:id` | Full article, professional author info, translate button                          |
| `CreateArticlePage.tsx` | `/article/new` | Form: title, body, category — professional-protected                              |
| `ProfilePage.tsx`       | `/profile/:id` | Public profile: display name, bio, account type, post/article history             |
| `SettingsPage.tsx`      | `/settings`    | Edit display name, bio, email, password, avatar — protected                       |

---

## Geolocation

On `FeedPage`, request the user's location on mount:

```tsx
useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (pos) =>
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    () => setShowLocationFallback(true), // show city/zip input
  );
}, []);
```

Pass `lat`/`lng` (or the fallback city/zip) as query params to the feed API endpoint.

---

## Styling

Tailwind CSS v4 is used for all styling. There is no `tailwind.config.js` — v4 is configured directly in the CSS file:

```css
/* src/index.css */
@import "tailwindcss";
```

The Vite plugin (`@tailwindcss/vite`) scans all source files automatically and generates only the styles that are used.

---

## Environment Variables

Copy `.env.example` to `.env` before running locally:

```
VITE_API_URL=http://localhost:5000
```

All environment variables exposed to the browser must be prefixed with `VITE_`. Access them in code with `import.meta.env.VITE_API_URL`.

---

## Running Locally

```bash
# From repo root
npm run frontend

# Or from the frontend directory
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173` by default.
