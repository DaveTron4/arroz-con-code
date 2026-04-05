import type { Request, Response } from 'express';
import { pool } from '../config/database.ts';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { FactCheckRequest, FactCheckResult, FactCheckResponse } from '../interfaces/factcheck.interfaces.ts';

// Initialize Gemini API
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Fact-checking system prompt
const FACTCHECK_SYSTEM_PROMPT = `You are an expert fact-checker specializing in education, healthcare, and technology topics. 

Your task is to evaluate claims in posts for accuracy and misinformation. For each claim:

1. Assess the accuracy of the information
2. Provide a status: "verified", "misleading", "false", or "unverifiable"
3. Explain your reasoning clearly
4. Provide a confidence score from 0 to 1 (1 being completely certain)

Format your response as JSON with the following structure:
{
  "status": "verified|misleading|false|unverifiable",
  "result": "detailed explanation of findings",
  "confidenceScore": 0.0-1.0
}

Be fair and balanced. If information is partially true, mark it as "misleading". If something cannot be verified, mark it as "unverifiable".`;

/**
 * Fact-check a post by calling Gemini API
 */
export const factCheckPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId, text, category } = req.body as FactCheckRequest;

    // Validate required fields
    if (!postId || !text || typeof text !== 'string') {
      res.status(400).json({ error: 'postId and text (string) are required' });
      return;
    }

    // Check if post exists
    const postExists = await pool.query(
      'SELECT id FROM posts WHERE id = $1 AND deleted_at IS NULL',
      [postId]
    );

    if (postExists.rows.length === 0) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Check if already fact-checked
    const existing = await pool.query(
      'SELECT id FROM fact_checks WHERE post_id = $1',
      [postId]
    );

    // Prepare the fact-check prompt
    const categoryContext = category && typeof category === 'string' ? `Category: ${category}\n` : '';
    const promptText: string = `${categoryContext}\nPost text to fact-check:\n"${text}"\n\nPlease fact-check this post. ${FACTCHECK_SYSTEM_PROMPT}`;

    // Call Gemini API
    console.log(`🔍 Fact-checking post ${postId} with Gemini...`);
    const result = await model.generateContent(promptText);
    const responseText = result.response.text();

    // Parse Gemini response
    let factCheckResult: FactCheckResult;
    try {
      // Extract JSON from response (Gemini might add extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      factCheckResult = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error('Error parsing Gemini response:', parseErr);
      res.status(500).json({ error: 'Failed to parse fact-check result' });
      return;
    }

    // Validate parsed result
    if (!factCheckResult.status || !factCheckResult.result || factCheckResult.confidenceScore === undefined) {
      console.error('Invalid fact-check result structure:', factCheckResult);
      res.status(500).json({ error: 'Invalid fact-check result from Gemini' });
      return;
    }

    const checkedAt = new Date().toISOString();

    // Update or insert fact-check record
    if (existing.rows.length > 0) {
      // Update existing
      await pool.query(
        `UPDATE fact_checks 
         SET is_fact_checked = true,
             fact_check_status = $1,
             fact_check_result = $2,
             confidence_score = $3,
             checked_at = $4
         WHERE post_id = $5`,
        [factCheckResult.status, factCheckResult.result, factCheckResult.confidenceScore, checkedAt, postId]
      );
    } else {
      // Insert new
      await pool.query(
        `INSERT INTO fact_checks (post_id, original_text, is_fact_checked, fact_check_status, fact_check_result, confidence_score, checked_at)
         VALUES ($1, $2, true, $3, $4, $5, $6)`,
        [postId, text, factCheckResult.status, factCheckResult.result, factCheckResult.confidenceScore, checkedAt]
      );
    }

    // Return result
    res.status(200).json({
      postId,
      isFactChecked: true,
      status: factCheckResult.status,
      result: factCheckResult.result,
      confidenceScore: factCheckResult.confidenceScore,
      checkedAt,
    } as FactCheckResponse);

    console.log(`✅ Fact-check complete for post ${postId}: ${factCheckResult.status}`);
  } catch (err) {
    console.error('Error during fact-checking:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Error details:', errorMessage);
    res.status(500).json({ error: 'An error occurred during fact-checking', details: errorMessage });
  }
};

/**
 * Get fact-check result for a post
 */
