const {
  isPublicKeyIdentityExists,
  getPublicKeyIdentity,
  isPrivateKeyIdentityExists,
  getPrivateKeyIdentity,
} = require('../helpers/redis.helper');
const BadRequestError = require('../errors/BadRequestError');
const logger = require('../loggers/logger');

const validatePrivateKey = async (req, res, next) => {
  try {
    const { privateKey } = req.params;
    const privateKeyIdentityExists = await isPrivateKeyIdentityExists(
      privateKey,
    );
    if (!privateKeyIdentityExists) {
      throw new BadRequestError(
        'private-key-identity-does-not-exists-in-redis',
        'Invalid file key',
      );
    }
    const publicKey = await getPrivateKeyIdentity(privateKey);
    logger.debug('public-key: %s', publicKey);
    const publicKeyIdentityExists = await isPublicKeyIdentityExists(publicKey);
    if (!publicKeyIdentityExists) {
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

module.exports = validatePrivateKey;
