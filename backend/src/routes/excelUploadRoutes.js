import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireDb } from '../middleware/requireDb.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  uploadExcelFlatListings,
  getExcelUploadHistory,
} from '../controllers/excelUploadController.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = Router();

router.use(requireAuth, requireDb);

router.post('/bulk-upload', requireRole('admin'), upload.single('file'), asyncHandler(uploadExcelFlatListings));
router.post('/upload', requireRole('admin'), upload.single('file'), asyncHandler(uploadExcelFlatListings));
router.get('/flat-listings', requireRole('admin'), asyncHandler(getExcelUploadHistory));

export default router;
