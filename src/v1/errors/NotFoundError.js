const BaseError = require('./BaseError');
class NotFoundError extends BaseError {
  constructor(origin, message, statusCode = 404, isOperational = true) {
    super(origin, message, statusCode, isOperational);
  }
}
module.exports = NotFoundError;
