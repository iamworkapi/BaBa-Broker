import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/baba_broker';

// Simple exported flag other modules can read to know if the DB is ready.
export const dbState = { ready: false };

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    dbState.ready = true;
    console.log('MongoDB connected');
  } catch (error) {
    dbState.ready = false;
    console.error(`MongoDB connection failed: ${error.message}`);
  }
};

mongoose.connection.on('disconnected', () => {
  dbState.ready = false;
});

mongoose.connection.on('reconnected', () => {
  dbState.ready = true;
});

export default mongoose;
