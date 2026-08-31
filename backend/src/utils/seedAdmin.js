import bcrypt from 'bcryptjs';
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

const seed = async () => {
  await connectDB();

  const existing = await User.findOne({ email: 'admin@bababroker.com' });
  if (existing) {
    console.log('Admin user already exists, email:', existing.email);
    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash('admin123', 12);
  const user = await User.create({
    name: 'Admin User',
    email: 'admin@bababroker.com',
    phone: '9999999999',
    passwordHash,
    role: 'admin',
    isActive: true,
    tokenVersion: 0,
    loginAttempts: 0,
  });

  console.log('Admin user created:', { id: user._id, email: user.email, role: user.role });
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
