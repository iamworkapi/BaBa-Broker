import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireDb } from '../middleware/requireDb.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getShareCount, getShares, createShare } from '../controllers/shareController.js';

const router = Router();

router.use(requireDb, requireAuth);

router.get('/', requireRole(['admin', 'employee']), asyncHandler(getShareCount));
router.get('/list', requireRole('admin'), asyncHandler(getShares));
router.post('/', requireRole(['admin', 'employee']), asyncHandler(createShare));

export default router;
