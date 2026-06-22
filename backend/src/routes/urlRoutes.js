import express from 'express';
import { shortenUrl, redirectUrl, getUrlAnalytics } from '../controllers/urlController.js';
import { shortenLimiter, apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Shorten URL endpoint
router.post('/api/url/shorten', shortenLimiter, shortenUrl);

// Get URL analytics endpoint
router.get('/api/url/:shortCode', apiLimiter, getUrlAnalytics);

// Redirect endpoint (at root level)
router.get('/:shortCode', redirectUrl);

export default router;
