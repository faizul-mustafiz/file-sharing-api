require('dotenv').config();
module.exports = {
  //app environment variables
  API_PROTOCOL: process.env.API_PROTOCOL,
  API_HOST: process.env.API_HOST,
  API_PORT: process.env.API_PORT,
  BASE_API_ROUTE: process.env.BASE_API_ROUTE,

  // redis environment variables
  REDIS_URL: process.env.REDIS_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  // file storage environment variables
  FOLDER: process.env.FOLDER,
  BUCKET_NAME: process.env.BUCKET_NAME,
  PROVIDER: process.env.PROVIDER,
  FORM_DATA_KEY: process.env.FORM_DATA_KEY,
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
  MAX_FILES: process.env.MAX_FILES,
};
