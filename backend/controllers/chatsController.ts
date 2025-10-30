import { Request, Response } from 'express';
import { Chat } from '../models/Chat';

interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

export const getChats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const chats = await Chat.find({ users: (req as any).userId })
      .populate('users', 'firstName lastName profilePicture')
      .populate('exchange')
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    if (!chat.users.map((u: any) => u._id.toString()).includes((req as any).userId)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    res.status(200).json(chat);
 } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    if (!chat.users.map((u) => u.toString()).includes((req as any).userId)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    (chat.messages as any).push({
      sender: (req as any).userId,
      content,
      timestamp: new Date(),
      read: false,
    });
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('users', 'firstName lastName profilePicture')
      .populate('messages.sender', 'firstName lastName profilePicture');

    res.status(201).json({
      message: 'Message sent',
      chat: updatedChat,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    chat.messages.forEach((msg) => {
      if (msg.sender.toString() !== (req as any).userId) {
        msg.read = true;
      }
    });

    await chat.save();

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};
