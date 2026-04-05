import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  usePost,
  useComments,
  useCreateComment,
  useFactCheck,
} from "../hooks/useApi";
import { commentsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LikeButton from "../components/LikeButton";
import TranslateButton from "../components/TranslateButton";
import FactCheckBadge from "../components/FactCheckBadge";
import { formatTime } from "../utils/formatTime";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id!);
  const { user, isAuthenticated } = useAuth();

  const { post, loading: postLoading, error: postError } = usePost(postId);
  const {
    comments,
    loading: commentsLoading,
    refetch: refetchComments,
  } = useComments(postId);
  const { createComment, loading: submitting } = useCreateComment();
  const { factCheck, loading: factCheckLoading } = useFactCheck(postId);

  const [commentBody, setCommentBody] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [translatedBody, setTranslatedBody] = useState<string | null>(null);

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setCommentError(null);
    try {
      await createComment(postId, { body: commentBody.trim() });
      setCommentBody("");
      refetchComments();
    } catch (err) {
      setCommentError(
        err instanceof Error ? err.message : "Failed to post comment",
      );
    }
  }

  async function handleDeleteComment(commentId: number) {
    setDeletingId(commentId);
    try {
      await commentsAPI.deleteComment(postId, commentId);
      refetchComments();
    } catch {
      // silently fail — comment stays visible
    } finally {
      setDeletingId(null);
    }
  }

  if (postLoading) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-100" />
          <div className="h-4 w-5/6 rounded bg-gray-100" />
        </div>
      </section>
    );
  }

  if (postError || !post) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-red-600">{postError || "Post not found."}</p>
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
  const displayBody = translatedBody || post.body;

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      {/* Back */}
      <Link
        to="/"
        className="mb-6 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to feed
      </Link>

      {/* Post */}
      <article>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {post.type === "article" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
              📰 Article
            </span>
          )}
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            {post.category}
          </span>
          {factCheckLoading && <FactCheckBadge loading />}
          {factCheck && (
            <FactCheckBadge
              status={factCheck.status as any}
              confidenceScore={factCheck.confidenceScore}
            />
          )}
          <span className="text-xs text-gray-400">
            {authorDisplay} · {formatTime(post.createdAt)}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
        <p className="mt-4 whitespace-pre-wrap text-gray-700">{displayBody}</p>

        {post.locationName ? (
          <p className="mt-3 text-xs text-gray-400">📍 {post.locationName}</p>
        ) : null}

        <div className="mt-4 flex items-center gap-4">
          <LikeButton postId={postId} />
          <TranslateButton
            postId={postId}
            onTranslate={async () => {}}
            onTranslated={(body) => setTranslatedBody(body)}
          />
        </div>
      </article>

      <hr className="my-8 border-gray-200" />

      {/* Comments */}
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {commentsLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-lg bg-gray-50 p-3">
              <div className="mb-2 h-3 w-1/4 rounded bg-gray-200" />
              <div className="h-3 w-3/4 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {!commentsLoading && comments.length === 0 && (
        <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
      )}

      {!commentsLoading && comments.length > 0 && (
        <ul className="space-y-3">
          {comments.map((comment: any) => {
            const isOwn = user && user.id === comment.userId;
            return (
              <li key={comment.id} className="rounded-lg bg-gray-50 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">
                    {comment.displayName || comment.username}
                    <span className="ml-2 font-normal text-gray-400">
                      · {formatTime(comment.createdAt)}
                    </span>
                  </span>
                  {isOwn && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={deletingId === comment.id}
                      className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50"
                    >
                      {deletingId === comment.id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700">{comment.body}</p>
              </li>
            );
          })}
        </ul>
      )}

      {/* Comment input */}
      <div className="mt-6">
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              type="text"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={submitting || !commentBody.trim()}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-500">
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>{" "}
            to leave a comment.
          </p>
        )}
        {commentError && (
          <p className="mt-2 text-xs text-red-600">{commentError}</p>
        )}
      </div>
    </section>
  );
}
