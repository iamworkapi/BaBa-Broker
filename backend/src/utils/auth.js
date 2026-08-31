import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Token from '../models/Token.js';
import User from '../models/User.js';

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
const ACCESS_TTL = process.env.JWT_ACCESS_TTL || '15m';
const REFRESH_TTL = process.env.JWT_REFRESH_TTL || '7d';

function sign(payload, secret, expiresIn) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function signAccessToken(user) {
  if (!ACCESS_SECRET) throw new Error('JWT_SECRET is not configured.');
  return sign(
    { sub: String(user._id), role: user.role, email: user.email, tv: user.tokenVersion },
    ACCESS_SECRET,
    ACCESS_TTL
  );
}

export function signRefreshToken(user, jti) {
  if (!REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not configured.');
  return sign(
    { sub: String(user._id), type: 'refresh', tv: user.tokenVersion, jti },
    REFRESH_SECRET,
    REFRESH_TTL
  );
}

export function verifyAccessToken(token) {
  if (!ACCESS_SECRET) throw new Error('JWT_SECRET is not configured.');
  const payload = jwt.verify(token, ACCESS_SECRET);
  if (payload.type === 'refresh') throw new Error('Invalid token type.');
  return payload;
}

export function verifyRefreshToken(token) {
  if (!REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not configured.');
  const payload = jwt.verify(token, REFRESH_SECRET);
  if (payload.type !== 'refresh') throw new Error('Invalid token type.');
  return payload;
}

export async function isTokenBlacklisted(jti) {
  if (!jti) return false;
  return !!(await Token.findOne({ jti }).lean());
}

export async function blacklistToken(jti, userId, type, expiresAt, userAgent, ipAddress) {
  if (!jti) return;
  await Token.create({ jti, userId, type, expiresAt, userAgent, ipAddress });
}

export async function blacklistAllUserTokens(userId) {
  await Token.deleteMany({ userId });
}

export async function validateTokenVersion(userId, tokenVersion) {
  const user = await User.findById(userId, 'tokenVersion').lean();
  if (!user) return false;
  return user.tokenVersion === tokenVersion;
}

export async function rotateTokens(userId) {
  const user = await User.findById(userId);
  if (!user) return null;
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  user.passwordChangedAt = user.passwordChangedAt || new Date();
  await user.save();

  const jti = crypto.randomBytes(32).toString('hex');
  return {
    access: signAccessToken(user),
    refresh: signRefreshToken(user, jti),
    refreshJti: jti,
  };
}
