import { Router } from 'express';
import { dbState } from '../config/db.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(dbState.ready ? 200 : 503).json({
    database: dbState.ready ? 'connected' : 'disconnected',
  });
});

export default router;
