import { Router } from 'express';
import {
  createSkill,
  getSkills,
  getUserSkills,
  updateSkill,
  deleteSkill,
} from '../controllers/skillsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, createSkill);
router.get('/', getSkills);
router.get('/user', authMiddleware, getUserSkills);
router.put('/:skillId', authMiddleware, updateSkill);
router.delete('/:skillId', authMiddleware, deleteSkill);

export default router;
