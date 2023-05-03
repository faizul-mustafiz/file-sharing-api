const corn = require('node-cron');
const { cleanupJobInterval } = require('../configs/scheduler.config');

const { readdir, unlink } = require('fs');

const { config } = require('../configs/file.config');
const { readConfigJsonFile } = require('../plugins/configFile.plugin');
const fileStorageConfig = readConfigJsonFile(config);

const { provider } = require('../configs/file.config');

const { bucketName } = fileStorageConfig;
/**
 * * google cloud bucket storage related imports
 */
const { Storage } = require('@google-cloud/storage');
const Provider = require('../enums/provider.enum');
const logger = require('../loggers/logger');
const { deleteDataFromRedis } = require('../helpers/redis.helper');
const cloudStorage = new Storage({
  keyFilename: config,
});
const bucket = cloudStorage.bucket(bucketName);

const cleanUpLocalStorage = () => {
  logger.info('local-storage-cleanup-job-started');
  readdir(bucketName, (error, files) => {
    logger.info('local-storage-files', files);
    if (error) {
      logger.error('local-storage-get-files-error', error);
    }
    logger.info('local-storage-files: %s', files);
    if (files.length > 0) {
      files.forEach((file) => {
        const filePath = `${bucketName}/${file}`;
        unlink(filePath, (error) => {
          if (error) {
            logger.error('local-storage-file-delete-error', error);
          }
        });
      });
      deleteRedisKeysAfterBucketCleanup();
    }
  });
};

const cleanupCloudStorage = async () => {
  logger.info('cloud-storage-cleanup-job-started');
  try {
    const [files] = await bucket.getFiles();
    logger.info('cloud-storage-files', files);
    if (files.length > 0) {
      files.forEach(async (file) => {
        try {
          await bucket.file(file.name).delete();
        } catch (error) {
          logger.info('cloud-storage-file-delete-error', error);
        }
      });
      deleteRedisKeysAfterBucketCleanup();
    }
  } catch (error) {
    logger.info('cloud-storage-base-error', error);
  }
};

const deleteRedisKeysAfterBucketCleanup = () => {
  logger.info('delete-redis-keys-after-bucket-cleanup-started');
  try {
    deleteDataFromRedis();
  } catch (error) {
    logger.error('delete-redis-keys-after-bucket-cleanup-error', error);
  }
};

const fileCleanupSchedular = async () => {};
const cornFunction =
  provider === Provider.local ? cleanUpLocalStorage : cleanupCloudStorage;

module.exports = corn.schedule(`0 0 0 ${cleanupJobInterval} * *`, cornFunction);
