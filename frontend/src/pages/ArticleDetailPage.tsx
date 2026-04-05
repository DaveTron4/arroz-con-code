import { useState } from "react";
import { useParams, Link } from "react-router";
import { usePost, useFactCheck } from "../hooks/useApi";
import ProfessionalBadge from "../components/ProfessionalBadge";
import TranslateButton from "../components/TranslateButton";
import FactCheckBadge from "../components/FactCheckBadge";
import LikeButton from "../components/LikeButton";
import { formatTime } from "../utils/formatTime";

const CATEGORY_COLORS: Record<string, string> = {
  Education: "bg-blue-50 text-blue-700",
  Healthcare: "bg-rose-50 text-rose-700",
  Technology: "bg-violet-50 text-violet-700",
  "New Tech": "bg-violet-50 text-violet-700",
};

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id!);

  const { post, loading, error } = usePost(postId);
  const { factCheck, loading: factCheckLoading } = useFactCheck(postId);
  const [translatedBody, setTranslatedBody] = useState<string | null>(null);

  if (loading) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/4 rounded bg-gray-200" />
          <div className="h-6 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-100" />
          <div className="h-4 w-5/6 rounded bg-gray-100" />
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-sm text-red-600">{error || "Article not found."}</p>
        <Link
          to="/"
          className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
        >
          Back to feed
        </Link>
      </section>
    );
  }

  const authorDisplay =
    post.author_display_name || post.author_username || "Anonymous";
  const initial = authorDisplay.charAt(0).toUpperCase();
  const categoryColor =
    CATEGORY_COLORS[post.category] || "bg-gray-50 text-gray-700";
  const displayBody = translatedBody || post.body;

  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      <Link
        to="/"
        className="mb-6 inline-block text-sm text-indigo-600 hover:underline"
      >
        ← Back to feed
      </Link>

      {/* Category + fact check */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${categoryColor}`}
        >
          {post.category}
        </span>
        {factCheckLoading && <FactCheckBadge loading />}
        {factCheck && (
          <FactCheckBadge
            status={factCheck.status as any}
            confidenceScore={factCheck.confidenceScore}
          />
        )}
      </div>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">{post.title}</h1>

      {/* Author info */}
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
          {initial}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{authorDisplay}</p>
          <ProfessionalBadge />
        </div>
        <span className="ml-auto text-xs text-gray-400">
          {formatTime(post.created_at || post.createdAt)}
        </span>
      </div>

      {post.location_name || post.locationName ? (
        <p className="mt-2 text-xs text-gray-400">
          📍 {post.location_name || post.locationName}
        </p>
      ) : null}

      {/* Actions */}
      <div className="mt-3 flex items-center gap-4">
        <LikeButton postId={postId} />
        <TranslateButton
          postId={postId}
          isTranslated={false}
          onTranslate={async () => {}}
          onTranslated={(body) => setTranslatedBody(body)}
        />
      </div>

      {/* Article body */}
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700">
        <p className="whitespace-pre-wrap">{displayBody}</p>
      </div>
    </section>
  );
}
