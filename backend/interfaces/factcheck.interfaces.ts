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
  status: 'verified' | 'misleading' | 'false' | 'unverifiable' | null;
  result: string | null;
  confidenceScore: number | null;
  checkedAt: string | null;
}

export interface FactCheckResult {
  status: 'verified' | 'misleading' | 'false' | 'unverifiable';
  result: string;
  confidenceScore: number;
}
