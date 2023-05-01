const BaseError = require('./BaseError');
class BadRequestError extends BaseError {
  constructor(origin, message, statusCode = 400, isOperational = true) {
    super(origin, message, statusCode, isOperational);
  }
}
module.exports = BadRequestError;
