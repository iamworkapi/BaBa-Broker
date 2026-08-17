// Catches errors thrown/passed to next() from anywhere in the app
// and sends a consistent JSON error response.
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const isPayloadTooLarge = status === 413 || err.type === 'entity.too.large';
  const message = isPayloadTooLarge
    ? 'Your uploaded photos or video are too large. Please use smaller/fewer images, or paste a YouTube link instead of uploading a video file.'
    : err.message || 'Server error.';
  res.status(status).json({ error: message });
};

// Wraps an async route handler so rejected promises are forwarded to
// the error handler instead of crashing the process.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
