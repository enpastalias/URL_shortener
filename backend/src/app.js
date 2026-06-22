import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import urlRoutes from './routes/urlRoutes.js';

const app = express();

// 1. Security Headers using Helmet
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP during development if it blocks local files/fonts
}));

// 2. Cross-Origin Resource Sharing
app.use(cors({
  origin: '*', // In production, replace with frontend client domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// 3. Body Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. API Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// 5. Mount Router (Root & API routes)
app.use('/', urlRoutes);

// 6. 404 Handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal server error. Please try again later.' });
});

export default app;
