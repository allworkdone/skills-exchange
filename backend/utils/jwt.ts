import jwt from 'jsonwebtoken';
import { IJWTPayload } from '../types/index';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (userId: string, email: string): string => {
  const payload: IJWTPayload = {
    userId,
    email,
  };

  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): IJWTPayload | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as IJWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token: string): IJWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as IJWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
