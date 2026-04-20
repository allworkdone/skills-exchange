import { Response } from 'express';
import { Chat } from '../models/Chat';
import { successResponse, errorResponse, sendResponse } from '../utils/response';
import { AuthRequest } from '../types';

export const getChats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const chats = await Chat.find({ users: req.userId })
      .populate('users', 'firstName lastName profilePicture')
      .populate('exchange')
      .sort({ updatedAt: -1 });

    sendResponse(res, successResponse({ chats }, 'Chats retrieved successfully'));
  } catch (error) {
    console.error('Get chats error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const getChat = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate('users', 'firstName lastName profilePicture')
      .populate('exchange')
      .populate('messages.sender', 'firstName lastName profilePicture');

    if (!chat) {
      sendResponse(res, errorResponse('Chat not found', 404));
      return;
    }

    if (!chat.users.map((u: any) => u._id.toString()).includes(req.userId)) {
      sendResponse(res, errorResponse('Unauthorized', 403));
      return;
    }

    sendResponse(res, successResponse({ chat }, 'Chat retrieved successfully'));
 } catch (error) {
    console.error('Get chat error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const sendMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content) {
      sendResponse(res, errorResponse('Message content is required', 400));
      return;
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      sendResponse(res, errorResponse('Chat not found', 404));
      return;
    }

    if (!req.userId || !chat.users.map((u) => u.toString()).includes(req.userId)) {
      sendResponse(res, errorResponse('Unauthorized', 403));
      return;
    }

    (chat.messages as any).push({
      sender: req.userId,
      content,
      timestamp: new Date(),
      read: false,
    });
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('users', 'firstName lastName profilePicture')
      .populate('messages.sender', 'firstName lastName profilePicture');

    sendResponse(res, successResponse({ chat: updatedChat }, 'Message sent successfully', 201));
  } catch (error) {
    console.error('Send message error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};

export const markAsRead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      sendResponse(res, errorResponse('Chat not found', 404));
      return;
    }

    chat.messages.forEach((msg) => {
      if (msg.sender.toString() !== req.userId) {
        msg.read = true;
      }
    });

    await chat.save();

    sendResponse(res, successResponse({}, 'Messages marked as read'));
  } catch (error) {
    console.error('Mark as read error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};
