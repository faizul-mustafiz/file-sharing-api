const {
  isPublicKeyIdentityExists,
  getPublicKeyIdentity,
} = require('../helpers/redis.helper');
const BadRequestError = require('../errors/BadRequestError');
const logger = require('../loggers/logger');

const validatePublicKey = async (req, res, next) => {
  try {
    const { publicKey } = req.params;
    const identityExists = await isPublicKeyIdentityExists(publicKey);
    if (!identityExists) {
      throw new BadRequestError(
        'public-key-identity-does-not-exists-in-redis',
        'Invalid file key',
      );
    }
    const fileInfo = await getPublicKeyIdentity(publicKey);
    logger.debug('file-info-redis: %s', fileInfo);
    res.locals.fileInfo = fileInfo;
    next();
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : 'validatePublicKey-base-error:';
    next(error);
  }
};

module.exports = validatePublicKey;
