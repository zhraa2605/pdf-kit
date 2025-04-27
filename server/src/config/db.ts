import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Make sure this is called to load the environment variables

const connectDB = async () => {
  const dbURI = process.env.MONGO_URI; // This should point to your MongoDB URI

  if (!dbURI) {
    console.error('MongoDB URI is undefined');
    process.exit(1); // Exit process if the URI is missing
  }

  try {
    await mongoose.connect(dbURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process if the connection fails
  }
};

export default connectDB;
