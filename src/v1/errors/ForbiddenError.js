const BaseError = require('./BaseError');
class ForbiddenError extends BaseError {
  constructor(origin, message, statusCode = 403, isOperational = true) {
    super(origin, message, statusCode, isOperational);
  }
}
module.exports = ForbiddenError;
