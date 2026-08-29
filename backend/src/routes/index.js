import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import staffRoutes from './staffRoutes.js';
import propertyRoutes from './propertyRoutes.js';
import flatListingRoutes from './flatListingRoutes.js';
import contactRoutes from './contactRoutes.js';
import shareRoutes from './shareRoutes.js';
import investorRoutes from './investorRoutes.js';
import investmentRequestRoutes from './investmentRequestRoutes.js';
import excelUploadRoutes from './excelUploadRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/staff', staffRoutes);
router.use('/properties', propertyRoutes);
router.use('/flat-listings', flatListingRoutes);
router.use('/contacts', contactRoutes);
router.use('/shares', shareRoutes);
router.use('/investors', investorRoutes);
router.use('/investment-requests', investmentRequestRoutes);
router.use('/admin/excel-upload', excelUploadRoutes);
router.use('/excel', excelUploadRoutes);

// Fallback for any unmatched /api/* path
router.use((req, res) => res.status(404).json({ error: 'API endpoint not found.' }));

export default router;
