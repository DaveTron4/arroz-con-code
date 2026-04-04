/**
 * Extended Express Request/Response Types
 */

import type { Request as ExpressRequest } from 'express';
import type { TokenPayload } from './auth.interfaces.js';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export interface CustomRequest extends ExpressRequest {
  user?: TokenPayload;
}
