import { Request } from 'express';

export interface AuthRequest extends Request {
  locals?: {
    currentUserId?: string;
  };
}
