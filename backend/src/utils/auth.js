import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || '8h';

export const signToken = (user) => {
  if (!secret) throw new Error('JWT_SECRET is not configured.');
  return jwt.sign({ sub: String(user._id), role: user.role, email: user.email }, secret, { expiresIn });
};

export const verifyToken = (token) => {
  if (!secret) throw new Error('JWT_SECRET is not configured.');
  return jwt.verify(token, secret);
};
