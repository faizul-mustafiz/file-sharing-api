const BaseError = require('./BaseError');
class InternalServerError extends BaseError {
  constructor(origin, message, statusCode = 500, isOperational = true) {
    super(origin, message, statusCode, isOperational);
  }
}
module.exports = InternalServerError;
