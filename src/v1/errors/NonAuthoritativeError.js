const BaseError = require('./BaseError');
class NonAuthoritativeError extends BaseError {
  constructor(origin, message, statusCode = 203, isOperational = true) {
    super(origin, message, statusCode, isOperational);
  }
}
module.exports = NonAuthoritativeError;
