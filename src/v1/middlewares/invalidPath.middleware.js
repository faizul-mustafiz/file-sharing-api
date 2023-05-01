const logger = require('../loggers/logger');
const BadRequestError = require('../errors/BadGatewayError');
const invalidPath = (req, res, next) => {
  return res.status(400).json({
    success: false,
    message: 'This path is not valid.',
    result: {},
  });
};
module.exports = invalidPath;
