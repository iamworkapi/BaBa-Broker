import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireDb } from '../middleware/requireDb.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getInvestors, createInvestor, deleteInvestor } from '../controllers/investorController.js';

const router = Router();

// Public: anyone filling out the "Become an Investor" form can register.
router.post('/', requireDb, asyncHandler(createInvestor));

// Admin only: browse/manage registered investors.
router.get('/', requireDb, requireAuth, requireRole('admin'), asyncHandler(getInvestors));
router.delete('/:id', requireDb, requireAuth, requireRole('admin'), asyncHandler(deleteInvestor));

export default router;
