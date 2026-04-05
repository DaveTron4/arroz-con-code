/**
 * Translation Request/Response Interfaces
 */

export interface TranslateRequest {
  postId: number;
  targetLanguage: 'es' | 'en';
}

export interface TranslationResponse {
  postId: number;
  originalLanguage: 'en' | 'es';
  originalText: string;
  translatedLanguage: 'en' | 'es';
  translatedText: string;
  createdAt: string;
}

export interface LibreTranslateRequest {
  q: string;
  source: string;
  target: string;
}

export interface LibreTranslateResponse {
  translatedText: string;
}
