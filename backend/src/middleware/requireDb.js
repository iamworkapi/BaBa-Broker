import { dbState, connectDB } from '../config/db.js';
import { ensureBootstrapUsers } from '../utils/bootstrapUsers.js';

export const requireDb = async (req, res, next) => {
  if (dbState.ready) {
    await ensureBootstrapUsers().catch(() => {});
    return next();
  }
  try {
    await connectDB();
    await ensureBootstrapUsers().catch(() => {});
    next();
  } catch {
    res.status(503).json({
      error: 'Database is not connected. Add MONGODB_URI to your environment and start MongoDB.',
    });
  }
};
