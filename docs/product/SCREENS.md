# COMUNIDAD — Screens & Pages

---

| #   | Screen           | Route            | Auth Required                    | Description                                                                          |
| --- | ---------------- | ---------------- | -------------------------------- | ------------------------------------------------------------------------------------ |
| 1   | Feed             | `/`              | No                               | Geolocated feed of posts and articles within ~20–30 miles; filterable by category    |
| 2   | Sign Up          | `/signup`        | No                               | Email + password registration; user selects account type: Community or Professional  |
| 3   | Sign In          | `/signin`        | No                               | Email + password login form                                                          |
| 4   | Post Detail      | `/post/:id`      | No (read) / Yes (comment)        | Full post with comments and professional replies; translate button per post          |
| 5   | Create Post      | `/post/new`      | Yes (community user)             | Form to write a post: title, body, category (Education / Healthcare / Technology)   |
| 6   | Create Article   | `/article/new`   | Yes (verified professional only) | Form to publish an article: title, body, category                                   |
| 7   | Article Detail   | `/article/:id`   | No                               | Full article view; translate button; professional author badge shown                 |
| 8   | Profile          | `/profile/:id`   | No                               | Public profile: display name, bio, category interests, post/article history          |
| 9   | Settings         | `/settings`      | Yes                              | Edit display name, bio, email, password, preferred language, avatar                  |

---

## Notes

- The Feed (`/`) is the home screen for all users — logged in or not
- Geolocation is requested on first load; if denied, the user is prompted to enter a city or zip code as a fallback
- Posts and articles both appear in the feed, visually distinguished (articles have a professional badge)
- The translate button appears on each post/article card and detail page — translation happens one item at a time, on user request
- Professional accounts see an AI-curated "Suggested Posts" section showing community questions relevant to their specialty
- Professional verification is scoped to a manual admin flag for the hackathon (no automated verification flow)
- Guests who hit a login-required action are redirected to `/signin` and returned to their original destination after signing in

---

## Mobile Layout (< 768px)

```
┌────────────────────────┐
│  [Search]   [Profile]  │  ← top toolbar
├────────────────────────┤
│                        │
│       Feed / Page      │
│                        │
├────────────────────────┤
│  Home  Post  Articles  │  ← bottom sticky nav
└────────────────────────┘
```

## Tablet Layout (≥ 768px)

```
┌──────────┬─────────────┐
│          │             │
│  Left    │  Feed / Page│
│  Sidebar │             │
│  (nav +  │             │
│  filters)│             │
│          │             │
└──────────┴─────────────┘
```
