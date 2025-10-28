import { Request, Response } from 'express';
import { User } from '../models/User';
import { Exchange } from '../models/Exchange';
import { Skill } from '../models/Skill';
import { Review } from '../models/Review';

interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

const ADMIN_ID = process.env.ADMIN_ID || 'admin';

const isAdmin = (req: AuthRequest): boolean => {
  return (req as any).userId === ADMIN_ID;
};

export const getDashboard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const totalUsers = await User.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const totalExchanges = await Exchange.countDocuments();
    const completedExchanges = await Exchange.countDocuments({ status: 'completed' });
    const averageRating = await User.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    const recentExchanges = await Exchange.find()
      .populate('initiator', 'firstName lastName')
      .populate('recipient', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(10);

    const topUsers = await User.find()
      .sort({ rating: -1 })
      .limit(10)
      .populate('skills');

    res.status(200).json({
      stats: {
        totalUsers,
        totalSkills,
        totalExchanges,
        completedExchanges,
        successRate: totalExchanges > 0 ? (completedExchanges / totalExchanges) * 100 : 0,
        averageRating: averageRating[0]?.avgRating || 0,
      },
      recentExchanges,
      topUsers,
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const users = await User.find().populate('skills').sort({ createdAt: -1 });

    res.status(200).json(users);
 } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};

export const getUserDetails = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate('skills')
      .populate('exchanges')
      .populate('reviews');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const exchanges = await Exchange.find({
      $or: [{ initiator: userId }, { recipient: userId }],
    });

    res.status(200).json({
      user,
      exchanges,
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
 try {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { userId } = req.params;

    await User.deleteOne({ _id: userId });
    await Skill.deleteMany({ user: userId });
    await Exchange.deleteMany({
      $or: [{ initiator: userId }, { recipient: userId }],
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};

export const getAllExchanges = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const exchanges = await Exchange.find()
      .populate('initiator', 'firstName lastName')
      .populate('recipient', 'firstName lastName')
      .populate('initiatorSkill')
      .populate('recipientSkill')
      .sort({ createdAt: -1 });

    res.status(200).json(exchanges);
  } catch (error) {
    console.error('Get all exchanges error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};

export const getAllSkills = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const skills = await Skill.find()
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json(skills);
  } catch (error) {
    console.error('Get all skills error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};
