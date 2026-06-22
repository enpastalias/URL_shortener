import mongoose from 'mongoose';
import Url from '../models/Url.js';

// In-memory fallback database for when MongoDB is unavailable
export const mockDb = new Map();

const BASE62_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generates a random Base62 short code.
 * @param {number} length Length of the short code (default: 6)
 * @returns {string} The generated code.
 */
export const generateShortCode = (length = 6) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * BASE62_CHARACTERS.length);
    result += BASE62_CHARACTERS[randomIndex];
  }
  return result;
};

/**
 * Generates a unique Base62 short code, verifying that it does not collide
 * with any existing codes in either MongoDB or the in-memory fallback cache.
 * @param {number} length Initial length of code (default: 6)
 * @returns {Promise<string>} A unique short code.
 */
export const generateUniqueCode = async (length = 6) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const code = generateShortCode(length);
    let exists = false;

    if (isMongoConnected) {
      try {
        const existingUrl = await Url.findOne({ shortCode: code });
        if (existingUrl) exists = true;
      } catch (err) {
        console.error('Error checking code collision in MongoDB, relying on memory check:', err.message);
        if (mockDb.has(code)) exists = true;
      }
    } else {
      if (mockDb.has(code)) exists = true;
    }

    if (!exists) {
      return code;
    }
    attempts++;
  }

  // If collisions are hit too many times, increase length to expand namespace
  return generateUniqueCode(length + 1);
};
