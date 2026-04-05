/**
 * Comment Request/Response Interfaces
 */

export interface CreateCommentRequest {
  body: string;
  imageUrl?: string;
}

export interface UpdateCommentRequest {
  body?: string;
  imageUrl?: string;
}

export interface CommentResponse {
  id: number;
  post_id: number;
  user_id: number;
  body: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CommentWithStats extends CommentResponse {
  like_count: number;
  user_info?: {
    id: number;
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}
