const { generateFilePayloadForRedis } = require('../utility/file.utility');
const {
  setPublicKeyIdentity,
  setPrivateKeyIdentity,
} = require('./redis.helper');
const { unlink } = require('fs');
const { readConfigJsonFile } = require('../plugins/configFile.plugin');
const { config } = require('../configs/file.config');
const fileStorageConfig = readConfigJsonFile(config);
const { bucketName } = fileStorageConfig;
const { Storage } = require('@google-cloud/storage');
const cloudStorage = new Storage({
  keyFilename: config,
});
const bucket = cloudStorage.bucket(bucketName);

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

module.exports = {
  storeFileInfoDataToRedis,
  unlinkFileFromLocalStorage,
};
