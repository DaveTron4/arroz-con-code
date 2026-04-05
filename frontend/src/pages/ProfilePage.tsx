import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../hooks/useApi";
import PostCard from "../components/PostCard";
import ProfessionalBadge from "../components/ProfessionalBadge";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser, loading } = useAuth();

  const isOwnProfile = id === "me" || (user && String(user.id) === id);
  const userId = useMemo(() => {
    return isOwnProfile ? user?.id : id ? parseInt(id) : undefined;
  }, [isOwnProfile, user?.id, id]);

  // Redirect to login if viewing own profile and not authenticated
  useEffect(() => {
    if (isOwnProfile && !isAuthenticated) {
      navigate("/login");
    }
  }, [isOwnProfile, isAuthenticated, navigate]);

  const { posts, loading: postsLoading } = usePosts(
    userId ? { userId } : undefined,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(
    user?.displayName || "",
  );
  const [editAvatarUrl, setEditAvatarUrl] = useState(user?.avatarUrl || "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const displayName = user?.displayName || user?.username || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const handleAvatarUrlChange = (url: string) => {
    setEditAvatarUrl(url);
    setAvatarError(null);
    setPreviewUrl(null);

    if (url.trim()) {
      // Validate image URL
      const img = new Image();
      img.onload = () => {
        setPreviewUrl(url);
      };
      img.onerror = () => {
        setAvatarError("Invalid image URL");
      };
      img.src = url;
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setError(null);
    try {
      await updateUser({
        displayName: editDisplayName || user.displayName || undefined,
        avatarUrl: editAvatarUrl || undefined,
      });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditDisplayName(user?.displayName || "");
    setEditAvatarUrl(user?.avatarUrl || "");
    setPreviewUrl(null);
    setAvatarError(null);
    setError(null);
    setIsEditing(false);
  };

  // Show placeholder while redirecting
  if (isOwnProfile && !isAuthenticated) {
    return null;
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      {/* Avatar + name + edit button */}
      <div className="flex items-center gap-4">
        {isEditing && previewUrl ? (
          <img
            src={previewUrl}
            alt={displayName}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={displayName}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
            {initial}
          </div>
        )}

        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  placeholder="Your display name"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  value={editAvatarUrl}
                  onChange={(e) => handleAvatarUrlChange(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {avatarError && (
                  <p className="mt-1 text-xs text-red-600">{avatarError}</p>
                )}
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
              <div className="mt-1 flex items-center gap-2">
                {user?.role === "professional" ? (
                  <ProfessionalBadge />
                ) : (
                  <span className="text-sm text-gray-500">
                    Community Member
                  </span>
                )}
                {user?.locationName && (
                  <span className="text-sm text-gray-400">
                    · 📍 {user.locationName}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {isOwnProfile && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="ml-auto rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Edit
          </button>
        )}
      </div>

      {/* Posts */}
      <div className="mt-8">
        <h2 className="text-base font-semibold text-gray-900">Posts</h2>

        {postsLoading && (
          <div className="mt-3 space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-gray-100 p-4"
              >
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
