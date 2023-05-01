const BaseError = require('./BaseError');
class TooManyRequestsError extends BaseError {
  constructor(origin, message, statusCode = 429, isOperational = true) {
    super(origin, message, statusCode, isOperational);
  }
}
module.exports = TooManyRequestsError;
