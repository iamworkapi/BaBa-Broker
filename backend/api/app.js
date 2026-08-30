import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectDB } from '../src/config/db.js';
import apiRoutes from '../src/routes/index.js';
import excelUploadRoutes from '../src/routes/excelUploadRoutes.js';
import { errorHandler } from '../src/middleware/errorHandler.js';

export default (async () => {
  await connectDB();

  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });

  app.use('/api', apiRoutes);
  app.use('/api/admin/excel-upload', excelUploadRoutes);
  app.use('/api/excel', excelUploadRoutes);
  app.use(errorHandler);

  return app;
})();
