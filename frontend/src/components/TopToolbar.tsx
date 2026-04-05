import { Link } from "react-router";

export default function TopToolbar() {
  return (
    <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 md:hidden">
      <input
        type="search"
        placeholder="Search..."
        className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
      />
      <Link to="/profile/me" aria-label="View profile">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </Link>
    </header>
  );
}
