import { useParams, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../hooks/useApi";
import PostCard from "../components/PostCard";
import ProfessionalBadge from "../components/ProfessionalBadge";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const isOwnProfile = id === "me" || (user && String(user.id) === id);
  const profileUser = isOwnProfile ? user : null;
  const userId = isOwnProfile ? user?.id : id ? parseInt(id) : undefined;

  const { posts, loading: postsLoading } = usePosts(
    userId ? { userId } : undefined
  );

  const displayName = profileUser?.displayName || profileUser?.username || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
          {initial}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
          <div className="mt-1 flex items-center gap-2">
            {profileUser?.role === "professional" ? (
              <ProfessionalBadge />
            ) : (
              <span className="text-sm text-gray-500">Community Member</span>
            )}
            {profileUser?.locationName && (
              <span className="text-sm text-gray-400">
                · 📍 {profileUser.locationName}
              </span>
            )}
          </div>
        </div>
        {isOwnProfile && (
          <Link
            to="/settings"
            className="ml-auto rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Edit Profile
          </Link>
        )}
      </div>

      {/* Posts */}
      <div className="mt-8">
        <h2 className="text-base font-semibold text-gray-900">Posts</h2>

        {postsLoading && (
          <div className="mt-3 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-lg border border-gray-100 p-4">
                <div className="mb-2 h-4 w-1/3 rounded bg-gray-200" />
                <div className="h-4 w-3/4 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {!postsLoading && posts.length === 0 && (
          <p className="mt-3 text-sm text-gray-400">No posts yet.</p>
        )}

        {!postsLoading && posts.length > 0 && (
          <div className="mt-3 divide-y divide-gray-100 rounded-lg border border-gray-100">
            {posts.map((post: any) => (
              <PostCard
                key={post.id}
                post={{
                  id: post.id,
                  title: post.title,
                  body: post.body,
                  category: post.category,
                  createdAt: post.createdAt,
                  authorUsername: post.authorUsername || displayName,
                  authorDisplayName: post.authorDisplayName,
                  locationName: post.locationName,
                  type: post.type,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
