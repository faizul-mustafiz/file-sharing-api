const app = require('./src/v1/app');
const { port, host } = require('./src/v1/configs/app.config');
const { closeRedisPluginConnection } = require('./src/v1/plugins/redis.plugin');
const logger = require('./src/v1/loggers/logger');

/**
 * * create express server with port and host imported form app.config
 */
const server = app.listen(port, host, () => {
  logger.debug('Express is running on →');
  console.table({
    host: host,
    port: port,
  });
});
/**
 * * this method is for gracefully closing the express server(node.js process)
 * @param graceFullyCloseServerAndPluginConnections(exitCode)
 * * this function will first close the http server and then close redis plugin connection
 * * and then proceed with process.exit(exitCode)
 */
const graceFullyCloseServerAndPluginConnections = (exitCode) => {
  server.close(() => {
    logger.debug('Closing the Server...');
    closeRedisPluginConnection();
    logger.debug(`Closing the main process with exitCode: ${exitCode}`);
    process.exit(exitCode);
  });
};
/**
 * * This event is emitted when there is any uncaughtException in the code.
 * * this will log the uncaughtException error in the error logger and proceed to
 * *  process.exit with exitCode = 1. Which means the process exited with error
 */
process.on('uncaughtException', (error) => {
  logger.error('uncaughtException-error:', error);
  process.exit(1);
});
/**
 * * This event is emitted when there is any unhandledRejection in the code.
 * * this will log the unhandledRejection error in the error logger and proceed to
 * *  process.exit with exitCode = 1. Which means the process exited with error
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('unhandledRejection-at %s, %s', promise, `reason: ${reason}`);
  process.exit(1);
});
/**
 * * on these events like SIGINT, SIGUSR1, SIGUSR2, SIGTERM this will also proceed to
 * * graceFullyCloseServerAndPluginConnections with exitCode = 0. Which means the process exited without error
 * @param graceFullyCloseServerAndPluginConnections(exitCode)
 */
[`SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((event) => {
  process.on(event, () => {
    logger.debug('Process event type: %s', event);
    graceFullyCloseServerAndPluginConnections(0);
  });
});
/**
 * * logs the beforeExit event log
 */
process.on('beforeExit', (code) => {
  logger.debug(`Process beforeExit event with code: ${code}`);
});
/**
 * * logs the exit event log
 */
process.on('exit', (code) => {
  logger.debug(`Process exit event with code: ${code}`);
});

module.exports = app;
