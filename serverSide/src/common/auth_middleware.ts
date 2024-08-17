import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user_model';
import { AuthRequest } from '../models/request';

export interface CustomRequest extends AuthRequest {
  user?: { _id: string };
}

const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('missing authorization header');

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).send('missing authorization token');

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user: IUser) => {
      if (err) {
        // console.error('Token Verification Error:', err);
        return res.status(401).json({ error: 'Token is not valid' });
      }

      req.user = user as { _id: string };
      req.locals = req.locals || {};
      req.locals.currentUserId = user._id as string;
      next();
    });
  } catch (err) {
    console.error('Unexpected Error:', err);
    res.status(500).send('Internal Server Error');
  }
};

export default authMiddleware;
