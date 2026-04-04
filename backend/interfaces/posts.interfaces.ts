/**
 * Post Request/Response Interfaces
 */

export interface CreatePostRequest {
  title?: string;
  body?: string;
  category?: 'Education' | 'Healthcare' | 'New Tech';
  type?: 'post' | 'article';
  imageUrl?: string;
}

export interface UpdatePostRequest {
  title?: string;
  body?: string;
  category?: string;
  imageUrl?: string;
}

export interface PostResponse {
  id: number;
  userId: number;
  title: string;
  body: string;
  category: 'Education' | 'Healthcare' | 'New Tech';
  type: 'post' | 'article';
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleValidator {
  isAllowed: boolean;
  reason?: string;
}
