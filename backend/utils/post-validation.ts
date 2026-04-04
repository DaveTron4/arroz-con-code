/**
 * Post and Content Validation Utilities
 */

import type { CreateArticleValidator } from '../interfaces/index.js';

/**
 * Validate if a user can create an article (only professionals allowed)
 * @param userRole - The role of the user ('regular' or 'professional')
 * @returns Object with isAllowed boolean and optional reason
 */
export const validateArticleCreation = (userRole: string): CreateArticleValidator => {
  if (userRole !== 'professional') {
    return {
      isAllowed: false,
      reason: 'Only professional users can create articles. Regular users can create posts.',
    };
  }

  return {
    isAllowed: true,
  };
};

/**
 * Validate post type and role match
 * @param postType - The type of post ('post' or 'article')
 * @param userRole - The role of the user ('regular' or 'professional')
 * @returns Object with isAllowed boolean and optional reason
 */
export const validatePostTypeAndRole = (
  postType: string,
  userRole: string
): CreateArticleValidator => {
  if (postType === 'article' && userRole !== 'professional') {
    return {
      isAllowed: false,
      reason: 'Only professional users can create articles',
    };
  }

  return {
    isAllowed: true,
  };
};

/**
 * Validate post title
 */
export const validatePostTitle = (title: string): string | null => {
  if (!title || title.trim().length === 0) {
    return 'Title is required';
  }
  if (title.length < 5) {
    return 'Title must be at least 5 characters long';
  }
  if (title.length > 255) {
    return 'Title must be less than 255 characters';
  }
  return null;
};

/**
 * Validate post body
 */
export const validatePostBody = (body: string): string | null => {
  if (!body || body.trim().length === 0) {
    return 'Post content is required';
  }
  if (body.length < 10) {
    return 'Content must be at least 10 characters long';
  }
  if (body.length > 10000) {
    return 'Content must be less than 10,000 characters';
  }
  return null;
};

/**
 * Validate post category
 */
export const validatePostCategory = (
  category: string
): string | null => {
  const validCategories = ['Education', 'Healthcare', 'New Tech'];
  if (!category || !validCategories.includes(category)) {
    return `Category must be one of: ${validCategories.join(', ')}`;
  }
  return null;
};

/**
 * Validate post type
 */
export const validatePostType = (type: string): string | null => {
  const validTypes = ['post', 'article'];
  if (type && !validTypes.includes(type)) {
    return `Type must be one of: ${validTypes.join(', ')}`;
  }
  return null;
};
