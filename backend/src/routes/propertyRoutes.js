import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireDb } from '../middleware/requireDb.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';

const router = Router();

router.get('/', requireDb, asyncHandler(getProperties));
router.post('/', requireAuth, requireRole('admin'), requireDb, asyncHandler(createProperty));
router.put('/:id', requireAuth, requireRole('admin'), requireDb, asyncHandler(updateProperty));
router.delete('/:id', requireAuth, requireRole('admin'), requireDb, asyncHandler(deleteProperty));

export default router;
