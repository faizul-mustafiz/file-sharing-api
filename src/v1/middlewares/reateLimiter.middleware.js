const rateLimit = require('express-rate-limit');
const {
  setRateLimitRecord,
  getRateLimitRecord,
} = require('../helpers/redis.helper');
const moment = require('moment');
const TooManyRequestsError = require('../errors/TooManyRequestsError');
const logger = require('../loggers/logger');
const {
  maxAllowedRequest,
  windowTTL,
  windowLogIntervalTTL,
} = require('../configs/rateLimit.config');

const ExpressRateLimiter = rateLimit({
  windowMs: windowTTL * 60 * 60 * 1000,
  max: maxAllowedRequest,
  message: 'Max allowed upload or download requests limit exceeded',
  standardHeaders: true,
  legacyHeaders: false,
});

const RateLimiter = async (req, res, next) => {
  try {
    const rateLimitRecord = await getRateLimitRecord(req.ip);
    logger.debug('rateLimitRecord: %s', rateLimitRecord);
    const currentRequestTime = moment();
    logger.debug('currentRequestTime: $s', currentRequestTime.unix());

    const rateLimitRecordExpiryTTL = currentRequestTime
      .add(windowTTL, 'hours')
      .unix();
    logger.debug('rateLimitRecordExpiryTTL: %s', rateLimitRecordExpiryTTL);

    if (rateLimitRecord == null) {
      let newRecord = [];
      let requestLog = {
        requestTimeStamp: currentRequestTime.unix(),
        requestCount: 1,
      };
      newRecord.push(requestLog);
      setRateLimitRecord(req.ip, rateLimitRecordExpiryTTL, newRecord);
      next();
    } else {
      let data = rateLimitRecord;
      let windowStartTimestamp = moment().subtract(windowTTL, 'hours').unix();
      let requestsWithinWindow = data.filter((entry) => {
        return entry.requestTimeStamp > windowStartTimestamp;
      });
      let totalWindowRequestsCount = requestsWithinWindow.reduce(
        (accumulator, entry) => {
          return accumulator + entry.requestCount;
        },
        0,
      );
      if (totalWindowRequestsCount >= maxAllowedRequest) {
        throw new TooManyRequestsError(
          'rate-limiter-error',
          `Max allowed upload or download requests limit exceeded`,
        );
      } else {
        let lastRequestLog = data[data.length - 1];
        let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
          .subtract(windowLogIntervalTTL, 'hours')
          .unix();
        if (
          lastRequestLog.requestTimeStamp >
          potentialCurrentWindowIntervalStartTimeStamp
        ) {
          lastRequestLog.requestCount++;
          data[data.length - 1] = lastRequestLog;
        } else {
          data.push({
            requestTimeStamp: currentRequestTime.unix(),
            requestCount: 1,
          });
        }
        setRateLimitRecord(req.ip, rateLimitRecordExpiryTTL, data);
        next();
      }
    }
  } catch (error) {
    error.origin = error.origin ? error.origin : 'rate-limiter-base-error';
    next(error);
  }
};

module.exports = { ExpressRateLimiter, RateLimiter };
