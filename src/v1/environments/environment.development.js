require('dotenv').config();
module.exports = {
  //app environment variables
  API_PROTOCOL: process.env.API_PROTOCOL,
  API_HOST: process.env.API_HOST,
  API_PORT: process.env.API_PORT,
  BASE_API_ROUTE: process.env.BASE_API_ROUTE,

  // redis environment variables
  REDIS_URL: process.env.REDIS_URL,

  // file storage environment variables
  PROVIDER: process.env.PROVIDER,
  CONFIG: process.env.CONFIG,
  FORM_DATA_KEY: process.env.FORM_DATA_KEY,
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,

  // rate limiter environment variables
  MAX_ALLOWED_REQUESTS: process.env.MAX_ALLOWED_REQUESTS,
  WINDOW_TTL: process.env.WINDOW_TTL,
  WINDOW_LOG_INTERVAL_TTL: process.env.WINDOW_LOG_INTERVAL_TTL,

  // file cleanup related variables
  CLEANUP_JOB_INTERVAL: process.env.CLEANUP_JOB_INTERVAL,
};
