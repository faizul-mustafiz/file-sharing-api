const logger = require('../loggers/logger');
const ErrorLogger = (err, req, res, next) => {
  logger.error(err.origin, err);
  next(err);
};
module.exports = ErrorLogger;
