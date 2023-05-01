const BaseError = require('./BaseError');
class MethodNotAllowedError extends BaseError {
  constructor(origin, message, statusCode = 405, isOperational = true) {
    super(origin, message, statusCode, isOperational);
  }
}
module.exports = MethodNotAllowedError;
