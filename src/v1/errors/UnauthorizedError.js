const BaseError = require('./BaseError');
class UnauthorizedError extends BaseError {
  constructor(origin, message, statusCode = 401, isOperational = true) {
    super(origin, message, statusCode, isOperational);
  }
}
module.exports = UnauthorizedError;
