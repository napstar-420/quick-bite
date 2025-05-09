const mongoose = require('mongoose');

const config = require('../config');
const { logger } = require('../utils/logger');

async function connectDB() {
  try {
    const DB_CONNECTION = await mongoose.connect(config.DB_URI, {
      replicaSet: 'rs0',
      dbName: 'quick-bite',
    });
    logger.info(`MongoDB connected: ${DB_CONNECTION.connection.host}`);
  }
  catch (error) {
    logger.error('Mongo DB connection failed');
    logger.error(error);
    process.exit(1);
  }
}

async function disconnectDB() {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
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

if (config.NODE_ENV !== 'development') {
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected! Reconnecting...');
    connectDB();
  });
}

module.exports = { connectDB, disconnectDB, connection: mongoose.connection };
