import { Request, Response } from 'express';
import { User } from '../models/User';

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
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
 } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (location) user.location = location;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    res.status(200).json({
      users,
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};

export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query) {
      res.status(400).json({ error: 'Search query is required' });
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

    res.status(200).json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};
