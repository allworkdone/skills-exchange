import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { errorResponse, sendResponse } from '../utils/response';
import { AuthRequest } from '../types';

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = (req.headers as any)['authorization'] as string;
  const token = authHeader ? authHeader.split(' ')[1] : undefined;

  if (!token) {
    sendResponse(res, errorResponse('No token provided', 401));
    return;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    sendResponse(res, errorResponse('Invalid or expired token', 401));
    return;
  }

  req.userId = decoded.userId;
  req.email = decoded.email;
  next();
};
