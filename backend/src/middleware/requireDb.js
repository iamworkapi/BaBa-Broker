import { dbState } from '../config/db.js';

export const requireDb = (req, res, next) => {
  if (!dbState.ready) {
    return res.status(503).json({
      error: 'Database is not connected. Add MONGODB_URI to your environment and start MongoDB.',
    });
  }
  next();
};
