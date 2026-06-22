import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/url_shortener';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('Unable to connect to MongoDB. URL Shortener will fall back to an in-memory data store for this run.');
    return null;
  }
};

export default connectDB;
