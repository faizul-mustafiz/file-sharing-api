const { generateFilePayloadForRedis } = require('../utility/file.utility');
const {
  setPublicKeyIdentity,
  setPrivateKeyIdentity,
} = require('../helpers/redis.helper');
const { unlink, unlinkSync } = require('fs');
const storeFileInfoDataToRedis = async (payload) => {
  if (payload && payload.keys && payload.file) {
    const { publicKey, privateKey } = payload.keys;
    const filePayload = generateFilePayloadForRedis(payload);
    const fileStoreResult = await setPublicKeyIdentity(publicKey, filePayload);
    const privateKeyStoreResult = await setPrivateKeyIdentity(
      privateKey,
      publicKey,
    );
    return { fileStoreResult, privateKeyStoreResult };
  }
};

const unlinkFileFromLocalStorage = async (fileInfo) => {
  return unlink(fileInfo.path);
};

module.exports = { storeFileInfoDataToRedis, unlinkFileFromLocalStorage };
