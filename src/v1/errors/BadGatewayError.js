const BaseError = require('./BaseError');
class BadGatewayError extends BaseError {
  constructor(origin, message, statusCode = 502, isOperational = true) {
    super(origin, message, statusCode, isOperational);
  }
}
module.exports = BadGatewayError;
