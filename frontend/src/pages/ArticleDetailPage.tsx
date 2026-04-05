import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { usePost, useFactCheck } from "../hooks/useApi";
import ProfessionalBadge from "../components/ProfessionalBadge";
import TranslateButton from "../components/TranslateButton";
import FactCheckBadge from "../components/FactCheckBadge";
import LikeButton from "../components/LikeButton";
import { formatTime } from "../utils/formatTime";
import type { Category } from "../types";
import { factCheckAPI } from "../services/api";

import { CATEGORY_COLORS } from "../utils/categories";

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id!);

  const { post, loading, error } = usePost(postId);
  const {
    factCheck,
    loading: factCheckLoading,
    refetch: refetchFactCheck,
  } = useFactCheck(postId);
  const [translatedBody, setTranslatedBody] = useState<string | null>(null);

  // Auto-trigger fact-check if not yet checked
  // Must be before early returns to avoid hook order issues
  useEffect(() => {
    if (factCheck && !factCheck.isFactChecked && postId) {
      // Trigger fact-check and refetch results
      factCheckAPI
        .triggerFactCheck(postId)
        .then(() => {
          // Refetch fact-check data after triggering
          setTimeout(() => refetchFactCheck(), 500);
        })
        .catch(() => {
          console.log(
            "Fact-check trigger started (results will update when available)",
          );
        });
    }
  }, [factCheck?.isFactChecked, postId, refetchFactCheck]);

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
          className="mt-4 inline-block text-sm text-blue-600 hover:underline"
        >
          Back to feed
        </Link>
      </section>
    );
  }

  const authorDisplay =
    post.authorDisplayName || post.authorUsername || "Anonymous";
  const initial = authorDisplay.charAt(0).toUpperCase();
  const categoryColor =
    CATEGORY_COLORS[post.category as Category] || "bg-gray-50 text-gray-700";
  const displayBody = translatedBody || post.body;

  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      <Link
        to="/"
        className="mb-6 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to feed
      </Link>

      {/* Category + fact check */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
          📰 Article
        </span>
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
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
          {initial}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{authorDisplay}</p>
          <ProfessionalBadge />
        </div>
        <span className="ml-auto text-xs text-gray-400">
          {formatTime(post.createdAt)}
        </span>
      </div>

      {post.locationName ? (
        <p className="mt-2 text-xs text-gray-400">📍 {post.locationName}</p>
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
