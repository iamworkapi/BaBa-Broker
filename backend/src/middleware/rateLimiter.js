const loginAttempts = new Map();

export function rateLimiter(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000;
  const maxAttempts = options.maxAttempts || 5;
  const keyPrefix = options.keyPrefix || 'rl';

  return (req, res, next) => {
    const key = `${keyPrefix}:${req.ip}:${req.path}`;
    const now = Date.now();

    const record = loginAttempts.get(key);
    if (!record || now - record.start > windowMs) {
      loginAttempts.set(key, { count: 1, start: now });
      return next();
    }

    record.count += 1;
    if (record.count > maxAttempts) {
      const retryAfter = Math.ceil((windowMs - (now - record.start)) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
    }

    next();
  };
}

export function clearRateLimit(key) {
  loginAttempts.delete(key);
}
