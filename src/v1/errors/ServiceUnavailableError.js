const BaseError = require('./BaseError');
class ServiceUnavailableError extends BaseError {
  constructor(origin, message, statusCode = 503, isOperational = true) {
    super(origin, message, statusCode, isOperational);
  }
}
module.exports = ServiceUnavailableError;
