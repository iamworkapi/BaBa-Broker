import { default: express } from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';

dotenv.config();

let appPromise = null;

async function createApp() {
  if (appPromise) return appPromise;
  appPromise = (async () => {
    const app = express();
    app.use(express.json({ limit: '15mb' }));
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') return res.sendStatus(200);
      next();
    });

    const { default: apiRoutes } = await import('../src/routes/index.js');
    const excelUploadRoutes = (await import('../src/routes/excelUploadRoutes.js')).default;
    const { errorHandler } = await import('../src/middleware/errorHandler.js');
    const { connectDB } = await import('../src/config/db.js');

    await connectDB();

    app.use('/api', apiRoutes);
    app.use('/api/admin/excel-upload', excelUploadRoutes);
    app.use('/api/excel', excelUploadRoutes);
    app.use(errorHandler);

    return app;
  })();
  return appPromise;
}

export default async function handler(req, res) {
  const app = await createApp();
  const handler = serverless(app);
  return handler(req, res);
}
