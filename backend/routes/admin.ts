import { Router } from 'express';
import {
  getDashboard,
  getAllUsers,
  getUserDetails,
  deleteUser,
  getAllExchanges,
  getAllSkills,
} from '../controllers/adminController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authMiddleware, getDashboard);
router.get('/users', authMiddleware, getAllUsers);
router.get('/users/:userId', authMiddleware, getUserDetails);
router.delete('/users/:userId', authMiddleware, deleteUser);
router.get('/exchanges', authMiddleware, getAllExchanges);
router.get('/skills', authMiddleware, getAllSkills);

export default router;
