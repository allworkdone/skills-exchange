import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = (req.headers as any)['authorization'] as string;
  const token = authHeader ? authHeader.split(' ')[1] : undefined;

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

 const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  (req as any).userId = decoded.userId;
  (req as any).email = decoded.email;
  next();
};
