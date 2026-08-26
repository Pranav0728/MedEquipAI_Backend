import express from 'express';
import { analyze, chat } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', analyze);
router.post('/chat', chat);

export default router;