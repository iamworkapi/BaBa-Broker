import { dbState, connectDB } from '../config/db.js';
import { ensureBootstrapUsers } from '../utils/bootstrapUsers.js';

export const requireDb = async (req, res, next) => {
  if (dbState.ready && mongoose.connection.readyState === 1) {
    await ensureBootstrapUsers().catch(() => {});
    return next();
  }
  try {
    await connectDB();
    await ensureBootstrapUsers().catch(() => {});
    next();
  } catch (error) {
    console.error('requireDb error:', error);
    res.status(503).json({
      error: `Database connection error: ${error.message || 'Unable to connect to MongoDB'}`,
    });
  }
};
