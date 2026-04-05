/**
 * LikeButton Component
 * Toggle like on posts and comments
 */

import { useState, useEffect } from 'react';
import { useLike, usePostLikes } from '../hooks/useApi';

interface LikeButtonProps {
  postId: number;
  initialLiked?: boolean;
  initialCount?: number;
}

export default function LikeButton({
  postId,
  initialLiked = false,
  initialCount = 0,
}: LikeButtonProps) {
  const { togglePostLike, loading: togglingLike } = useLike();
  const { likeCount: fetchedCount, userLiked: fetchedLiked, loading: fetchingLikes } = usePostLikes(postId);
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);

  // Sync fetched like data when it changes
  useEffect(() => {
    if (!fetchingLikes) {
      setLiked(fetchedLiked);
      setCount(fetchedCount);
    }
  }, [fetchedCount, fetchedLiked, fetchingLikes]);

  const loading = togglingLike || fetchingLikes;

  const handleClick = async () => {
    if (loading) return;

    setError(null);
    try {
      const result = await togglePostLike(postId);
      setLiked(result.liked);
      setCount(prev => (result.liked ? prev + 1 : Math.max(0, prev - 1)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update like');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
          liked
            ? 'bg-red-50 text-red-600 hover:bg-red-100'
            : 'text-gray-500 hover:bg-gray-100'
        } disabled:opacity-50`}
        title={error || undefined}
      >
        <span className={liked ? '♥' : '♡'}>
          {liked ? '♥' : '♡'}
        </span>
        <span>{count > 0 ? count : ''}</span>
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
