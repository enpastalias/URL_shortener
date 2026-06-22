import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Listen on port
  app.listen(PORT, () => {
    console.log(`[Server] running on port ${PORT}`);
    console.log(`[Server] Base URL: ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
  });
};

startServer();
