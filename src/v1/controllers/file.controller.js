const uploadFile = require('../middlewares/localBucketStorage.middleware');
const {
  generateKeyPair,
  generateFileUploadSuccessResponseResult,
  generateFileDeleteSuccessResponseResult,
  checkIfFileExists,
} = require('../utility/file.utility');
const { createReadStream } = require('fs');

const BadRequestError = require('../errors/BadRequestError');
const { MulterError } = require('multer');
const { MulterErrorResponse, Success } = require('../responses/httpResponse');
const { storeFileInfoDataToRedis } = require('../helpers/fileStorageHelper');
const logger = require('../loggers/logger');
const { unlink, unlinkSync } = require('fs');
const InternalServerError = require('../errors/InternalServerError');
const FileControllerOrigin = require('../enums/fileControllerOrigin');
const {
  deletePrivateKeyIdentity,
  deletePublicKeyIdentity,
} = require('../helpers/redis.helper');

upload = async (req, res, next) => {
  try {
    const { publicKey, privateKey } = generateKeyPair();
    req.keys = { publicKey, privateKey };
    logger.debug(req.keys);
    await uploadFile(req, res);
    logger.debug('req', req.file);
    if (req.file == undefined) {
      throw new BadRequestError(
        'upload-file-not-present-in-request',
        'please upload a file',
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
      error.origin = error.origin ? error.origin : FileControllerOrigin.upload;
      next(error);
    }
  }
};
getFile = async (req, res, next) => {
  const fileInfo = res.locals.fileInfo;
  logger.debug('fileInfo: %s', fileInfo);
  try {
    const filePath = fileInfo.path;
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
    error.origin = error.origin ? error.origin : FileControllerOrigin.getFile;
    next(error);
  }
};
deleteFile = async (req, res, next) => {
  const fileInfo = res.locals.fileInfo;
  try {
    const filePath = fileInfo.path;
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
      const result = generateFileDeleteSuccessResponseResult(fileInfo);
      await deletePublicKeyIdentity(fileInfo.publicKey);
      await deletePrivateKeyIdentity(fileInfo.privateKey);
      return Success(res, { message: 'File deleted', result });
    });
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : FileControllerOrigin.deleteFile;
    next(error);
  }
};

module.exports = { upload, getFile, deleteFile };
