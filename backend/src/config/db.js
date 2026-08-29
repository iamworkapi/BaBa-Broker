import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/baba_broker';

export const dbState = { ready: false };

let connectPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    dbState.ready = true;
    return;
  }
  if (!connectPromise) {
    connectPromise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
      })
      .then(() => {
        dbState.ready = true;
        console.log('MongoDB connected');
      })
      .catch((error) => {
        connectPromise = null;
        dbState.ready = false;
        console.error(`MongoDB connection failed: ${error.message}`);
        throw error;
      });
  }
  return connectPromise;
};

mongoose.connection.on('disconnected', () => {
  dbState.ready = false;
  connectPromise = null;
});

mongoose.connection.on('reconnected', () => {
  dbState.ready = true;
});

export default mongoose;
