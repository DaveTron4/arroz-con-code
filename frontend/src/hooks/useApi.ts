/**
 * Custom hooks for API operations
 */

import { useState, useEffect, useCallback } from "react";
import {
  postsAPI,
  commentsAPI,
  likesAPI,
  factCheckAPI,
  translationAPI,
} from "../services/api";

/**
 * Hook for fetching posts with filters
 */
export function usePosts(params?: {
  category?: string;
  userId?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
}) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postsAPI.getPosts(params);
      setPosts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch posts";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}

/**
 * Hook for fetching a single post
 */
export function usePost(postId?: number) {
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(!!postId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setPost(null);
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await postsAPI.getPostById(postId);
        setPost(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch post";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return { post, loading, error };
}

/**
 * Hook for fetching comments
 */
export function useComments(postId: number) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await commentsAPI.getComments(postId);
      setComments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch comments";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, refetch: fetchComments };
}

/**
 * Hook for creating a post
 */
export function useCreatePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = useCallback(
    async (data: {
      title: string;
      body: string;
      category: string;
      imageUrl?: string;
      latitude?: number;
      longitude?: number;
      locationName?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await postsAPI.createPost(data);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create post";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createPost, loading, error };
}

/**
 * Hook for creating a comment
 */
export function useCreateComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createComment = useCallback(
    async (postId: number, data: { body: string; imageUrl?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await commentsAPI.createComment(postId, data);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create comment";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createComment, loading, error };
}

/**
 * Hook for toggling likes
 */
export function useLike() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePostLike = useCallback(async (postId: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await likesAPI.togglePostLike(postId);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to toggle like";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleCommentLike = useCallback(
    async (postId: number, commentId: number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await likesAPI.toggleCommentLike(postId, commentId);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to toggle like";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { togglePostLike, toggleCommentLike, loading, error };
}

/**
 * Hook for getting fact-check results
 */
export function useFactCheck(postId: number) {
  const [factCheck, setFactCheck] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFactCheck = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await factCheckAPI.getFactCheck(postId);
        setFactCheck(data);
      } catch (err) {
        // Fact check might not exist yet, that's ok
        setFactCheck(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFactCheck();
  }, [postId]);

  return { factCheck, loading, error };
}

/**
 * Hook for getting translations
 */
export function useTranslation(postId: number, language: "es" | "en") {
  const [translation, setTranslation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranslation = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await translationAPI.getTranslation(postId, language);
        setTranslation(data);
      } catch (err) {
        // Translation might not exist yet, that's ok
        setTranslation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslation();
  }, [postId, language]);

  return { translation, loading, error };
}

/**
 * Hook for translating a post
 */
export function useTranslatePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(
    async (postId: number, targetLanguage: "es" | "en") => {
      setLoading(true);
      setError(null);
      try {
        const result = await translationAPI.translatePost({
          postId,
          targetLanguage,
        });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to translate";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { translate, loading, error };
}
