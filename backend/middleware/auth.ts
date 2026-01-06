import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { errorResponse } from '../utils/response';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = (req.headers as any)['authorization'] as string;
  const token = authHeader ? authHeader.split(' ')[1] : undefined;

  if (!token) {
    errorResponse('No token provided', 401);
    return;
  }

 const decoded = verifyToken(token);

  if (!decoded) {
    errorResponse('Invalid or expired token', 401);
    return;
  }

  (req as any).userId = decoded.userId;
  (req as any).email = decoded.email;
  next();
};
