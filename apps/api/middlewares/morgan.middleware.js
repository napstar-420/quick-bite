const morgan = require('morgan');

const { logger } = require('../utils/logger.js');

// Morgan Middleware
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);

module.exports = { morganMiddleware };
