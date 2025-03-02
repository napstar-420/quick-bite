class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

class NotFoundError extends HttpError {
  constructor(message, status = 404) {
    super(status, message);
    this.name = "NotFoundError";
  }
}

module.exports = { HttpError, NotFoundError };
