import { Router } from 'express';
import { requireDb } from '../middleware/requireDb.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { login } from '../controllers/authController.js';

const router = Router();

router.post('/login', requireDb, asyncHandler(login));

export default router;
