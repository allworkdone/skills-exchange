import { Router } from 'express';
import {
  getUserProfile,
  updateProfile,
  getAllUsers,
  searchUsers,
} from '../controllers/usersController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', getAllUsers);
router.get('/search', searchUsers);
router.get('/:userId', getUserProfile);
router.put('/profile', authMiddleware, updateProfile);

export default router;
