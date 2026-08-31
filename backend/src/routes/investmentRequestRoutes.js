import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireDb } from '../middleware/requireDb.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getInvestmentRequests,
  getMyInvestmentRequests,
  createInvestmentRequest,
  updateInvestmentRequestStatus,
  assignInvestmentRequest,
  updateFollowUpStatus,
} from '../controllers/investmentRequestController.js';

const router = Router();

// Public: a registered investor requests to invest in a specific plan.
router.post('/', requireDb, asyncHandler(createInvestmentRequest));

// Salesman/Employee: view and update progress on leads assigned to them.
router.get(
  '/mine',
  requireAuth,
  requireRole(['salesman', 'employee']),
  requireDb,
  asyncHandler(getMyInvestmentRequests)
);
router.put(
  '/:id/follow-up',
  requireAuth,
  requireRole(['salesman', 'employee', 'admin']),
  requireDb,
  asyncHandler(updateFollowUpStatus)
);

// Admin only: review, assign, and approve/reject investment requests.
router.get('/', requireDb, requireAuth, requireRole('admin'), asyncHandler(getInvestmentRequests));
router.put('/:id/status', requireDb, requireAuth, requireRole('admin'), asyncHandler(updateInvestmentRequestStatus));
router.put('/:id/assign', requireDb, requireAuth, requireRole('admin'), asyncHandler(assignInvestmentRequest));

export default router;
