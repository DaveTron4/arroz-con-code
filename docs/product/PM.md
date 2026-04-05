# COMUNIDAD — Product Manager Document

> This document defines the minimum feature requirements each developer must deliver
> for the product to be considered complete and demo-ready.
> A feature is not "done" until it meets every criterion listed under it.

---

## Definition of Done — Global Standards

Every feature, regardless of who built it, must meet these before it counts as done:

- Works on mobile (375px wide) with bottom sticky nav and top toolbar
- Works on tablet (768px+) with left sidebar layout
- All visible text is available in both English and Spanish
- No broken states — every action either succeeds visibly or shows an error message
- Merged into the main branch and live on the shared deployment URL

### Auth Model

- **No login required:** Browse the feed, read posts and articles, view profiles
- **Login required:** Create a post, submit a comment, translate a post
- **Professional login required:** Create an article, access AI-suggested posts panel
- Unauthenticated users are never blocked from viewing content — only from contributing

---

## Feature 1: User Authentication

**Owner:** D2 (backend), D1 (UI)

### Minimum to be done:

- [ ] A new user can create an account with email, password, and account type (Community or Professional)
- [ ] A returning user can sign in with email and password
- [ ] A signed-in user stays logged in across page refreshes
- [ ] A signed-in user can sign out
- [ ] Professional accounts have a `is_verified` flag; unverified professionals cannot create articles
- [ ] If sign-in fails, the user sees a clear error message in their language

### Out of scope for done:

- Password reset flow
- Social login (Google, etc.)
- Email verification
- Automated professional credential verification

---

## Feature 2: Geolocation Feed

**Owner:** D2 (backend), D1 (UI)

### Minimum to be done:

- [ ] On first load, the app requests the user's geolocation from the browser
- [ ] If geolocation is denied, the user is prompted to enter a city or zip code manually
- [ ] The feed shows only posts and articles within ~20–30 miles of the user
- [ ] Posts and articles are visually distinguished (articles show a professional badge)
- [ ] The feed is filterable by category: Education, Healthcare, Technology
- [ ] If a category has no local content, a friendly empty state is shown

### Out of scope for done:

- Adjustable radius slider
- Map view
- Saved location preference

---

## Feature 3: Posts

**Owner:** D4 (backend + UI)

### Minimum to be done:

- [ ] Any visitor can read posts in the feed and on post detail pages
- [ ] A signed-in community user can create a post with: title, body, and category
- [ ] Category is required — form does not submit without one selected
- [ ] After submitting, the user is taken to the new post's detail page
- [ ] Any signed-in user can comment on a post
- [ ] A user can delete their own comments
- [ ] If saving a post or comment fails, the user sees an error and their text is not lost

### Out of scope for done:

- Image uploads
- Rich text / markdown formatting
- Post editing after publishing

---

## Feature 4: Articles

**Owner:** D4 (backend + UI)

### Minimum to be done:

- [ ] Any visitor can read articles in the feed and on article detail pages
- [ ] A verified professional can create an article with: title, body, and category
- [ ] Articles display the author's professional badge and name
- [ ] An unverified professional who tries to create an article sees a message explaining they need verification

### Out of scope for done:

- Article editing after publishing
- Rich text / markdown formatting
- Image uploads

---

## Feature 5: Professional Verification & AI Suggestions

**Owner:** D3 (AI), D2 (backend flag)

### Minimum to be done:

- [ ] A professional account has an `is_verified` boolean in the database
- [ ] An admin (hardcoded or seeded) can flip the verified flag — no automated flow needed for demo
- [ ] Verified professionals see a "Suggested Posts" section on the feed showing community posts relevant to their category
- [ ] The suggestions are powered by an AI call that matches post content to the professional's category/bio
- [ ] If the AI suggestion call fails, the section is hidden gracefully — it does not crash the page

### Out of scope for done:

- Document upload or credential verification UI
- Suggestion fine-tuning or explicit feedback on suggestions

---

## Feature 6: Per-post Translation

**Owner:** D3

### Minimum to be done:

- [ ] Every post and article has a "Translate" button
- [ ] Clicking translate fetches a translation of that item's title and body in the opposite language
- [ ] Translation happens one item at a time — the user explicitly requests it
- [ ] Translated text replaces the original in the UI until the user dismisses or navigates away
- [ ] If the translation API fails, the user sees a friendly error — the original text is preserved

### Out of scope for done:

- Auto-translate entire feed
- Saving translation preference
- Translating comments

---

## Feature 7: User Profiles

**Owner:** D4

### Minimum to be done:

- [ ] Any visitor can view a user's public profile: display name, bio, account type, and post/article history
- [ ] A signed-in user can edit their own display name, bio, and avatar from Settings
- [ ] Professional profiles show a verified badge if verified

### Out of scope for done:

- Follow / subscribe to users
- Profile analytics
- Portfolio or credential display

---

## Feature 8: Bilingual UI (i18n)

**Owner:** D1

### Minimum to be done:

- [ ] A language toggle is visible and accessible on every page
- [ ] Switching language immediately updates all static UI text without a full reload
- [ ] All of the following are translated in both English and Spanish:
  - Navigation items and buttons
  - Feed category labels and empty states
  - Auth form labels, placeholders, and error messages
  - Post and article creation form labels and validation errors
  - Comment form labels
  - Profile and settings page labels

### Out of scope for done:

- Saving language preference to the user's profile
- Any language beyond Spanish and English

---

## Acceptance Criteria Summary

| Feature                            | Who Signs Off | Hard Requirement?    |
| ---------------------------------- | ------------- | -------------------- |
| User Authentication                | D2 + D1       | Yes — gates all else |
| Geolocation Feed                   | D2 + D1       | Yes — core feature   |
| Posts + Comments                   | D4            | Yes — core feature   |
| Articles                           | D4            | Yes — core feature   |
| Professional Verification + AI     | D3 + D2       | Yes — differentiator |
| Per-post Translation               | D3            | Yes — differentiator |
| User Profiles                      | D4            | Yes — core feature   |
| Bilingual UI                       | D1            | Yes — differentiator |

---

## How to Use This Document

- Before calling a feature done, the developer checks every box under that feature
- If a checkbox cannot be completed in time, it is flagged to the team — not silently dropped
- The PM reviews each feature against this list before the demo build is locked
- Anything not in this document is a stretch goal — don't spend time on it until all boxes above are checked
