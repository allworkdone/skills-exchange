import { Request, Response } from 'express';
import { User } from '../models/User';
import { Exchange } from '../models/Exchange';
import { Skill } from '../models/Skill';
import { Review } from '../models/Review';
import { successResponse, errorResponse, sendResponse } from '../utils/response';

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
      sendResponse(res, errorResponse('Unauthorized', 403));
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

    sendResponse(res, successResponse({ 
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
    }, 'Dashboard data retrieved successfully'));
  } catch (error) {
    console.error('Get dashboard error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
  }
};

export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isAdmin(req)) {
      sendResponse(res, errorResponse('Unauthorized', 403));
      return;
    }

    const users = await User.find().populate('skills').sort({ createdAt: -1 });

    sendResponse(res, successResponse({ users }, 'Users retrieved successfully'));
 } catch (error) {
    console.error('Get all users error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const getUserDetails = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isAdmin(req)) {
      sendResponse(res, errorResponse('Unauthorized', 403));
      return;
    }

    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate('skills')
      .populate('exchanges')
      .populate('reviews');

    if (!user) {
      sendResponse(res, errorResponse('User not found', 404));
      return;
    }

    const exchanges = await Exchange.find({
      $or: [{ initiator: userId }, { recipient: userId }],
    });

    sendResponse(res, successResponse({ 
      user,
      exchanges,
    }, 'User details retrieved successfully'));
  } catch (error) {
    console.error('Get user details error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
 try {
    if (!isAdmin(req)) {
      sendResponse(res, errorResponse('Unauthorized', 403));
      return;
    }

    const { userId } = req.params;

    await User.deleteOne({ _id: userId });
    await Skill.deleteMany({ user: userId });
    await Exchange.deleteMany({
      $or: [{ initiator: userId }, { recipient: userId }],
    });

    sendResponse(res, successResponse({ message: 'User deleted successfully' }, 'User deleted successfully'));
  } catch (error) {
    console.error('Delete user error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const getAllExchanges = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isAdmin(req)) {
      sendResponse(res, errorResponse('Unauthorized', 403));
      return;
    }

    const exchanges = await Exchange.find()
      .populate('initiator', 'firstName lastName')
      .populate('recipient', 'firstName lastName')
      .populate('initiatorSkill')
      .populate('recipientSkill')
      .sort({ createdAt: -1 });

    sendResponse(res, successResponse({ exchanges }, 'Exchanges retrieved successfully'));
  } catch (error) {
    console.error('Get all exchanges error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const getAllSkills = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isAdmin(req)) {
      sendResponse(res, errorResponse('Unauthorized', 403));
      return;
    }

    const skills = await Skill.find()
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    sendResponse(res, successResponse({ skills }, 'Skills retrieved successfully'));
  } catch (error) {
    console.error('Get all skills error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};
