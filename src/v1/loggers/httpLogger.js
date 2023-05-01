/**
 * * HTTP request logger. this logger will log every request ever made to your api
 * * with the time of the request, method, status, url, responseContentLength and responseTime
 * * this middleware is injected at the main app.js
 * * app.use(httpLogger)
 */
const morgan = require('morgan');
const json = require('morgan-json');
const format = json({
  method: ':method',
  url: ':url',
  status: ':status',
  resContentLength: ':res[content-length]',
  responseTime: ':response-time',
});
const logger = require('./logger');
const httpLogger = morgan(format, {
  stream: {
    write: (message) => {
      const { method, url, status, resContentLength, responseTime } =
        JSON.parse(message);
      logger.info('HTTP-Request-Log', {
        timestamp: new Date(),
        method,
        url,
        status: Number(status),
        responseTime: Number(responseTime),
        resContentLength,
      });
    },
  },
});

module.exports = httpLogger;
