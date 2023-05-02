const logger = require('../loggers/logger');

const {
  generateKeyPair,
  generateFileUploadSuccessResponseResult,
  generateFileDeleteSuccessResponseResult,
} = require('../utility/file.utility');

const { config } = require('../configs/file.config');
const { readConfigJsonFile } = require('../plugins/configFile.plugin');

const fileStorageConfig = readConfigJsonFile(config);
const {
  deletePrivateKeyIdentity,
  deletePublicKeyIdentity,
} = require('../helpers/redis.helper');
const { storeFileInfoDataToRedis } = require('../helpers/file.helper');

const { MulterError } = require('multer');
const InternalServerError = require('../errors/InternalServerError');
const { Success, MulterErrorResponse } = require('../responses/httpResponse');
const FileControllerOrigin = require('../enums/fileControllerOrigin');

const processFile = require('../middlewares/processFile.middleware');

/**
 * * cloud file store related imports
 */
const { bucketName } = fileStorageConfig;
/**
 * * google cloud bucket storage related imports
 */
const { Storage } = require('@google-cloud/storage');
const cloudStorage = new Storage({
  keyFilename: config,
});
const bucket = cloudStorage.bucket(bucketName);

const StoreFile = async (req, res, next) => {
  try {
    const { publicKey, privateKey } = generateKeyPair();
    req.keys = { publicKey, privateKey };
    logger.debug(req.keys);
    await processFile(req, res);
    logger.info('req: %s', req.file);
    const { originalname, buffer } = req.file;
    const blob = bucket.file(originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: req.file.mimetype,
      },
    });
    blobStream.on('error', (error) => {
      logger.error('blob-create-write-stream-error', error);
      throw new InternalServerError(
        'blob-create-write-stream-error',
        'File upload error',
      );
    });
    blobStream.end(buffer);
    const redisStoreResult = await storeFileInfoDataToRedis(req);
    logger.debug('file-info-stored-to-redis: %s', redisStoreResult);
    const result = generateFileUploadSuccessResponseResult(req);
    logger.debug('result', result);
    return Success(res, { message: 'File upload successfully', result });
  } catch (error) {
    if (error instanceof MulterError) {
      return MulterErrorResponse(res, error.code);
    } else {
      error.origin = error.origin
        ? error.origin
        : FileControllerOrigin.storeFile;
      next(error);
    }
  }
};

const FetchFile = async (req, res, next) => {
  const fileInfo = res.locals.fileInfo;
  logger.debug('fileInfo: %s', fileInfo);
  res.setHeader('Content-Type', fileInfo.mimetype);
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileInfo.originalname}"`,
  );
  try {
    const blob = bucket.file(fileInfo.originalname);
    const blobStream = blob.createReadStream();
    blobStream.on('error', (error) => {
      logger.error('blob-create-read-stream-error', error);
      throw new InternalServerError(
        'blob-create-read-stream-error',
        'File download error',
      );
    });
    blobStream.pipe(res);
  } catch (error) {
    error.origin = error.origin ? error.origin : FileControllerOrigin.fetchFile;
    next(error);
  }
};

const RemoveFile = async (req, res, next) => {
  const fileInfo = res.locals.fileInfo;
  logger.debug('fileInfo: %s', fileInfo);
  try {
    try {
      await bucket.file(fileInfo.originalname).delete();
    } catch (error) {
      throw new InternalServerError('file-unlink-error', 'File delete error');
    }
    const result = generateFileDeleteSuccessResponseResult(fileInfo);
    await deletePublicKeyIdentity(fileInfo.publicKey);
    await deletePrivateKeyIdentity(fileInfo.privateKey);
    return Success(res, { message: 'File deleted', result });
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : FileControllerOrigin.removeFile;
    next(error);
  }
};

module.exports = { StoreFile, FetchFile, RemoveFile };
