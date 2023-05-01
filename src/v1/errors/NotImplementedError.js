const BaseError = require('./BaseError');
class NotImplementedError extends BaseError {
  constructor(origin, message, statusCode = 501, isOperational = true) {
    super(origin, message, statusCode, isOperational);
  }
}
module.exports = NotImplementedError;
