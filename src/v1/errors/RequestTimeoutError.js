const BaseError = require('./BaseError');
class RequestTimeoutError extends BaseError {
  constructor(origin, message, statusCode = 408, isOperational = true) {
    super(origin, message, statusCode, isOperational);
  }
}
module.exports = RequestTimeoutError;
