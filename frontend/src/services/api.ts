/**
 * API Client for Arroz con Code Backend
 * Handles all HTTP requests to the backend server
 */

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

// Helper function to get JWT token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

// Helper function to make API calls with proper headers
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

/**
 * Authentication Endpoints
 */
export const authAPI = {
  register: (data: {
    username: string;
    email: string;
    password: string;
    latitude?: number;
    longitude?: number;
    locationName?: string;
    preferredLanguage?: "en" | "es";
  }) =>
    apiCall<{
      token: string;
      user: {
        id: number;
        username: string;
        email: string;
        displayName: string | null;
        avatarUrl: string | null;
        role: string;
        latitude: number | null;
        longitude: number | null;
        locationName: string | null;
        preferredLanguage: "en" | "es";
      };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { username: string; password: string }) =>
    apiCall<{
      token: string;
      user: {
        id: number;
        username: string;
        email: string;
        displayName: string | null;
        avatarUrl: string | null;
        role: string;
        latitude: number | null;
        longitude: number | null;
        locationName: string | null;
        preferredLanguage: "en" | "es";
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentUser: () =>
    apiCall<{
      id: number;
      username: string;
      email: string;
      displayName: string | null;
      avatarUrl: string | null;
      role: string;
      latitude: number | null;
      longitude: number | null;
      locationName: string | null;
      preferredLanguage: "en" | "es";
    }>('/auth/me'),

  updateUser: (data: {
    displayName?: string;
    avatarUrl?: string;
    latitude?: number;
    longitude?: number;
    locationName?: string;
  }) =>
    apiCall<{
      id: number;
      username: string;
      email: string;
      displayName: string | null;
      avatarUrl: string | null;
      role: string;
      latitude: number | null;
      longitude: number | null;
      locationName: string | null;
    }>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateLanguagePreference: (preferredLanguage: "en" | "es") =>
    apiCall<{
      id: number;
      username: string;
      preferredLanguage: "en" | "es";
    }>('/auth/language-preference', {
      method: 'PUT',
      body: JSON.stringify({ preferredLanguage }),
    }),
};

/**
 * Posts Endpoints
 */
export const postsAPI = {
  getPosts: (params?: {
    category?: string;
    userId?: number;
    latitude?: number;
    longitude?: number;
    radius?: number;
  }) => {
    const queryStr = params
      ? '?' +
        Object.entries(params)
          .map(([k, v]) => `${k}=${v}`)
          .join('&')
      : '';
    return apiCall<
      Array<{
        id: number;
        userId: number;
        title: string;
        body: string;
        category: string;
        type: string;
        imageUrl: string | null;
        latitude: number | null;
        longitude: number | null;
        locationName: string | null;
        createdAt: string;
        updatedAt: string;
        authorUsername: string;
        authorDisplayName: string | null;
      }>
    >(`/posts${queryStr}`);
  },

  getPostById: (postId: number) =>
    apiCall<{
      id: number;
      userId: number;
      title: string;
      body: string;
      category: string;
      type: string;
      imageUrl: string | null;
      latitude: number | null;
      longitude: number | null;
      locationName: string | null;
      createdAt: string;
      authorUsername: string;
      authorDisplayName: string | null;
      authorAvatarUrl: string | null;
      authorRole: string;
      likeCount: number;
      commentCount: number;
    }>(`/posts/${postId}`),

  createPost: (data: {
    title: string;
    body: string;
    category: string;
    imageUrl?: string;
    latitude?: number;
    longitude?: number;
    locationName?: string;
  }) =>
    apiCall<{ id: number; createdAt: string }>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePost: (postId: number, data: Partial<{
    title: string;
    body: string;
    category: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
    locationName: string;
  }>) =>
    apiCall<{ updatedAt: string }>(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deletePost: (postId: number) =>
    apiCall<{ message: string }>(`/posts/${postId}`, {
      method: 'DELETE',
    }),
};

/**
 * Comments Endpoints
 */
export const commentsAPI = {
  getComments: (postId: number) =>
    apiCall<
      Array<{
        id: number;
        postId: number;
        userId: number;
        username: string;
        displayName: string | null;
        avatarUrl: string | null;
        body: string;
        imageUrl: string | null;
        createdAt: string;
        likeCount: number;
        replyCount: number;
      }>
    >(`/posts/${postId}/comments`),

  createComment: (postId: number, data: { body: string; imageUrl?: string }) =>
    apiCall<{ id: number; createdAt: string }>(
      `/posts/${postId}/comments`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  updateComment: (postId: number, commentId: number, data: { body: string }) =>
    apiCall<{ updatedAt: string }>(
      `/posts/${postId}/comments/${commentId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    ),

  deleteComment: (postId: number, commentId: number) =>
    apiCall<{ message: string }>(
      `/posts/${postId}/comments/${commentId}`,
      {
        method: 'DELETE',
      }
    ),
};

/**
 * Likes Endpoints
 */
export const likesAPI = {
  togglePostLike: (postId: number) =>
    apiCall<{ liked: boolean }>(`/posts/${postId}/like`, {
      method: 'POST',
    }),

  toggleCommentLike: (postId: number, commentId: number) =>
    apiCall<{ liked: boolean }>(
      `/posts/${postId}/comments/${commentId}/like`,
      {
        method: 'POST',
      }
    ),

  getPostLikes: (postId: number) =>
    apiCall<{ likeCount: number; userLiked: boolean }>(
      `/posts/${postId}/likes`
    ),
};

/**
 * Fact-Check Endpoints
 */
export const factCheckAPI = {
  factCheckPost: (data: {
    postId: number;
    text: string;
    category?: string;
  }) =>
    apiCall<{
      postId: number;
      isFactChecked: boolean;
      status: string;
      result: string;
      confidenceScore: number;
      checkedAt: string;
    }>('/fact-checks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getFactCheck: (postId: number) =>
    apiCall<{
      postId: number;
      isFactChecked: boolean;
      status: string | null;
      result: string | null;
      confidenceScore: number | null;
      checkedAt: string | null;
    }>(`/fact-checks/${postId}`),

  triggerFactCheck: (postId: number) =>
    apiCall<{
      postId: number;
      isFactChecked: boolean;
      status: string | null;
      result: string | null;
      confidenceScore: number | null;
    }>(`/fact-checks/${postId}/trigger`, {
      method: 'POST',
    }),
};

/**
 * Translation Endpoints
 */
export const translationAPI = {
  translatePost: (data: {
    postId: number;
    targetLanguage: 'es' | 'en';
  }) =>
    apiCall<{
      postId: number;
      originalLanguage: string;
      originalText: string;
      translatedLanguage: string;
      translatedText: string;
      createdAt: string;
    }>('/translations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getTranslation: (postId: number, language: 'es' | 'en') =>
    apiCall<{
      postId: number;
      originalLanguage: string;
      originalText: string;
      translatedLanguage: string;
      translatedText: string;
      createdAt: string;
    }>(`/translations/${postId}?language=${language}`),
};

/**
 * Location Endpoints
 */
export const locationsAPI = {
  search: (params: {
    query: string;
    latitude?: number;
    longitude?: number;
  }) => {
    const queryStr =
      '?' +
      Object.entries(params)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
    return apiCall<Array<any>>(`/locations/search${queryStr}`);
  },

  aiSearch: (data: {
    query: string;
    latitude?: number;
    longitude?: number;
  }) =>
    apiCall<{
      query: string;
      keywords: string[];
      results: Array<{
        place_id: string;
        display_name: string;
        lat: string;
        lon: string;
        address: Record<string, string>;
        type: string;
        category: string;
      }>;
    }>('/locations/ai-search', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getSearchHistory: () =>
    apiCall<
      Array<{
        id: number;
        query: string;
        latitude: number;
        longitude: number;
        results: any;
        createdAt: string;
      }>
    >('/locations/history'),
};
