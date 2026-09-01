import { Router } from 'express';
import { requireDb } from '../middleware/requireDb.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { login, refresh, logout, me, register } from '../controllers/authController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const loginLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  maxAttempts: process.env.NODE_ENV === 'production' ? 10 : 100,
  keyPrefix: 'login',
});

router.post('/login', requireDb, asyncHandler(login));
router.post('/register', requireDb, asyncHandler(register));
router.post('/refresh', requireDb, asyncHandler(refresh));
router.post('/logout', requireAuth, requireDb, asyncHandler(logout));
router.get('/me', requireAuth, requireDb, asyncHandler(me));

export default router;
