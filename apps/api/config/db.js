const mongoose = require('mongoose');

const config = require('.');
const { logger } = require('../utils/logger');

async function connectDB() {
  try {
    const conn = await mongoose.connect(config.DB_URI);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  }
  catch (error) {
    logger.error('Mongo DB connection failed');
    logger.error(error);
    process.exit(1);
  }
}

mongoose.connection.on('connecting', () => {
  logger.debug('Connecting to MongoDB...');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected! Reconnecting...');
  connectDB();
});

module.exports = { connectDB };