export const getFactCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    const postIdParam = Array.isArray(req.params.postId) ? req.params.postId[0] : req.params.postId;
    const postId = parseInt(postIdParam);

    if (!postId || isNaN(postId)) {
      res.status(400).json({ error: 'Valid postId is required' });
      return;
    }

    const result = await pool.query(
      'SELECT id, post_id, is_fact_checked, fact_check_status, fact_check_result, confidence_score, checked_at FROM fact_checks WHERE post_id = $1',
      [postId]
    );

    if (result.rows.length === 0) {
      // Return null/pending fact-check instead of 404
      res.status(200).json({
        postId,
        isFactChecked: false,
        status: null,
        result: null,
        confidenceScore: null,
        checkedAt: null,
      } as FactCheckResponse);
      return;
    }

    const factCheck = result.rows[0];
    res.status(200).json({
      postId: factCheck.post_id,
      isFactChecked: factCheck.is_fact_checked,
      status: factCheck.fact_check_status,
      result: factCheck.fact_check_result,
      confidenceScore: factCheck.confidence_score,
      checkedAt: factCheck.checked_at,
    } as FactCheckResponse);
  } catch (err) {
    console.error('Error fetching fact-check:', err);
    res.status(500).json({ error: 'An error occurred while fetching fact-check' });
  }
};

/**
 * Manually trigger fact-check for a specific post (admin/trigger endpoint)
 */
export const triggerFactCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    const postIdParam = Array.isArray(req.params.postId) ? req.params.postId[0] : req.params.postId;
    const postId = parseInt(postIdParam);

    if (!postId || isNaN(postId)) {
      res.status(400).json({ error: 'Valid postId is required' });
      return;
    }

    // Fetch the post
    const postResult = await pool.query(
      'SELECT id, body, category FROM posts WHERE id = $1 AND deleted_at IS NULL',
      [postId]
    );

    if (postResult.rows.length === 0) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const post = postResult.rows[0];

    // Validate post data - ensure body is a string
    if (!post.body || typeof post.body !== 'string') {
      res.status(400).json({ error: 'Post body is required and must be a string' });
      return;
    }

    // Type-safe references
    const postBody: string = post.body;
    const postCategory: string | null = post.category && typeof post.category === 'string' ? post.category : null;

    // Prepare the fact-check prompt
    const categoryContext = postCategory ? `Category: ${postCategory}\n` : '';
    const promptText: string = `${categoryContext}\nPost text to fact-check:\n"${postBody}"\n\nPlease fact-check this post. ${FACTCHECK_SYSTEM_PROMPT}`;

    // Call Gemini API
    console.log(`🔍 Manually triggering fact-check for post ${postId}...`);
    const result = await model.generateContent(promptText);
    const responseText = result.response.text();

    // Parse Gemini response
    let factCheckResult: FactCheckResult;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      factCheckResult = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error('Error parsing Gemini response:', parseErr);
      res.status(500).json({ error: 'Failed to parse fact-check result' });
      return;
    }

    // Validate parsed result
    if (!factCheckResult.status || !factCheckResult.result || factCheckResult.confidenceScore === undefined) {
      console.error('Invalid fact-check result structure:', factCheckResult);
      res.status(500).json({ error: 'Invalid fact-check result from Gemini' });
      return;
    }

    const checkedAt = new Date().toISOString();

    // Update or insert fact-check record
    const existing = await pool.query(
      'SELECT id FROM fact_checks WHERE post_id = $1',
      [postId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE fact_checks 
         SET is_fact_checked = true,
             fact_check_status = $1,
             fact_check_result = $2,
             confidence_score = $3,
             checked_at = $4
         WHERE post_id = $5`,
        [factCheckResult.status, factCheckResult.result, factCheckResult.confidenceScore, checkedAt, postId]
      );
    } else {
      await pool.query(
        `INSERT INTO fact_checks (post_id, original_text, is_fact_checked, fact_check_status, fact_check_result, confidence_score, checked_at)
         VALUES ($1, $2, true, $3, $4, $5, $6)`,
        [postId, postBody, factCheckResult.status, factCheckResult.result, factCheckResult.confidenceScore, checkedAt]
      );
    }

    res.status(200).json({
      postId,
      isFactChecked: true,
      status: factCheckResult.status,
      result: factCheckResult.result,
      confidenceScore: factCheckResult.confidenceScore,
      checkedAt,
    } as FactCheckResponse);

    console.log(`✅ Manual fact-check triggered for post ${postId}: ${factCheckResult.status}`);
  } catch (err) {
    console.error('Error triggering fact-check:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Error details:', errorMessage);
    res.status(500).json({ error: 'An error occurred while triggering fact-check', details: errorMessage });
  }
};

export default {
  factCheckPost,
  getFactCheck,
  triggerFactCheck,
};
