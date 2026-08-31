import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireDb } from '../middleware/requireDb.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  resetStaffPassword,
  getStaffStats,
} from '../controllers/staffController.js';

const router = Router();

router.use(requireDb, requireAuth, requireRole('admin'));

router.get('/', asyncHandler(getStaff));
router.get('/stats', asyncHandler(getStaffStats));
router.post('/', asyncHandler(createStaff));
router.patch('/:id', asyncHandler(updateStaff));
router.put('/:id/reset-password', asyncHandler(resetStaffPassword));
router.delete('/:id', asyncHandler(deleteStaff));

export default router;
