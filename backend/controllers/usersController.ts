import { Request, Response } from 'express';
import { User } from '../models/User';
import { successResponse, errorResponse, sendResponse } from '../utils/response';

interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate('skills')
      .populate({
        path: 'reviews',
        select: 'rating comment',
      });

    if (!user) {
      sendResponse(res, errorResponse('User not found', 404));
      return;
    }

    sendResponse(res, successResponse(user, 'User profile retrieved successfully'));
 } catch (error) {
    console.error('Get user profile error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const updateProfile = async (
 req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, bio, location, profilePicture } = req.body;

    const user = await User.findById((req as any).userId);
    if (!user) {
      sendResponse(res, errorResponse('User not found', 404));
      return;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (location) user.location = location;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    sendResponse(res, successResponse({ user }, 'Profile updated successfully'));
  } catch (error) {
    console.error('Update profile error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { limit = '20', offset = '0' } = req.query;

    const users = await User.find()
      .populate('skills')
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    sendResponse(res, successResponse({ 
      users, 
      total, 
      limit: Number(limit), 
      offset: Number(offset) 
    }, 'Users retrieved successfully'));
  } catch (error) {
    console.error('Get all users error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query) {
      sendResponse(res, errorResponse('Search query is required', 400));
      return;
    }

    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ],
    }).populate('skills');

    sendResponse(res, successResponse(users, 'Users searched successfully'));
  } catch (error) {
    console.error('Search users error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};
