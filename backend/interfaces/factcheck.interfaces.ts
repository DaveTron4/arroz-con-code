/**
 * Fact-Check Request/Response Interfaces
 */

export interface FactCheckRequest {
  postId: number;
  text: string;
  category?: 'Education' | 'Healthcare' | 'New Tech';
}

export interface FactCheckResponse {
  postId: number;
  isFactChecked: boolean;
  status: 'verified' | 'misleading' | 'false' | 'unverifiable';
  result: string;
  confidenceScore: number; // 0-1
  checkedAt: string;
}

export interface FactCheckResult {
  status: 'verified' | 'misleading' | 'false' | 'unverifiable';
  result: string;
  confidenceScore: number;
}
