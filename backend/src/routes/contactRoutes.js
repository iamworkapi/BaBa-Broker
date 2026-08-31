import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireDb } from '../middleware/requireDb.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getContacts, createContact, deleteContact } from '../controllers/contactController.js';

const router = Router();

router.use(requireDb, requireAuth, requireRole('admin'));

router.get('/', asyncHandler(getContacts));
router.post('/', asyncHandler(createContact));
router.delete('/:id', asyncHandler(deleteContact));

export default router;
