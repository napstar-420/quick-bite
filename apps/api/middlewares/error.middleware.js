const { NotFoundError } = require('../errors.js');

function errorHandler(err, _req, res, _next) {
  res.status(('status' in err && err.status) || 500);
  res.json({
    title: 'status' in err ? err.status : err.name,
    message: err.message,
  });
}

function errorNotFoundHandler(_req, _res, next) {
  next(new NotFoundError('Not Found'));
}

module.exports = {
  errorHandler,
  errorNotFoundHandler,
};
