/**
 * * require the winston logger module
 */
const winston = require('winston');
/**
 * * import necessary formats from winston.format
 */
const { combine, timestamp, printf, splat, json } = winston.format;
/**
 * *customFormat if you want to print your logs in custom way
 */
const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp}|${level}|message:${message}|stack-trace:${stack}`;
});
/**
 * * paths for different log for winston transporter
 */
const path = require('path');
const appLogFilePath = path.join(__dirname, '../logs', 'app.log');
const errorLogFilePath = path.join(__dirname, '../logs', 'error.log');

/**
 * * transporter options for app, error and console transporters
 */
const transporterOptions = {
  app: {
    level: 'info',
    filename: appLogFilePath,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    // format: customFormat,
  },
  error: {
    level: 'error',
    filename: errorLogFilePath,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
  },
};

const testEnvTransporterOption = {
  console: {
    level: 'error',
    handleExceptions: true,
    json: true,
    colorize: true,
  },
};

/**
 * * base logger using winston.createLogger
 * * you can also build different loggers with different transporters
 * * testLogger = winston.createLogger({level: winston.config.npm.levels, transports:[your custom transporter here]})
 */
let logger = {};
if (process.env.NODE_ENV === 'testing') {
  logger = winston.createLogger({
    levels: winston.config.npm.levels,
    format: combine(timestamp(), splat(), json()),
    transports: [
      new winston.transports.Console(testEnvTransporterOption.console),
    ],
    exitOnError: false,
  });
} else {
  logger = winston.createLogger({
    levels: winston.config.npm.levels,
    format: combine(timestamp(), splat(), json()),
    transports: [
      new winston.transports.File(transporterOptions.app),
      new winston.transports.File(transporterOptions.error),
      new winston.transports.Console(transporterOptions.console),
    ],
    exitOnError: false,
  });
}

module.exports = logger;
