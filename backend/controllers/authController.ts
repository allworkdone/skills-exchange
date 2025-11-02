import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { successResponse, errorResponse, sendResponse } from '../utils/response';

interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, location } = req.body;

    if (!firstName || !lastName || !email || !password) {
      sendResponse(res, errorResponse('All fields are required', 400));
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendResponse(res, errorResponse('Email already registered', 409));
      return;
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      location: location || '',
    });

    await user.save();

    const token = generateToken(user._id.toString(), user.email);

    sendResponse(res, successResponse({ 
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
      },
    }, 'User registered successfully', 201));
  } catch (error) {
    console.error('Registration error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const login = async (req: Request, res: Response): Promise<void> => {
 try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendResponse(res, errorResponse('Email and password are required', 400));
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      sendResponse(res, errorResponse('Invalid credentials', 401));
      return;
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      sendResponse(res, errorResponse('Invalid credentials', 401));
      return;
    }

    const token = generateToken(user._id.toString(), user.email);

    sendResponse(res, successResponse({ 
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        rating: user.rating,
      },
    }, 'Login successful'));
  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById((req as any).userId).populate('skills').populate('reviews');
    if (!user) {
      sendResponse(res, errorResponse('User not found', 404));
      return;
    }

    sendResponse(res, successResponse({ user }, 'Current user retrieved successfully'));
 } catch (error) {
    console.error('Get user error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};
