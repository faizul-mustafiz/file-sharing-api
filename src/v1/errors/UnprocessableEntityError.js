const BaseError = require('./BaseError');
class UnprocessableEntityError extends BaseError {
  constructor(origin, message, statusCode = 422, isOperational = true) {
    super(origin, message, statusCode, isOperational);
  }
}
module.exports = UnprocessableEntityError;
