import mongoose from 'mongoose';
import validUrl from 'valid-url';
import Url from '../models/Url.js';
import { generateUniqueCode, mockDb } from '../utils/base62.js';

/**
 * Shorten a long URL
 * POST /api/url/shorten
 */
export const shortenUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required.' });
    }

    if (!validUrl.isWebUri(url)) {
      return res.status(400).json({ error: 'Invalid URL. Please provide a valid URL starting with http:// or https://' });
    }

    const isMongoConnected = mongoose.connection.readyState === 1;
    let shortCode = '';

    // Check if the long URL already has a short code
    if (isMongoConnected) {
      const existing = await Url.findOne({ originalUrl: url });
      if (existing) {
        shortCode = existing.shortCode;
      }
    } else {
      for (const [code, val] of mockDb.entries()) {
        if (val.originalUrl === url) {
          shortCode = code;
          break;
        }
      }
    }

    // Generate new short code if not already shortened
    if (!shortCode) {
      shortCode = await generateUniqueCode();

      if (isMongoConnected) {
        const newUrl = new Url({
          originalUrl: url,
          shortCode,
        });
        await newUrl.save();
      } else {
        mockDb.set(shortCode, {
          originalUrl: url,
          clicks: 0,
          createdAt: new Date(),
        });
      }
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    return res.status(201).json({
      shortUrl: `${baseUrl}/${shortCode}`,
      shortCode,
    });
  } catch (error) {
    console.error('Shorten URL error:', error);
    return res.status(500).json({ error: 'Server error occurred while shortening the URL.' });
  }
};

/**
 * Redirect short code to original URL
 * GET /:shortCode
 */
export const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const isMongoConnected = mongoose.connection.readyState === 1;
    let originalUrl = '';

    if (isMongoConnected) {
      const record = await Url.findOneAndUpdate(
        { shortCode },
        { $inc: { clicks: 1 } },
        { new: true }
      );
      if (record) {
        originalUrl = record.originalUrl;
      }
    } else {
      const record = mockDb.get(shortCode);
      if (record) {
        record.clicks += 1;
        mockDb.set(shortCode, record);
        originalUrl = record.originalUrl;
      }
    }

    if (!originalUrl) {
      return res.status(404).send('<h1>404 Not Found</h1><p>The requested short code was not found or is invalid.</p>');
    }

    return res.redirect(originalUrl);
  } catch (error) {
    console.error('Redirect URL error:', error);
    return res.status(500).send('<h1>500 Internal Server Error</h1><p>Failed to perform redirect.</p>');
  }
};

/**
 * Get details & analytics for a short code
 * GET /api/url/:shortCode
 */
export const getUrlAnalytics = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const isMongoConnected = mongoose.connection.readyState === 1;
    let record = null;

    if (isMongoConnected) {
      record = await Url.findOne({ shortCode });
    } else {
      const mockRecord = mockDb.get(shortCode);
      if (mockRecord) {
        record = {
          originalUrl: mockRecord.originalUrl,
          shortCode,
          clicks: mockRecord.clicks,
          createdAt: mockRecord.createdAt,
        };
      }
    }

    if (!record) {
      return res.status(404).json({ error: 'Short URL code not found.' });
    }

    return res.json({
      originalUrl: record.originalUrl,
      shortCode: record.shortCode || shortCode,
      clicks: record.clicks,
      createdAt: record.createdAt,
    });
  } catch (error) {
    console.error('Get URL Analytics error:', error);
    return res.status(500).json({ error: 'Server error occurred while fetching analytics.' });
  }
};
