import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePosts } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import ArticleCard from "../components/ArticleCard";

import type { FeedCategory } from "../types";
type Category = FeedCategory;
const CATEGORIES: Category[] = ["All", "Education", "Healthcare", "New Tech"];

export default function FeedPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [locationDenied, setLocationDenied] = useState(false);

  // Fetch posts with active category filter
  const { posts, loading, error, refetch } = usePosts(
    activeCategory !== "All" ? { category: activeCategory } : undefined,
  );

  // Get user's geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Location acquired successfully
        },
        () => {
          setLocationDenied(true);
        },
      );
    }
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      {/* Location fallback */}
      {locationDenied && (
        <div className="flex items-center gap-2 border-b border-gray-100 bg-amber-50 px-4 py-3">
          <span className="text-xs text-amber-700">
            📍 Location not available
          </span>
          <button
            onClick={() => navigate("/post/new")}
            className="ml-auto text-xs font-medium text-amber-700 hover:underline"
          >
            Create post
          </button>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 px-4 py-3 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="m-4 rounded-md bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Failed to load posts</p>
          <p className="mt-1 text-xs">{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-xs font-medium text-red-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && !posts.length && (
        <div className="space-y-4 p-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-b border-gray-100 px-4 py-4 animate-pulse"
            >
              <div className="mb-2 flex gap-2">
                <div className="h-6 w-20 rounded-full bg-gray-200" />
                <div className="h-6 flex-1 rounded-full bg-gray-200" />
              </div>
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !posts.length && (
        <div className="p-8 text-center">
          <p className="mb-2 text-sm font-medium text-gray-600">
            No posts found
          </p>
          <p className="text-xs text-gray-400">
            {activeCategory === "All"
              ? "Be the first to share something!"
              : `No posts in ${activeCategory} yet`}
          </p>
          {user && (
            <button
              onClick={() => navigate("/post/new")}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create first post
            </button>
          )}
        </div>
      )}

      {/* Feed items — real posts from API */}
      <div>
        {posts.map((post: any) => {
          // Differentiate between articles (professionals) and regular posts
          if (post.type === "article") {
            return (
              <ArticleCard
                key={post.id}
                post={{
                  id: post.id,
                  title: post.title,
                  body: post.body,
                  category: post.category as any,
                  createdAt: post.createdAt,
                  authorUsername: post.authorUsername || "Anonymous",
                  authorDisplayName: post.authorDisplayName,
                  locationName: post.locationName,
                  type: post.type,
                }}
                isVerified={true}
              />
            );
          }

          return (
            <PostCard
              key={post.id}
              post={{
                id: post.id,
                title: post.title,
                body: post.body,
                category: post.category as any,
                createdAt: post.createdAt,
                authorUsername: post.authorUsername || "Anonymous",
                authorDisplayName: post.authorDisplayName,
                locationName: post.locationName,
                type: post.type,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
