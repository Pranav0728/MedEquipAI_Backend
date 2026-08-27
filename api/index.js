import app from '../src/app.js';

// Vercel serverless function handler.
// On serverless we do NOT call app.listen — Vercel invokes (req, res) directly.
export default app;