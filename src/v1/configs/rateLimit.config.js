const {
  MAX_ALLOWED_REQUESTS,
  WINDOW_TTL,
  WINDOW_LOG_INTERVAL_TTL,
} = require('../environments');

module.exports = {
  maxAllowedRequest: MAX_ALLOWED_REQUESTS,
  windowTTL: WINDOW_TTL,
  windowLogIntervalTTL: WINDOW_LOG_INTERVAL_TTL,
};
