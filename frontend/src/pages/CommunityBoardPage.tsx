import { useState, useEffect } from "react";
import { usePosts } from "../hooks/useApi";
import PostCard from "../components/PostCard";

import type { FeedCategory } from "../types";
type Category = FeedCategory;
const CATEGORIES: Category[] = ["All", "Education", "Healthcare", "New Tech"];

export default function CommunityBoardPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const { posts, loading, error, refetch } = usePosts(
    activeCategory !== "All" ? { category: activeCategory } : undefined,
  );

  return (
    <section className="mx-auto max-w-3xl px-4 py-6">
      {/* Category filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-1 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "border border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-blue-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Failed to load posts</p>
          <button
            onClick={() => refetch()}
            className="mt-1 text-xs font-medium text-red-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && !posts.length && (
        <ul className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="animate-pulse rounded-lg border border-gray-200 p-4"
            >
              <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
              <div className="h-4 w-3/4 rounded bg-gray-100" />
            </li>
          ))}
        </ul>
      )}

      {/* Empty */}
      {!loading && !posts.length && (
        <p className="text-sm text-gray-400">
          {activeCategory === "All"
            ? "No posts yet."
            : `No posts in ${activeCategory} yet.`}
        </p>
      )}

      {/* Posts */}
      {!loading && posts.length > 0 && (
        <ul className="flex flex-col gap-4">
          {posts.map((post: any) => (
            <li
              key={post.id}
              className="rounded-lg border border-gray-200 overflow-hidden"
            >
              <PostCard
                post={{
                  id: post.id,
                  title: post.title,
                  body: post.body,
                  category: post.category,
                  createdAt: post.createdAt,
                  authorUsername: post.authorUsername || "Anonymous",
                  authorDisplayName: post.authorDisplayName,
                  locationName: post.locationName,
                  type: post.type,
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
