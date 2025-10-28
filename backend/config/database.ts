import mongoose from 'mongoose';
import { User } from '../models/User';
import { Skill } from '../models/Skill';
import { Exchange } from '../models/Exchange';
import { Review } from '../models/Review';
import { Chat } from '../models/Chat';

const MONGODB_URI = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/skillswap';

export const connectDatabase = async (): Promise<void> => {
 try {
    // Import all models to ensure they're registered with Mongoose
    require('../models/User');
    require('../models/Skill');
    require('../models/Exchange');
    require('../models/Review');
    require('../models/Chat');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds timeout
    });
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ MongoDB disconnection failed:', error);
  }
};

export default mongoose;
