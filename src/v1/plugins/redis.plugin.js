const { createClient } = require('redis');
const redisConfig = require('../configs/redis.config');
const logger = require('../loggers/logger');
/**
 * * create redisClient with redisLabs connection string url imported from the redisConfig
 */
const redisClient = createClient({
  url: redisConfig.url,
});
/**
 * * redisClient onConnect callback function
 */
redisConnectCallback = () => {
  logger.debug(
    'redis-connect-callback-response: %s',
    'Connection to redis successful',
  );
};
/**
 * * redisClient onError callback function
 * * onError event close the connection and exit the process in exitCode = 0
 */
redisErrorCallback = (error) => {
  logger.error('redis-error-callback-error:', error);
  redisClient.disconnect();
  process.exit(0);
};
/**
 * * this method is for closing redisClient connection for graceful server shutdown
 */
closeRedisPluginConnection = () => {
  logger.debug('Closing redis plugin connection...');
  redisClient.disconnect();
};
/**
 * * connect to redis client
 */
redisClient.connect();
/**
 * * redisClient onConnect and onError event handler
 */
redisClient.on('connect', redisConnectCallback);
redisClient.on('error', redisErrorCallback);

module.exports = { redisClient, closeRedisPluginConnection };
