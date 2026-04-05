import type { Request, Response } from 'express';
import { pool } from '../config/database.ts';
import axios from 'axios';
import type { TranslateRequest, TranslationResponse, LibreTranslateRequest, LibreTranslateResponse } from '../interfaces/translation.interfaces.ts';

// LibreTranslate API endpoint (free, open-source)
const LIBRETRANSLATE_URL = 'https://libretranslate.de/translate';

// Language code mapping
const LANGUAGE_MAP: Record<string, string> = {
  'es': 'es',
  'en': 'en',
};

/**
 * Detect the language of a post
 * Simple heuristic: check for Spanish characters or words
 */
const detectLanguage = (text: string): 'en' | 'es' => {
  // Common Spanish words and characters
  const spanishWords = [
    'el', 'la', 'de', 'y', 'que', 'es', 'en', 'por', 'con', 'para',
    'una', 'los', 'como', 'está', 'pero', 'más', 'sido', 'fue', 'ó', 'á', 'é', 'í', 'ú', 'ñ'
  ];
  
  const lowerText = text.toLowerCase();
  
  // Check for Spanish-specific characters
  if (/[áéíóúñ¿¡]/i.test(text)) {
    return 'es';
  }
  
  // Count Spanish words
  const words = lowerText.split(/\s+/);
  const spanishWordCount = words.filter(word => spanishWords.includes(word)).length;
  
  // If more than 30% of words are common Spanish words, likely Spanish
  if (words.length > 0 && spanishWordCount / words.length > 0.3) {
    return 'es';
  }
  
  return 'en';
};

/**
 * Translate a post
 */
export const translatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId, targetLanguage } = req.body as TranslateRequest;

    // Validate required fields
    if (!postId || !targetLanguage || !['es', 'en'].includes(targetLanguage)) {
      res.status(400).json({ error: 'postId and targetLanguage (es or en) are required' });
      return;
    }

    // Check if post exists
    const postResult = await pool.query(
      'SELECT id, body FROM posts WHERE id = $1 AND deleted_at IS NULL',
      [postId]
    );

    if (postResult.rows.length === 0) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const post = postResult.rows[0];
    const postBody = post.body as string;

    // Detect original language
    const originalLanguage = detectLanguage(postBody);

    // Check if already translated to target language
    const existingTranslation = await pool.query(
      'SELECT id FROM translations WHERE post_id = $1 AND translated_language = $2',
      [postId, targetLanguage]
    );

    if (existingTranslation.rows.length > 0) {
      // Return existing translation
      const existing = await pool.query(
        'SELECT post_id, original_language, original_text, translated_language, translated_text, created_at FROM translations WHERE post_id = $1 AND translated_language = $2',
        [postId, targetLanguage]
      );

      const translation = existing.rows[0];
      res.status(200).json({
        postId: translation.post_id,
        originalLanguage: translation.original_language,
        originalText: translation.original_text,
        translatedLanguage: translation.translated_language,
        translatedText: translation.translated_text,
        createdAt: translation.created_at,
      } as TranslationResponse);
      return;
    }

    // If target language is same as original, no need to translate
    if (originalLanguage === targetLanguage) {
      res.status(400).json({ error: 'Post is already in the target language' });
      return;
    }

    // Call LibreTranslate API
    console.log(`🌐 Translating post ${postId} from ${originalLanguage} to ${targetLanguage}...`);
    
    try {
      const response = await axios.post<LibreTranslateResponse>(
        LIBRETRANSLATE_URL,
        {
          q: postBody,
          source: LANGUAGE_MAP[originalLanguage],
          target: LANGUAGE_MAP[targetLanguage],
        } as LibreTranslateRequest
      );

      const translatedText = response.data.translatedText as string;

      // Store translation in database
      const insertResult = await pool.query(
        `INSERT INTO translations (post_id, original_language, original_text, translated_language, translated_text)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING post_id, original_language, original_text, translated_language, translated_text, created_at`,
        [postId, originalLanguage, postBody, targetLanguage, translatedText]
      );

      const translation = insertResult.rows[0];
      res.status(201).json({
        postId: translation.post_id,
        originalLanguage: translation.original_language,
        originalText: translation.original_text,
        translatedLanguage: translation.translated_language,
        translatedText: translation.translated_text,
        createdAt: translation.created_at,
      } as TranslationResponse);

      console.log(`✅ Translation complete for post ${postId}`);
    } catch (apiErr) {
      console.error('Error calling LibreTranslate API:', apiErr);
      res.status(500).json({ error: 'Failed to translate post' });
    }
  } catch (err) {
    console.error('Error during translation:', err);
    res.status(500).json({ error: 'An error occurred during translation' });
  }
};

/**
 * Get translation for a post
 */
export const getTranslation = async (req: Request, res: Response): Promise<void> => {
  try {
    const postIdParam = Array.isArray(req.params.postId) ? req.params.postId[0] : req.params.postId;
    const postId = parseInt(postIdParam);
    const targetLanguage = (req.query.language as string) || 'es';

    if (!postId || isNaN(postId) || !['es', 'en'].includes(targetLanguage)) {
      res.status(400).json({ error: 'Valid postId and language (es or en) are required' });
      return;
    }

    const result = await pool.query(
      'SELECT post_id, original_language, original_text, translated_language, translated_text, created_at FROM translations WHERE post_id = $1 AND translated_language = $2',
      [postId, targetLanguage]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'No translation found for this post in the requested language' });
      return;
    }

    const translation = result.rows[0];
    res.status(200).json({
      postId: translation.post_id,
      originalLanguage: translation.original_language,
      originalText: translation.original_text,
      translatedLanguage: translation.translated_language,
      translatedText: translation.translated_text,
      createdAt: translation.created_at,
    } as TranslationResponse);
  } catch (err) {
    console.error('Error fetching translation:', err);
    res.status(500).json({ error: 'An error occurred while fetching translation' });
  }
};

export default {
  translatePost,
  getTranslation,
};
