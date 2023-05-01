class BaseError extends Error {
  constructor(origin, message, statusCode, isOperational) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.origin = origin;
    this.message = message;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

module.exports = BaseError;
