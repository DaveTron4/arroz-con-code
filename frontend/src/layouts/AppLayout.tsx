import { Outlet, NavLink, Link, useLocation, useNavigate } from "react-router";

const PAGE_TITLES: Record<string, string> = {
  "/chat": "AI Chat",
  "/community": "Community",
  "/community/new": "New Post",
  "/settings": "Settings",
  "/signup": "Sign Up",
  "/signin": "Sign In",
};

const BACK_ROUTES = ["/community/new", "/signup", "/signin"];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isPostDetail =
    location.pathname.startsWith("/community/") &&
    location.pathname !== "/community";

  const title = isPostDetail
    ? "Post"
    : (PAGE_TITLES[location.pathname] ?? "Arroz con Code");

  const showBack = BACK_ROUTES.includes(location.pathname) || isPostDetail;
  const showFab = location.pathname === "/community";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-full p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        ) : (
          /* Spacer to keep title centered when no back button */
          <div className="w-7" />
        )}
        <h1 className="flex-1 text-center text-base font-semibold text-gray-900">
          {title}
        </h1>
        {/* Spacer to balance the left side */}
        <div className="w-7" />
      </header>

      {/* Page content — pb-20 reserves space for fixed bottom nav */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* FAB — only on /community */}
      {showFab && (
        <Link
          to="/community/new"
          className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"
          aria-label="New post"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Link>
      )}

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-gray-200 bg-white">
        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium ${
              isActive ? "text-indigo-600" : "text-gray-400"
            }`
          }
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          AI Chat
        </NavLink>

        <NavLink
          to="/community"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium ${
              isActive ? "text-indigo-600" : "text-gray-400"
            }`
          }
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Community
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium ${
              isActive ? "text-indigo-600" : "text-gray-400"
            }`
          }
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Profile
        </NavLink>
      </nav>
    </div>
  );
}
