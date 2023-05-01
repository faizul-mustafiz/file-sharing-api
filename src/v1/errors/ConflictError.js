const BaseError = require('./BaseError');
class ConflictError extends BaseError {
  constructor(origin, message, statusCode = 409, isOperational = true) {
    super(origin, message, statusCode, isOperational);
  }
}
module.exports = ConflictError;
