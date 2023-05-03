const { createReadStream, unlink } = require('fs');
const logger = require('../loggers/logger');

const {
  generateKeyPair,
  generateFileUploadSuccessResponseResult,
  generateFileDeleteSuccessResponseResult,
  checkIfFileExists,
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
const BadRequestError = require('../errors/BadRequestError');
const { Success, MulterErrorResponse } = require('../responses/httpResponse');
const FileControllerOrigin = require('../enums/fileControllerOrigin');

const processFile = require('../middlewares/processFile.middleware');

/**
 * * file store related imports
 */
const { bucketName } = fileStorageConfig;

const StoreFile = async (req, res, next) => {
  try {
    const { publicKey, privateKey } = generateKeyPair();
    req.keys = { publicKey, privateKey };
    logger.debug(req.keys);
    await processFile(req, res);
    logger.info('req: %s', req.file);
    if (req.file == undefined) {
      throw new BadRequestError(
        'upload-file-not-present-in-request',
        'Please upload a file',
      );
    }
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
  try {
    const filePath = `${bucketName}/${fileInfo.publicKey}`;
    const fileExists = checkIfFileExists(filePath);
    if (!fileExists) {
      throw new BadRequestError(
        'get-file-does-not-exists',
        'Requested file does not exists in bucket',
      );
    }
    const file = createReadStream(filePath);
    res.setHeader('Content-Type', fileInfo.mimetype);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileInfo.originalname}"`,
    );
    file.pipe(res);
  } catch (error) {
    error.origin = error.origin ? error.origin : FileControllerOrigin.fetchFile;
    next(error);
  }
};

const RemoveFile = async (req, res, next) => {
  const fileInfo = res.locals.fileInfo;
  logger.debug('fileInfo: %s', fileInfo);
  try {
    const filePath = `${bucketName}/${fileInfo.publicKey}`;
    const fileExists = checkIfFileExists(filePath);
    if (!fileExists) {
      throw new BadRequestError(
        'get-file-does-not-exists',
        'Requested file does not exists in bucket',
      );
    }
    unlink(filePath, async (error) => {
      if (error) {
        throw new InternalServerError('file-unlink-error', 'File delete error');
      }
    });
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
