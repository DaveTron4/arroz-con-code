/**
 * Authentication Request/Response Interfaces
 */

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface RegisterRequest {
  username?: string;
  password?: string;
  email?: string;
}

export interface TokenPayload {
  id: number;
  username: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
}
