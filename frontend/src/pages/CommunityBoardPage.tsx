import { Link } from "react-router";

const CATEGORIES = ["All", "Education", "Healthcare", "New Tech"] as const;

export default function CommunityBoardPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-6">
      {/* Category filter — "New Post" moved to FAB in AppLayout */}
      <div className="mb-6 flex gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className="rounded-full border border-gray-300 px-4 py-1 text-sm text-gray-600 hover:border-indigo-500 hover:text-indigo-600"
          >
            {cat}
          </button>
        ))}
      </div>

      <ul className="flex flex-col gap-4">
        {[1, 2, 3].map((n) => (
          <li key={n} className="rounded-lg border border-gray-200 p-4">
            <Link
              to={`/community/${n}`}
              className="text-base font-semibold text-gray-900 hover:text-indigo-600"
            >
              Sample Post Title {n}
            </Link>
            <p className="mt-1 text-sm text-gray-500">
              Category · 2 comments · 1h ago
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
