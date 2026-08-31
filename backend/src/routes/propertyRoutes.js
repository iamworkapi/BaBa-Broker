import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireDb } from '../middleware/requireDb.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getProperties,
  getPortfolios,
  getFeaturedProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';

const router = Router();

router.get('/', requireDb, asyncHandler(getProperties));
router.get('/portfolios', requireDb, asyncHandler(getPortfolios));
router.get('/featured', requireDb, asyncHandler(getFeaturedProperties));
router.post('/', requireDb, requireAuth, requireRole('admin'), asyncHandler(createProperty));
router.put('/:id', requireDb, requireAuth, requireRole('admin'), asyncHandler(updateProperty));
router.delete('/:id', requireDb, requireAuth, requireRole('admin'), asyncHandler(deleteProperty));

export default router;
