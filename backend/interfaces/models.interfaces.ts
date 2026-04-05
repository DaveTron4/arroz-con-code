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
  role: 'regular' | 'professional';
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
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
  type: 'post' | 'article';
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
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

export interface TranslationModel {
  id: number;
  post_id: number;
  original_language: 'en' | 'es';
  original_text: string;
  translated_language: 'en' | 'es';
  translated_text: string;
  created_at: string;
}

export interface LocationSearchModel {
  id: number;
  user_id: number | null;
  query: string;
  latitude: number;
  longitude: number;
  results: any; // JSONB results from OpenStreetMap
  created_at: string;
}
