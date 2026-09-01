import { connectDB } from '../config/db.js';

export const requireDb = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('requireDb error:', error.message);
    res.status(503).json({
      error: `Database connection error: ${error.message || 'Unable to connect to MongoDB'}`,
    });
  }
};
