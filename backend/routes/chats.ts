import { Router } from 'express';
import {
  getChats,
  getChat,
  sendMessage,
  markAsRead,
} from '../controllers/chatsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getChats);
router.get('/:chatId', authMiddleware, getChat);
router.post('/:chatId/messages', authMiddleware, sendMessage);
router.put('/:chatId/read', authMiddleware, markAsRead);

export default router;
