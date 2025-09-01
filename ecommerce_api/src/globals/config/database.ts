import mongoose from 'mongoose';

function setupMongoDB() {
  mongoose
    .connect('mongodb://localhost:27017/ecommerce_api', {
      serverSelectionTimeoutMS: 5000
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

  return mongoose.connection;
}

export default setupMongoDB;
