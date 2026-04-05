import { useParams } from "react-router";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();

  // TODO: fetch user profile from API using id
  const isOwnProfile = id === "me";

  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
          U
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Display Name</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-gray-500">Community Member</span>
            {/* Swap above with <ProfessionalBadge /> for verified professionals */}
          </div>
        </div>
        {isOwnProfile && (
          <a
            href="/settings"
            className="ml-auto rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Edit Profile
          </a>
        )}
      </div>

      {/* Bio */}
      <p className="mt-5 text-sm text-gray-600">
        Bio goes here. This user hasn't written a bio yet.
      </p>

      {/* Post/article history */}
      <div className="mt-8">
        <h2 className="text-base font-semibold text-gray-900">Posts</h2>
        <p className="mt-3 text-sm text-gray-400">
          No posts yet.
        </p>
      </div>
    </section>
  );
}
