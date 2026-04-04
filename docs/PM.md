# Arroz con Code — Product Manager Document

> This document defines the minimum feature requirements each developer must deliver
> for the product to be considered complete and demo-ready.
> A feature is not "done" until it meets every criterion listed under it.

---

## Definition of Done — Global Standards

Every feature, regardless of who built it, must meet these before it counts as done:

- Works on both desktop and a small mobile screen (375px wide)
- All visible text is available in both English and Spanish
- No broken states — every action either succeeds visibly or shows an error message
- Merged into the main branch and live on the shared deployment URL

### Auth Model

- **No login required:** Browse the community board, read posts, read comments, use the AI Chat
- **Login required:** Create a post, submit a comment
- Unauthenticated users are never blocked from viewing content — only from contributing

---

## Feature 1: User Authentication

**Owner:** D2 (backend), D1 (UI)

### Minimum to be done:

- [ ] A new user can create an account using an email address and password
- [ ] A returning user can sign in with their email and password
- [ ] A signed-in user stays logged in across page refreshes
- [ ] A signed-in user can sign out
- [ ] Only actions that require login (create post, submit comment) redirect unauthenticated users to sign in — all other pages are accessible without an account
- [ ] If sign-in fails (wrong password, unregistered email), the user sees a clear error message in their language

### Out of scope for done:

- Password reset flow
- Social login (Google, etc.)
- Email verification

---

## Feature 2: AI Chat

**Owner:** D3 (API + prompt), D1 (UI integration)

### Minimum to be done:

- [ ] Any visitor (signed in or not) can use the AI Chat — no login required
- [ ] The AI responds in the same language the user wrote in (Spanish or English)
- [ ] The AI only answers questions related to Education, Healthcare, or New Tech — it politely declines anything else
- [ ] The AI response streams in progressively (user sees words appear, not a loading spinner then a wall of text)
- [ ] If the AI fails or times out, the user sees a friendly error message — the app does not crash or show a blank screen
- [ ] The user can give a thumbs up or thumbs down on any AI response

### Out of scope for done:

- Chat history saved across sessions
- AI citing specific URLs (nice to have but not required)
- Voice input

---

## Feature 3: Community Board — Post List

**Owner:** D4 (backend + UI)

### Minimum to be done:

- [ ] Any visitor (signed in or not) can view the community board
- [ ] Posts are displayed with: title, category label, author display name, and time posted
- [ ] Posts are grouped or filterable by the three categories: Education, Healthcare, New Tech
- [ ] Selecting a category shows only posts in that category
- [ ] The board updates without a full page reload when a new post is added (or on refresh at minimum)
- [ ] If there are no posts in a category, a friendly empty state is shown (not a blank page)

### Out of scope for done:

- Keyword search
- Sorting (newest, most upvoted)
- Pagination (showing all posts is fine for demo)

---

## Feature 4: Community Board — Create Post

**Owner:** D4 (backend + UI)

### Minimum to be done:

- [ ] A signed-in user can create a post with: a title, a body (text), and a category selection
- [ ] The category field is required — the form does not submit without one selected
- [ ] After submitting, the user is taken to the new post's detail page (or the board refreshes showing the post)
- [ ] A guest who tries to create a post is redirected to sign in, then returned to the board after logging in
- [ ] If the post fails to save, the user sees an error and their text is not lost

### Out of scope for done:

- Image uploads
- Tags beyond the 3 main categories
- Rich text / markdown formatting

---

## Feature 5: Community Board — Post Detail & Comments

**Owner:** D4 (backend + UI)

### Minimum to be done:

- [ ] Any visitor can open a post and read the full title, body, author, and timestamp
- [ ] Any visitor can read all comments, displayed in chronological order
- [ ] A signed-in user can submit a comment — it appears on the page immediately after submitting
- [ ] A guest who tries to comment is prompted to sign in (inline prompt or redirect), then returned to the post
- [ ] A signed-in user can delete their own comments (not others')
- [ ] If a comment fails to post, the user sees an error

### Out of scope for done:

- Threaded/nested replies
- Comment editing
- Upvotes (should-have, not must-have)

---

## Feature 6: Bilingual UI (i18n)

**Owner:** D1

### Minimum to be done:

- [ ] A language toggle is visible and accessible from every page (navbar or header)
- [ ] Switching language immediately updates all UI text on the current page without a full reload
- [ ] All of the following are translated in both English and Spanish:
  - Navigation items and buttons
  - Landing page headline and CTAs
  - Auth form labels, placeholders, and error messages
  - Chat page labels and placeholder text
  - Community board category names, empty states, and button labels
  - Post creation form labels and validation errors
  - Comment form labels
- [ ] The AI chat responds in the language the user types in (not controlled by the toggle — the AI detects it)

### Out of scope for done:

- User language preference saved to their profile
- Any language beyond Spanish and English

---

## Feature 7: Landing Page

**Owner:** D1

### Minimum to be done:

- [ ] The page clearly communicates what the product does in one headline (in the current language)
- [ ] There are two clear calls-to-action: one that goes to the AI Chat, one that goes to the Community Board
- [ ] A signed-in user sees their name or a sign-out option in the navbar
- [ ] A signed-out user sees sign-in and sign-up links in the navbar
- [ ] The page looks intentional and readable on mobile

### Out of scope for done:

- Marketing copy beyond the headline and CTAs
- Animation or illustrations
- Footer links

---

## Acceptance Criteria Summary

| Feature                       | Who Signs Off | Hard Requirement?      |
| ----------------------------- | ------------- | ---------------------- |
| User Authentication           | D2 + D1       | Yes — gates all else   |
| AI Chat                       | D3 + D1       | Yes — core feature     |
| Community Board — Post List   | D4            | Yes — core feature     |
| Community Board — Create Post | D4            | Yes — core feature     |
| Post Detail & Comments        | D4            | Yes — core feature     |
| Bilingual UI                  | D1            | Yes — differentiator   |
| Landing Page                  | D1            | Yes — demo entry point |

---

## How to Use This Document

- Before calling a feature done, the developer checks every box under that feature
- If a checkbox cannot be completed in time, it is flagged to the team — not silently dropped
- The PM reviews each feature against this list before the demo build is locked
- Anything not in this document is a stretch goal — don't spend time on it until all boxes above are checked
