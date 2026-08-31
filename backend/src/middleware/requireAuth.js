import { verifyAccessToken, isTokenBlacklisted, validateTokenVersion } from '../utils/auth.js';

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Please sign in to continue.' });

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  }

  if (payload.jti && await isTokenBlacklisted(payload.jti)) {
    return res.status(401).json({ error: 'Session has been revoked. Please sign in again.' });
  }

  if (payload.tv !== undefined && !(await validateTokenVersion(payload.sub, payload.tv))) {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }

  req.user = { id: payload.sub, role: payload.role, email: payload.email };
  next();
};
