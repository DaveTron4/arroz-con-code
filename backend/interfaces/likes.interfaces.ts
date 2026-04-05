/**
 * Like Request/Response Interfaces
 */

export interface ToggleLikeResponse {
  liked: boolean;
}

export interface GetLikesResponse {
  likeCount: number;
  userLiked: boolean;
}
