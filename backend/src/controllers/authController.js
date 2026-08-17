import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../utils/auth.js';

export const login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email?.trim() || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (!user.isActive) {
    return res.status(403).json({ error: 'Account is deactivated. Please contact your administrator.' });
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken(user);
  res.status(200).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};
