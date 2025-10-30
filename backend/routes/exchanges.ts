import { Router } from 'express';
import {
  requestExchange,
  getExchanges,
  updateExchangeStatus,
  submitReview,
  getMatches,
} from '../controllers/exchangesController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, requestExchange);
router.post('/request', authMiddleware, requestExchange); // Add the /request route to match frontend expectations
router.get('/', authMiddleware, getExchanges);
router.put('/:exchangeId', authMiddleware, updateExchangeStatus);
router.post('/:exchangeId/review', authMiddleware, submitReview);
router.get('/matches', authMiddleware, getMatches);

export default router;
