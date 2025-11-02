import { Request, Response } from 'express';
import { Exchange } from '../models/Exchange';
import { User } from '../models/User';
import { Chat } from '../models/Chat';
import { findMatches } from '../utils/matching';
import { successResponse, errorResponse, sendResponse } from '../utils/response';

interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

export const requestExchange = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { recipientId, initiatorSkillId, recipientSkillId, message } = req.body;

    console.log('Received exchange request with data:', {
      recipientId,
      initiatorSkillId,
      recipientSkillId,
      message,
      userId: (req as any).userId
    });

    if (!recipientId || !initiatorSkillId || !recipientSkillId) {
      const missingFields = [];
      if (!recipientId) missingFields.push('recipientId');
      if (!initiatorSkillId) missingFields.push('initiatorSkillId');
      if (!recipientSkillId) missingFields.push('recipientSkillId');
      
      console.log('Missing required fields:', missingFields);
      sendResponse(res, errorResponse('All fields are required', 400));
      return;
    }

    const exchange = new Exchange({
      initiator: (req as any).userId,
      recipient: recipientId,
      initiatorSkill: initiatorSkillId,
      recipientSkill: recipientSkillId,
      status: 'pending',
      message: message || '', // Add message field if provided
    });

    await exchange.save();

    const populatedExchange = await Exchange.findById(exchange._id)
      .populate('initiator', 'firstName lastName profilePicture')
      .populate('recipient', 'firstName lastName profilePicture')
      .populate('initiatorSkill')
      .populate('recipientSkill');

    const chat = new Chat({
      users: [(req as any).userId, recipientId],
      exchange: exchange._id,
    });
    await chat.save();
    
    // Add the initial message to the chat after the chat is created
    if (message) {
      (chat.messages as any).push({
        sender: (req as any).userId,
        content: message,
        timestamp: new Date(),
        read: false,
      });
      await chat.save();
    }

    sendResponse(res, successResponse({ 
      message: 'Exchange request sent',
      exchange: populatedExchange,
      chatId: chat._id,
    }, 'Exchange request sent successfully', 201));
  } catch (error) {
    console.error('Request exchange error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const getExchanges = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.query;

    const filter: any = {
      $or: [{ initiator: (req as any).userId }, { recipient: (req as any).userId }],
    };

    if (status) filter.status = status;

    const exchanges = await Exchange.find(filter)
      .populate('initiator', 'firstName lastName profilePicture')
      .populate('recipient', 'firstName lastName profilePicture')
      .populate('initiatorSkill')
      .populate('recipientSkill')
      .sort({ createdAt: -1 });

    sendResponse(res, successResponse({ exchanges }, 'Exchanges retrieved successfully'));
  } catch (error) {
    console.error('Get exchanges error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
  }
};

export const updateExchangeStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { exchangeId } = req.params;
    const { status, scheduledDate } = req.body;

    const exchange = await Exchange.findById(exchangeId);
    if (!exchange) {
      sendResponse(res, errorResponse('Exchange not found', 404));
      return;
    }

    if (
      exchange.recipient.toString() !== (req as any).userId &&
      exchange.initiator.toString() !== (req as any).userId
    ) {
      sendResponse(res, errorResponse('Unauthorized', 403));
      return;
    }

    exchange.status = status;
    if (scheduledDate) exchange.scheduledDate = new Date(scheduledDate);

    if (status === 'completed') {
      exchange.completedDate = new Date();
    }

    await exchange.save();

    const populatedExchange = await Exchange.findById(exchangeId)
      .populate('initiator', 'firstName lastName profilePicture')
      .populate('recipient', 'firstName lastName profilePicture')
      .populate('initiatorSkill')
      .populate('recipientSkill');

    sendResponse(res, successResponse({ 
      message: 'Exchange status updated',
      exchange: populatedExchange,
    }, 'Exchange status updated successfully'));
  } catch (error) {
    console.error('Update exchange status error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const submitReview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { exchangeId } = req.params;
    const { rating, review } = req.body;

    const exchange = await Exchange.findById(exchangeId);
    if (!exchange) {
      sendResponse(res, errorResponse('Exchange not found', 404));
      return;
    }

    if (exchange.initiator.toString() === (req as any).userId) {
      exchange.initiatorRating = rating;
      exchange.initiatorReview = review;
    } else if (exchange.recipient.toString() === (req as any).userId) {
      exchange.recipientRating = rating;
      exchange.recipientReview = review;
    } else {
      sendResponse(res, errorResponse('Unauthorized', 403));
      return;
    }

    await exchange.save();

    if (exchange.initiatorRating && exchange.recipientRating) {
      const avgRating = (exchange.initiatorRating + exchange.recipientRating) / 2;
      const user = await User.findById((req as any).userId);
      if (user) {
        const oldRating = user.rating || 0;
        user.rating = (oldRating + avgRating) / 2;
        await user.save();
      }
    }

    sendResponse(res, successResponse({ 
      message: 'Review submitted successfully',
      exchange,
    }, 'Review submitted successfully'));
  } catch (error) {
    console.error('Submit review error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const getMatches = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById((req as any).userId).populate('skills');
    if (!user) {
      sendResponse(res, errorResponse('User not found', 404));
      return;
    }

    const allUsers = await User.find().populate('skills');
    const matches = await findMatches(user, allUsers);

    const matchedUsers = await Promise.all(
      matches.map(async (match) => {
        const matchedUser = await User.findById(match.userId).populate('skills');
        return {
          user: matchedUser,
          matchScore: match.matchScore,
          mutualSkills: match.mutualSkills,
        };
      })
    );

    sendResponse(res, successResponse({ matchedUsers }, 'Matches retrieved successfully'));
  } catch (error) {
    console.error('Get matches error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};
