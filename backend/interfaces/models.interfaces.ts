/**
 * Database Model Interfaces
 */

export interface UserModel {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PostModel {
  id: number;
  user_id: number;
  title: string;
  body: string;
  category: 'Education' | 'Healthcare' | 'New Tech';
  image_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CommentModel {
  id: number;
  post_id: number;
  user_id: number;
  body: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ReplyModel {
  id: number;
  comment_id: number;
  user_id: number;
  body: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface LikeModel {
  id: number;
  user_id: number;
  post_id: number | null;
  comment_id: number | null;
  reply_id: number | null;
  created_at: string;
}

export interface ChatMessageModel {
  id: number;
  user_id: number | null;
  session_id: string | null;
  user_message: string;
  ai_response: string;
  language: 'en' | 'es';
  category: string | null;
  user_feedback: string | null;
  created_at: string;
}

export interface FactCheckModel {
  id: number;
  post_id: number;
  original_text: string;
  is_fact_checked: boolean;
  fact_check_status: 'verified' | 'misleading' | 'false' | 'unverifiable' | null;
  fact_check_result: string | null;
  confidence_score: number | null;
  checked_at: string | null;
  created_at: string;
}

export interface ResourceModel {
  id: number;
  category: 'Education' | 'Healthcare' | 'New Tech';
  title: string;
  url: string;
  description: string | null;
  language: 'en' | 'es';
  priority: number;
  created_at: string;
  updated_at: string;
}
