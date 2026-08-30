import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectDB } from './src/config/db.js';
import { default: apiRoutes } from './src/routes/index.js';
import { default: excelUploadRoutes } from './src/routes/excelUploadRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();
app.use(express.json({ limit: '15mb' }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Connect DB in background, don't block startup
connectDB().catch((e) => console.error('DB connect:', e.message));

app.use('/api', apiRoutes);
app.use('/api/admin/excel-upload', excelUploadRoutes);
app.use('/api/excel', excelUploadRoutes);
app.use(errorHandler);

export default app;
