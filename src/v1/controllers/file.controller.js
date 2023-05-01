const uploadFile = require('../middlewares/localBucketStorage.middleware');
const {
  generateKeyPair,
  generateFileUploadSuccessResponseResult,
  generateFileDeleteSuccessResponseResult,
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
  const filePath = fileInfo.path;
  const file = createReadStream(filePath);
  const filename = fileInfo.originalname;
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  file.pipe(res);
};
deleteFile = async (req, res, next) => {
  const fileInfo = res.locals.fileInfo;
  try {
    unlink(fileInfo.path, (error) => {
      if (error) {
        throw new InternalServerError('file-unlink-error', 'File delete error');
      }
      const result = generateFileDeleteSuccessResponseResult(fileInfo);
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
