import { Link } from "react-router";

export default function FAB() {
  return (
    <Link
      to="/post/new"
      className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-transform md:bottom-6"
      aria-label="Create new post"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      New Post
    </Link>
  );
}
