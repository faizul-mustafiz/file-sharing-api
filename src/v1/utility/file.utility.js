const { randomBytes } = require('crypto');
const { existsSync } = require('fs');
const generateKeyPair = () => {
  const publicKey = randomBytes(16).toString('hex');
  const privateKey = randomBytes(32).toString('hex');
  return { publicKey, privateKey };
};

const generateFilePayloadForRedis = (payload) => {
  if (payload && payload.file && payload.keys)
    return {
      originalname: payload.file.originalname,
      mimetype: payload.file.mimetype,
      encoding: payload.file.encoding,
      publicKey: payload.keys.publicKey,
      privateKey: payload.keys.privateKey,
    };
};

const generateFileUploadSuccessResponseResult = (payload) => {
  if (payload && payload.file && payload.keys)
    return {
      fileName: payload.file.originalname,
      publicKey: payload.keys.publicKey,
      privateKey: payload.keys.privateKey,
    };
};
const generateFileDeleteSuccessResponseResult = (payload) => {
  return {
    fileName: payload.originalname,
  };
};

const checkIfFileExists = (path) => {
  return existsSync(path);
};

module.exports = {
  generateKeyPair,
  generateFilePayloadForRedis,
  generateFileUploadSuccessResponseResult,
  generateFileDeleteSuccessResponseResult,
  checkIfFileExists,
};
