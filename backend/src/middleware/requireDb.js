import { dbState, connectDB } from '../config/db.js';

export const requireDb = async (req, res, next) => {
  if (dbState.ready) return next();
  try {
    await connectDB();
    next();
  } catch {
    res.status(503).json({
      error: 'Database is not connected. Add MONGODB_URI to your environment and start MongoDB.',
    });
  }
};
